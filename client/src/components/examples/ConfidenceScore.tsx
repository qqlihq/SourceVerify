import ConfidenceScore from "../ConfidenceScore";

export default function ConfidenceScoreExample() {
  return (
    <div className="space-y-4 w-64">
      <ConfidenceScore score={95} />
      <ConfidenceScore score={67} />
      <ConfidenceScore score={32} />
    </div>
  );
}
