import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2">
      <StatusBadge status="verified" />
      <StatusBadge status="partial" />
      <StatusBadge status="failed" />
    </div>
  );
}
