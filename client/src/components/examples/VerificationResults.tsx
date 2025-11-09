import VerificationResults from "../VerificationResults";

export default function VerificationResultsExample() {
  return (
    <div className="max-w-3xl">
      <VerificationResults
        totalClaims={10}
        verified={7}
        partial={2}
        failed={1}
      />
    </div>
  );
}
