import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ConfidenceScore from "./ConfidenceScore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type VerificationStatus = "verified" | "partial" | "failed";

interface VerificationCardProps {
  claim: string;
  sourceUrl: string;
  status: VerificationStatus;
  confidence: number;
  explanation: string;
  sourceExcerpt?: string;
}

export default function VerificationCard({
  claim,
  sourceUrl,
  status,
  confidence,
  explanation,
  sourceExcerpt,
}: VerificationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.substring(0, 40) + (urlObj.pathname.length > 40 ? "..." : "");
    } catch {
      return url.substring(0, 60) + (url.length > 60 ? "..." : "");
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-verification-${status}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <StatusBadge status={status} />
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-auto p-0 text-muted-foreground hover-elevate"
          data-testid="button-open-source"
        >
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-l-4 border-primary pl-4 py-1">
          <p className="text-base leading-relaxed" data-testid="text-claim">
            "{claim}"
          </p>
        </div>

        <div className="space-y-2">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-primary hover:underline block truncate"
            title={sourceUrl}
            data-testid="link-source"
          >
            {truncateUrl(sourceUrl)}
          </a>
        </div>

        <ConfidenceScore score={confidence} />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              data-testid="button-toggle-details"
              onClick={() => {
                console.log(`Toggling details: ${isOpen ? 'closing' : 'opening'}`);
              }}
            >
              <span>View Details</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Verification Explanation</h4>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-explanation">
                {explanation}
              </p>
            </div>
            {sourceExcerpt && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Source Excerpt</h4>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm leading-relaxed font-mono" data-testid="text-source-excerpt">
                    {sourceExcerpt}
                  </p>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
