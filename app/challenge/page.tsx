import { Header } from "@/components/Header";
import { ChallengeExperience } from "@/components/ChallengeExperience";

export const dynamic = "force-dynamic";

export default function ChallengePage() {
  return (
    <main className="shell">
      <Header />
      <ChallengeExperience />
    </main>
  );
}
