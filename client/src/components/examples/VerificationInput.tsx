import VerificationInput from "../VerificationInput";

export default function VerificationInputExample() {
  return (
    <div className="max-w-3xl">
      <VerificationInput
        onVerify={(text) => console.log("Verify:", text)}
        isLoading={false}
      />
    </div>
  );
}
