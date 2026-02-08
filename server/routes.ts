import type { Express } from "express";
import { createServer, type Server } from "http";
import { verificationRequestSchema, type VerificationResponse } from "@shared/schema";
import { extractClaims } from "./lib/claimExtractor";
import { fetchMultipleSources } from "./lib/scraper";
import { verifyClaim } from "./lib/verifier";
import { suggestAlternativeSources } from "./lib/sourceSuggester";
import { lookupFactChecks } from "./lib/factChecker";
import pLimit from "p-limit";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // POST /api/verify - Verify claims in text against their sources
  app.post("/api/verify", async (req, res) => {
    try {
      // Validate request body
      const validation = verificationRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: validation.error.issues 
        });
      }

      const { text } = validation.data;

      // Step 1: Extract claims and their source URLs using AI
      console.log("Extracting claims from text...");
      const claims = await extractClaims(text);
      
      if (claims.length === 0) {
        return res.json({
          verifications: [],
          summary: {
            totalClaims: 0,
            verified: 0,
            partial: 0,
            failed: 0,
          },
        } as VerificationResponse);
      }

      console.log(`Found ${claims.length} claims with sources`);

      // Step 2: Fetch source content for all URLs
      const uniqueUrls = Array.from(new Set(claims.map(c => c.sourceUrl)));
      console.log(`Fetching ${uniqueUrls.length} unique sources...`);
      
      const sources = await fetchMultipleSources(uniqueUrls);
      const sourceMap = new Map(sources.map(s => [s.url, s]));

      // Step 3: Verify each claim against its source with concurrency limit
      console.log("Verifying claims against sources...");
      const limit = pLimit(3); // Process 3 verifications concurrently
      
      const verificationPromises = claims.map(claim =>
        limit(async () => {
          const sourceContent = sourceMap.get(claim.sourceUrl);
          if (!sourceContent || sourceContent.error) {
            const errorDetail = sourceContent?.error || "Source content could not be retrieved";
            return {
              claim: claim.claim,
              sourceUrl: claim.sourceUrl,
              status: "failed" as const,
              confidence: 0,
              explanation: errorDetail,
            };
          }
          return await verifyClaim(claim.claim, sourceContent);
        })
      );

      const verifications = await Promise.all(verificationPromises);

      // Step 4: Generate source suggestions and look up fact-checks in parallel
      console.log("Generating alternative source suggestions and checking fact-check databases...");
      const suggestionLimit = pLimit(2);
      const factCheckLimit = pLimit(2);
      
      const enrichedVerifications = await Promise.all(
        verifications.map(async (verification) => {
          const needsSuggestions = 
            verification.status === "failed" ||
            verification.status === "partial" ||
            (verification.status === "verified" && verification.confidence < 90);

          const [suggestions, factChecks] = await Promise.all([
            needsSuggestions
              ? suggestionLimit(() =>
                  suggestAlternativeSources(
                    verification.claim,
                    verification.status,
                    verification.confidence
                  )
                )
              : Promise.resolve(undefined),
            factCheckLimit(() => lookupFactChecks(verification.claim)),
          ]);

          return {
            ...verification,
            ...(suggestions ? { suggestedSources: suggestions } : {}),
            ...(factChecks && factChecks.length > 0 ? { factChecks } : {}),
          };
        })
      );

      // Calculate summary statistics
      const summary = {
        totalClaims: enrichedVerifications.length,
        verified: enrichedVerifications.filter(v => v.status === "verified").length,
        partial: enrichedVerifications.filter(v => v.status === "partial").length,
        failed: enrichedVerifications.filter(v => v.status === "failed").length,
      };

      console.log(`Verification complete: ${summary.verified} verified, ${summary.partial} partial, ${summary.failed} failed`);

      const response: VerificationResponse = {
        verifications: enrichedVerifications,
        summary,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error in /api/verify:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
