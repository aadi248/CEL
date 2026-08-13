import Link from "next/link";
import { Header } from "@/components/Header";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboard } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await getLeaderboard();
  return (
    <main className="shell">
      <Header />
      <div className="schematic" aria-hidden="true" />
      <section className="hero">
        <div>
          <div className="kicker">CEL / BITS GOA</div>
          <h1 className="hero-title">THE SIX-PIECE HUNT.</h1>
          <p className="copy">
            Six posters. Six scans. One oddly useful reward.
            <br />
            CEL has hidden six pieces around campus. Find them. Scan them. Complete the set.
          </p>
          <div className="actions">
            <Link className="button maroon" href="/scan/1">
              START THE HUNT →
            </Link>
            <Link className="button secondary" href="/leaderboard">
              VIEW THE INDEX
            </Link>
          </div>
        </div>
        <div className="grid-layout">
          <section className="panel">
            <div className="label">NEXUS HYDERABAD</div>
            <h2 className="section-title">ROOM WORTH BEING IN.</h2>
            <p className="copy">
              Held at Radisson HITEC City. Limited to 100 participants. Built for startups, VCs, founders, and CEL students who
              were fully sponsored into the room.
            </p>
          </section>
          <section className="panel">
            <div className="label">LIVE INDEX</div>
            <LeaderboardTable initialRows={rows} compact />
          </section>
        </div>
        <div className="meta">Built by CEL · BITS Pilani Goa</div>
      </section>
    </main>
  );
}
