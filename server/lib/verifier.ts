import { createChatCompletion } from "./openai";
import type { ClaimVerification, VerificationStatus } from "@shared/schema";
import type { ScrapedContent } from "./scraper";

export async function verifyClaim(
  claim: string,
  sourceContent: ScrapedContent
): Promise<ClaimVerification> {
  // If fetching failed, return failed verification
  if (sourceContent.error || !sourceContent.text) {
    return {
      claim,
      sourceUrl: sourceContent.url,
      status: "failed",
      confidence: 10,
      explanation: `Unable to fetch source content: ${sourceContent.error || "No content available"}`,
    };
  }

  const prompt = `You are a fact-checking assistant. Verify whether the following claim is supported by the source content.

CLAIM:
"${claim}"

SOURCE CONTENT:
${sourceContent.text}

Analyze whether the claim is:
1. VERIFIED: The source directly supports the claim with matching information
2. PARTIAL: The source has related information but with differences (different numbers, qualifications, or partial support)
3. FAILED: The claim is contradicted or not found in the source

Provide:
- status: one of "verified", "partial", or "failed"
- confidence: a number from 0-100 indicating how confident you are in this assessment
- explanation: a clear explanation of your reasoning (2-3 sentences)
- sourceExcerpt: the relevant excerpt from the source (if found, otherwise empty string)

Return your response as a JSON object:
{
  "status": "verified|partial|failed",
  "confidence": 85,
  "explanation": "Your explanation here",
  "sourceExcerpt": "Relevant text from source"
}`;

  try {
    const response = await createChatCompletion(
      [{ role: "user", content: prompt }],
      { responseFormat: "json_object" }
    );

    const result = JSON.parse(response);

    return {
      claim,
      sourceUrl: sourceContent.url,
      status: result.status as VerificationStatus,
      confidence: Math.min(100, Math.max(0, result.confidence || 50)),
      explanation: result.explanation || "No explanation provided",
      sourceExcerpt: result.sourceExcerpt || undefined,
    };
  } catch (error) {
    console.error("Error verifying claim:", error);
    return {
      claim,
      sourceUrl: sourceContent.url,
      status: "failed",
      confidence: 0,
      explanation: "Error occurred during verification process",
    };
  }
}
