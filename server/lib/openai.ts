import OpenAI from "openai";
import pRetry, { AbortError } from "p-retry";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Helper function to check if error is rate limit or quota violation
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Make OpenAI API call with automatic retries
export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string;
    temperature?: number;
    responseFormat?: "json_object" | "text";
  } = {}
): Promise<string> {
  return await pRetry(
    async () => {
      try {
        const response = await openai.chat.completions.create({
          model: options.model || "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages,
          max_completion_tokens: 8192,
          ...(options.temperature !== undefined && { temperature: options.temperature }),
          ...(options.responseFormat === "json_object" && { response_format: { type: "json_object" } }),
        });
        return response.choices[0]?.message?.content || "";
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error; // Rethrow to trigger p-retry
        }
        // For non-rate-limit errors, abort retries immediately
        throw new AbortError(error);
      }
    },
    {
      retries: 7,
      minTimeout: 2000,
      maxTimeout: 128000,
      factor: 2,
    }
  );
}
