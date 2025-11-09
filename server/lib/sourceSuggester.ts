import OpenAI from "openai";
import type { SourceSuggestion, VerificationStatus } from "@shared/schema";
import { getOpenAIClient } from "./openai";

export async function suggestAlternativeSources(
  claim: string,
  status: VerificationStatus,
  confidence: number
): Promise<SourceSuggestion[]> {
  const openai = getOpenAIClient();

  const prompt = generatePrompt(claim, status, confidence);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a research assistant that helps users find authoritative sources for fact-checking.
Your task is to suggest specific, authoritative sources where users can find reliable information to either:
- Strengthen a claim (if verified but needs more evidence)
- Correct or clarify a claim (if not verified or partially verified)

Suggest 3-5 high-quality sources. Focus on:
- Government agencies and official databases
- Academic institutions and peer-reviewed journals
- Reputable international organizations
- Industry-standard references

Return your response as a JSON array of objects with this structure:
[
  {
    "name": "Source name (e.g., 'NASA Climate Data Portal')",
    "url": "Direct URL if applicable (optional)",
    "description": "Brief explanation of why this source is relevant",
    "searchQuery": "Specific search query to use (optional)"
  }
]

Be specific and actionable. If you provide a URL, make sure it's a real, authoritative source.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(responseContent);
    
    // Handle both direct array and object with sources array
    const suggestions = Array.isArray(parsed) ? parsed : (parsed.sources || parsed.suggestions || []);

    return suggestions.map((s: any) => ({
      name: s.name || "Unknown Source",
      url: s.url,
      description: s.description || "",
      searchQuery: s.searchQuery,
    }));
  } catch (error) {
    console.error("Error generating source suggestions:", error);
    // Return empty array on error instead of throwing
    return [];
  }
}

function generatePrompt(
  claim: string,
  status: VerificationStatus,
  confidence: number
): string {
  const statusContext = {
    verified: `This claim was VERIFIED with ${confidence}% confidence. Suggest authoritative sources where users can find additional supporting evidence to strengthen this claim.`,
    partial: `This claim was PARTIALLY VERIFIED with ${confidence}% confidence. Suggest authoritative sources where users can find more complete or clarifying information.`,
    failed: `This claim FAILED VERIFICATION with only ${confidence}% confidence. Suggest authoritative sources where users can find accurate information to correct or clarify this claim.`,
  };

  return `Claim: "${claim}"

Status: ${statusContext[status]}

Please suggest 3-5 specific, authoritative sources where this information can be verified or corrected. Return your response as a JSON object with a "sources" array.`;
}
