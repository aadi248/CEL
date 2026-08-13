import Link from "next/link";
import { Header } from "@/components/Header";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { StartupPuzzle } from "@/components/StartupPuzzle";
import { getLeaderboard } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await getLeaderboard();
  return (
    <main className="shell">
      <Header />

      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> CEL / BITS GOA CAMPUS EVENT</div>
          <h1 className="hero-title">FIND SIX.<br /><em>BUILD ONE.</em></h1>
          <p className="copy hero-description">
            Six startup-themed posters are hiding around campus. Scan each QR, lock its piece into your board, and race to complete the full picture.
          </p>
          <div className="actions">
            <a className="button maroon" href="#how-it-works">HOW IT WORKS ↓</a>
            <Link className="button secondary" href="/leaderboard">VIEW LIVE BOARD</Link>
            <Link className="text-link hero-challenge-link" href="/challenge">OR WIN A PIECE IN THE FORGE →</Link>
          </div>
          <p className="hero-note">YOUR FIRST SCAN ASKS FOR ONLY YOUR NAME + BITS ID.</p>
        </div>
        <div className="hero-puzzle-wrap">
          <div className="puzzle-caption"><span>THE STARTUP BLUEPRINT</span><span>06 / 06</span></div>
          <StartupPuzzle showcase />
          <div className="puzzle-stamp">COMPLETE THE SET</div>
        </div>
      </section>

      <section className="flow-strip" id="how-it-works" aria-label="How the hunt works">
        <article><span>01</span><div><strong>SPOT A POSTER</strong><p>Look around campus for one of six CEL event posters.</p></div></article>
        <article><span>02</span><div><strong>SCAN ITS QR</strong><p>Every unique code reveals and locks in the matching piece.</p></div></article>
        <article><span>03</span><div><strong>FINISH THE PUZZLE</strong><p>Track exactly who has found which pieces on the live board.</p></div></article>
      </section>

      <section className="forge-callout">
        <div><span className="label">ALTERNATE ROUTE</span><h2>NO POSTER NEARBY? EARN A PIECE.</h2></div>
        <p>Answer one startup judgment question in 15 seconds. A correct answer unlocks one missing puzzle piece. One attempt every three hours.</p>
        <Link className="button maroon" href="/challenge">ENTER THE FORGE →</Link>
      </section>

      <section className="home-content-grid">
        <article className="feature-panel">
          <div className="label">WHAT YOU&apos;RE BUILDING</div>
          <h2 className="section-title">A STARTUP, PIECE BY PIECE.</h2>
          <p className="copy">Network. Team. Product. Growth. Community. Launch. Each scan fills one part of the founder journey—no generic clip-art, no duplicate progress.</p>
          <div className="feature-metrics">
            <div><strong>6</strong><span>POSTERS</span></div>
            <div><strong>1</strong><span>PUZZLE</span></div>
            <div><strong>{rows.length}</strong><span>PLAYERS</span></div>
          </div>
        </article>
        <article className="live-panel">
          <div className="section-heading compact-heading">
            <div><span className="label">LIVE EVENT BOARD</span><h2>WHO FOUND WHAT</h2></div>
            <Link href="/leaderboard" className="text-link">VIEW ALL →</Link>
          </div>
          <LeaderboardTable initialRows={rows} compact />
        </article>
      </section>

      <footer className="site-footer"><span>CEL · BITS PILANI GOA</span><span>SCAN · ASSEMBLE · COMPLETE</span></footer>
    </main>
  );
}
