import { useState } from "react";
import VerificationInput from "@/components/VerificationInput";
import VerificationResults from "@/components/VerificationResults";
import VerificationCard from "@/components/VerificationCard";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

//todo: remove mock functionality - this is just for prototype demo
const mockVerificationData = [
  {
    claim: "The global temperature has increased by 1.1°C since pre-industrial times",
    sourceUrl: "https://climate.nasa.gov/vital-signs/global-temperature/",
    status: "verified" as const,
    confidence: 95,
    explanation: "The source directly states that global average surface temperature has risen about 1.1°C since the late 19th century, which matches the claim exactly.",
    sourceExcerpt: "The planet's average surface temperature has risen about 1.1 degrees Celsius (2 degrees Fahrenheit) since the late 19th century...",
  },
  {
    claim: "Amazon rainforest covers 5.5 million square kilometers",
    sourceUrl: "https://www.worldwildlife.org/places/amazon",
    status: "partial" as const,
    confidence: 67,
    explanation: "The source mentions the Amazon spans approximately 6.7 million square kilometers, which differs from the claimed 5.5 million. The claim may be referring to forest area specifically.",
    sourceExcerpt: "The Amazon spans 6.7 million square kilometers across nine countries...",
  },
  {
    claim: "Over 80% of ocean plastic comes from land-based sources",
    sourceUrl: "https://oceanconservancy.org/trash-free-seas/plastics-in-the-ocean/",
    status: "verified" as const,
    confidence: 92,
    explanation: "The source confirms that the majority of ocean plastic pollution originates from land-based sources, supporting this claim.",
    sourceExcerpt: "An estimated 80 percent of ocean plastic comes from land-based sources...",
  },
  {
    claim: "Mars has three moons orbiting it",
    sourceUrl: "https://science.nasa.gov/mars/",
    status: "failed" as const,
    confidence: 15,
    explanation: "The source clearly states Mars has two moons (Phobos and Deimos), not three. This claim is contradicted by the source.",
    sourceExcerpt: "Mars has two small moons, Phobos and Deimos, that may be captured asteroids.",
  },
];

export default function Home() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleVerify = (text: string) => {
    console.log("Starting verification for:", text);
    setIsVerifying(true);
    
    //todo: remove mock functionality - simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setShowResults(true);
    }, 1500);
  };

  const handleReset = () => {
    console.log("Resetting verification");
    setShowResults(false);
  };

  //todo: remove mock functionality - calculate from real data
  const stats = {
    totalClaims: mockVerificationData.length,
    verified: mockVerificationData.filter(v => v.status === "verified").length,
    partial: mockVerificationData.filter(v => v.status === "partial").length,
    failed: mockVerificationData.filter(v => v.status === "failed").length,
  };

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
          <div className="max-w-3xl mx-auto">
            <VerificationInput onVerify={handleVerify} isLoading={isVerifying} />
          </div>
        ) : (
          <div className="space-y-6">
            <VerificationResults {...stats} />
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Verification Details</h2>
              <div className="space-y-4">
                {mockVerificationData.map((verification, index) => (
                  <VerificationCard key={index} {...verification} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
