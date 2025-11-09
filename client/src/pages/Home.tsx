import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import VerificationInput from "@/components/VerificationInput";
import VerificationResults from "@/components/VerificationResults";
import VerificationCard from "@/components/VerificationCard";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { VerificationResponse } from "@shared/schema";

export default function Home() {
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null);

  const verifyMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/verify", { text });
      const data = await response.json() as VerificationResponse;
      return data;
    },
    onSuccess: (data) => {
      setVerificationData(data);
    },
  });

  const handleVerify = (text: string) => {
    console.log("Starting verification for:", text);
    verifyMutation.mutate(text);
  };

  const handleReset = () => {
    console.log("Resetting verification");
    setVerificationData(null);
    verifyMutation.reset();
  };

  const showResults = verificationData !== null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">SourceCheck</h1>
              <p className="text-sm text-muted-foreground">AI Source Verification Tool</p>
            </div>
            {showResults && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={verifyMutation.isPending}
                data-testid="button-new-verification"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Verification
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!showResults ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <VerificationInput onVerify={handleVerify} isLoading={verifyMutation.isPending} />
            
            {verifyMutation.isError && (
              <div 
                className="bg-error-light border border-error-border rounded-md p-4 flex items-start gap-3"
                data-testid="alert-error"
              >
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-error">Verification Failed</h4>
                  <p className="text-sm text-error mt-1">
                    {verifyMutation.error instanceof Error 
                      ? verifyMutation.error.message 
                      : "An error occurred while verifying sources. Please try again."}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <VerificationResults {...verificationData.summary} />
            
            {verificationData.verifications.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Verification Details</h2>
                <div className="space-y-4">
                  {verificationData.verifications.map((verification, index) => (
                    <VerificationCard key={index} {...verification} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No claims with sources were found in the text. Make sure your input includes factual claims with cited source URLs.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors" data-testid="link-about">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors"
              data-testid="link-github"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
