import { Progress } from "@/components/ui/progress";

interface ConfidenceScoreProps {
  score: number;
}

export default function ConfidenceScore({ score }: ConfidenceScoreProps) {
  const getColor = () => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="space-y-2" data-testid="confidence-score">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Confidence</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
