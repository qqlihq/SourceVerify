import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type VerificationStatus = "verified" | "partial" | "failed";

interface StatusBadgeProps {
  status: VerificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    verified: {
      icon: CheckCircle,
      label: "Verified",
      className: "bg-success-light text-success border-success-border",
    },
    partial: {
      icon: AlertTriangle,
      label: "Partial",
      className: "bg-warning-light text-warning border-warning-border",
    },
    failed: {
      icon: XCircle,
      label: "Not Found",
      className: "bg-error-light text-error border-error-border",
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${className}`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="w-3 h-3" />
      <span className="font-medium">{label}</span>
    </Badge>
  );
}
