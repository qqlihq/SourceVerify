import { createChatCompletion } from "./openai";
import type { ExtractedClaim } from "@shared/schema";

export async function extractClaims(text: string): Promise<ExtractedClaim[]> {
  const prompt = `You are a claim extraction assistant. Analyze the following text and extract all factual claims along with their cited sources.

For each claim:
1. Identify factual statements (not opinions or questions)
2. Find the associated source URL citation (if any)
3. Extract the claim text clearly

Return your response as a JSON object with this structure:
{
  "claims": [
    {
      "claim": "The exact factual claim text",
      "sourceUrl": "The cited URL or empty string if no source"
    }
  ]
}

Only include claims that have source URLs. Ignore claims without sources.

Text to analyze:
${text}`;

  try {
    const response = await createChatCompletion(
      [{ role: "user", content: prompt }],
      { responseFormat: "json_object" }
    );

    const parsed = JSON.parse(response);
    const claims: ExtractedClaim[] = parsed.claims || [];

    // Filter out claims without valid URLs
    return claims.filter(claim => 
      claim.sourceUrl && 
      claim.sourceUrl.trim() !== "" &&
      (claim.sourceUrl.startsWith("http://") || claim.sourceUrl.startsWith("https://"))
    );
  } catch (error) {
    console.error("Error extracting claims:", error);
    return [];
  }
}
