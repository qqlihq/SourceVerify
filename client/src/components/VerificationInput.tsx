import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface VerificationInputProps {
  onVerify: (text: string) => void;
  isLoading?: boolean;
}

export default function VerificationInput({ onVerify, isLoading = false }: VerificationInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      console.log("Verifying text:", text);
      onVerify(text);
    }
  };

  const charCount = text.length;

  return (
    <Card data-testid="card-input">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Verify AI Response
        </CardTitle>
        <CardDescription>
          Paste an AI-generated response with sources to verify the claims against their cited sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-response">AI Response with Sources</Label>
          <Textarea
            id="ai-response"
            placeholder="Example:
The global temperature has risen 1.1°C since pre-industrial times [1]. Scientists predict continued warming throughout the century [2].

Sources:
[1] https://climate.nasa.gov/vital-signs/global-temperature/
[2] https://www.ipcc.ch/reports/"
            className="min-h-[200px] font-sans"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="input-ai-response"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{charCount} characters</span>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="w-full"
          data-testid="button-verify"
        >
          {isLoading ? "Verifying..." : "Verify Sources"}
        </Button>
      </CardContent>
    </Card>
  );
}
