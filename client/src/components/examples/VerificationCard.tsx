import VerificationCard from "../VerificationCard";

export default function VerificationCardExample() {
  return (
    <div className="space-y-4 max-w-3xl">
      <VerificationCard
        claim="The global temperature has increased by 1.1°C since pre-industrial times"
        sourceUrl="https://climate.nasa.gov/vital-signs/global-temperature/"
        status="verified"
        confidence={95}
        explanation="The source directly states that global average surface temperature has risen about 1.1°C since the late 19th century, which matches the claim exactly."
        sourceExcerpt="The planet's average surface temperature has risen about 1.1 degrees Celsius (2 degrees Fahrenheit) since the late 19th century..."
      />
      <VerificationCard
        claim="Amazon rainforest covers 5.5 million square kilometers"
        sourceUrl="https://www.worldwildlife.org/places/amazon"
        status="partial"
        confidence={67}
        explanation="The source mentions the Amazon spans approximately 6.7 million square kilometers, which differs from the claimed 5.5 million. The claim may be referring to forest area specifically rather than total basin area."
        sourceExcerpt="The Amazon spans 6.7 million square kilometers across nine countries..."
      />
      <VerificationCard
        claim="Mars has three moons orbiting it"
        sourceUrl="https://science.nasa.gov/mars/"
        status="failed"
        confidence={15}
        explanation="The source clearly states Mars has two moons (Phobos and Deimos), not three. This claim is contradicted by the source."
        sourceExcerpt="Mars has two small moons, Phobos and Deimos, that may be captured asteroids."
      />
    </div>
  );
}
