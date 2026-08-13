import { Header } from "@/components/Header";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboard } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const rows = await getLeaderboard();
  return (
    <main className="shell">
      <Header />
      <section className="grid-layout">
        <div>
          <div className="kicker">THE HUNT</div>
          <h1 className="display-title">THE INDEX.</h1>
          <p className="copy">Completed players rise first. Duplicate scans are ignored, as they should be.</p>
        </div>
        <div className="panel">
          <div className="label">LIVE LEADERBOARD</div>
          <LeaderboardTable initialRows={rows} />
        </div>
      </section>
    </main>
  );
}
