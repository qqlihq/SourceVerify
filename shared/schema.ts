import { z } from "zod";

// Verification request schema
export const verificationRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type VerificationRequest = z.infer<typeof verificationRequestSchema>;

// Verification result types
export type VerificationStatus = "verified" | "partial" | "failed";

export interface ClaimVerification {
  claim: string;
  sourceUrl: string;
  status: VerificationStatus;
  confidence: number;
  explanation: string;
  sourceExcerpt?: string;
}

export interface VerificationResponse {
  verifications: ClaimVerification[];
  summary: {
    totalClaims: number;
    verified: number;
    partial: number;
    failed: number;
  };
}

// Extracted claim with source
export interface ExtractedClaim {
  claim: string;
  sourceUrl: string;
}
