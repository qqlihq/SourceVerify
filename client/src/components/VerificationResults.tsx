import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface VerificationResultsProps {
  totalClaims: number;
  verified: number;
  partial: number;
  failed: number;
}

export default function VerificationResults({
  totalClaims,
  verified,
  partial,
  failed,
}: VerificationResultsProps) {
  const successRate = totalClaims > 0 ? Math.round((verified / totalClaims) * 100) : 0;

  return (
    <Card data-testid="card-results-summary">
      <CardHeader>
        <CardTitle>Verification Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Claims</p>
            <p className="text-2xl font-bold" data-testid="text-total-claims">{totalClaims}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-success">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
            <p className="text-2xl font-bold text-success" data-testid="text-verified-count">{verified}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span>Partial</span>
            </div>
            <p className="text-2xl font-bold text-warning" data-testid="text-partial-count">{partial}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-error">
              <XCircle className="w-4 h-4" />
              <span>Not Found</span>
            </div>
            <p className="text-2xl font-bold text-error" data-testid="text-failed-count">{failed}</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate</span>
            <span className="text-lg font-bold" data-testid="text-success-rate">{successRate}%</span>
          </div>
          <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
