import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink, Search, Lightbulb } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ConfidenceScore from "./ConfidenceScore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { SourceSuggestion } from "@shared/schema";

type VerificationStatus = "verified" | "partial" | "failed";

interface VerificationCardProps {
  claim: string;
  sourceUrl: string;
  status: VerificationStatus;
  confidence: number;
  explanation: string;
  sourceExcerpt?: string;
  suggestedSources?: SourceSuggestion[];
}

export default function VerificationCard({
  claim,
  sourceUrl,
  status,
  confidence,
  explanation,
  sourceExcerpt,
  suggestedSources,
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
            {suggestedSources && suggestedSources.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold">
                    {status === "verified" 
                      ? "Additional Sources to Strengthen This Claim"
                      : status === "partial"
                      ? "Sources to Clarify This Claim"
                      : "Sources to Correct This Claim"}
                  </h4>
                </div>
                <div className="space-y-3">
                  {suggestedSources.map((suggestion, idx) => (
                    <div key={idx} className="bg-muted/50 border border-border rounded-md p-4 space-y-2" data-testid={`card-suggestion-${idx}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold" data-testid="text-suggestion-name">
                            {suggestion.name}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1" data-testid="text-suggestion-description">
                            {suggestion.description}
                          </p>
                        </div>
                        {suggestion.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-auto p-1 flex-shrink-0"
                            data-testid="button-suggestion-link"
                          >
                            <a href={suggestion.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                      {suggestion.searchQuery && (
                        <div className="flex items-center gap-2 text-xs">
                          <Search className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Search:</span>
                          <code className="bg-background px-2 py-0.5 rounded text-xs" data-testid="text-search-query">
                            {suggestion.searchQuery}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
