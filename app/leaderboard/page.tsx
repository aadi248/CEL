import { Header } from "@/components/Header";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboard } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const rows = await getLeaderboard();
  return (
    <main className="shell">
      <Header />
      <section className="page-heading leaderboard-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> LIVE EVENT PROGRESS</div>
          <h1 className="display-title">THE HUNT BOARD.</h1>
          <p className="copy">See every piece each player has scanned. Completed puzzles rise first; repeat scans never inflate progress.</p>
        </div>
        <div className="heading-stat"><strong>{rows.length}</strong><span>PLAYERS IN THE HUNT</span></div>
      </section>
      <section className="leaderboard-panel">
          <div className="section-heading compact-heading"><div><span className="label">LIVE LEADERBOARD</span><h2>PIECES 01—06</h2></div><span className="status-pill">REFRESHES LIVE</span></div>
          <LeaderboardTable initialRows={rows} />
      </section>
    </main>
  );
}
