"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { OnboardingForm } from "@/components/OnboardingForm";
import { ProgressGrid } from "@/components/ProgressGrid";
import type { Player, PuzzleScan, QuizAttemptStatus } from "@/types/hunt";

type Attempt = {
  id: string;
  question_id: string;
  category: string;
  prompt: string;
  options: readonly string[];
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  selected_index: number | null;
  status: QuizAttemptStatus;
  awarded_piece: number | null;
  correct_index: number | null;
  explanation: string | null;
};

type ChallengeData = {
  player: Player;
  scans: PuzzleScan[];
  attempt: Attempt | null;
  can_start: boolean;
  completed: boolean;
  next_available_at: string | null;
  cooldown_remaining_seconds: number;
  duration_seconds: number;
  cooldown_seconds: number;
  server_time: string;
};

function formatCooldown(seconds: number) {
  const total = Math.max(0, seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function ChallengeExperience() {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [clockOffset, setClockOffset] = useState(0);
  const expiryHandled = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/challenge", { cache: "no-store" });
    if (response.status === 401) {
      setNeedsOnboarding(true);
      setLoading(false);
      return;
    }
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Could not open the FORGE challenge.");
      setLoading(false);
      return;
    }
    setNeedsOnboarding(false);
    setData(payload);
    setClockOffset(new Date(payload.server_time).getTime() - Date.now());
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);

  const timeLeft = (() => {
    if (!data?.attempt || data.attempt.status !== "active") return 0;
    return Math.max(0, Math.ceil((new Date(data.attempt.expires_at).getTime() - (now + clockOffset)) / 1000));
  })();

  const cooldownLeft = (() => {
    if (!data?.next_available_at) return 0;
    return Math.max(0, Math.ceil((new Date(data.next_available_at).getTime() - (now + clockOffset)) / 1000));
  })();

  const request = useCallback(async (body: object) => {
    setBusy(true);
    setError(null);
    const response = await fetch("/api/challenge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error ?? "The challenge could not be updated.");
      if (response.status === 429) await load();
      return null;
    }
    setData(payload);
    setClockOffset(new Date(payload.server_time).getTime() - Date.now());
    return payload as ChallengeData;
  }, [load]);

  const expire = useCallback(async (attempt: Attempt) => {
    if (expiryHandled.current === attempt.id) return;
    expiryHandled.current = attempt.id;
    await request({ action: "answer", attempt_id: attempt.id, selected_index: -1 });
  }, [request]);

  useEffect(() => {
    const attempt = data?.attempt;
    if (attempt?.status !== "active" || timeLeft > 0) return;
    const timeout = window.setTimeout(() => void expire(attempt), 0);
    return () => window.clearTimeout(timeout);
  }, [data?.attempt, expire, timeLeft]);

  async function start() {
    expiryHandled.current = null;
    await request({ action: "start" });
  }

  async function answer(index: number) {
    if (!data?.attempt || timeLeft <= 0) return;
    await request({ action: "answer", attempt_id: data.attempt.id, selected_index: index });
  }

  if (loading) return <div className="loading">HEATING THE FORGE...</div>;

  if (needsOnboarding) {
    return (
      <section className="scan-onboarding-layout challenge-onboarding">
        <div>
          <div className="eyebrow"><span className="live-dot" /> ALTERNATE PUZZLE ROUTE</div>
          <h1 className="display-title">THINK FAST.<br />WIN A PIECE.</h1>
          <p className="copy">Check in once, then answer one startup judgment question in 15 seconds. Get it right and one missing jigsaw piece is yours.</p>
        </div>
        <OnboardingForm context="challenge" onDone={load} />
      </section>
    );
  }

  if (!data) return <p role="alert">{error ?? "Challenge unavailable."}</p>;

  const foundPieces = data.scans.map((scan) => scan.piece_number);
  const attempt = data.attempt;
  const active = attempt?.status === "active";
  const result = attempt && attempt.status !== "active" ? attempt : null;

  return (
    <section className="challenge-layout">
      <aside className="challenge-progress">
        <ProgressGrid found={foundPieces} justUnlocked={result?.status === "correct" ? result.awarded_piece : null} />
        <div className="challenge-rule-card">
          <span className="label">THE RULES</span>
          <ol>
            <li><strong>15 seconds</strong><span>One question, four choices.</span></li>
            <li><strong>One piece</strong><span>A correct answer fills a missing slot.</span></li>
            <li><strong>3-hour cooldown</strong><span>Starting the timer uses the attempt.</span></li>
          </ol>
        </div>
      </aside>

      <div className="challenge-stage">
        <div className="challenge-stage-top">
          <div className="eyebrow">FORGE / STARTUP JUDGMENT</div>
          {active ? <div className={`timer-chip ${timeLeft <= 5 ? "urgent" : ""}`}><span>TIME</span><strong>00:{String(timeLeft).padStart(2, "0")}</strong></div> : null}
        </div>

        {data.completed ? (
          <div className="challenge-message complete-message">
            <span className="result-mark">06 / 06</span>
            <h1>PUZZLE COMPLETE.</h1>
            <p>Your board is full. No more questions needed—go see where you landed.</p>
            <Link className="button maroon" href="/leaderboard">VIEW LIVE BOARD →</Link>
          </div>
        ) : active && attempt ? (
          <article className="question-card">
            <div className="question-meta"><span>{attempt.category}</span><span>1 OF 1</span></div>
            <div className="timer-track" aria-hidden="true"><span style={{ width: `${(timeLeft / data.duration_seconds) * 100}%` }} /></div>
            <h1>{attempt.prompt}</h1>
            <div className="answer-grid">
              {attempt.options.map((option, index) => (
                <button className="answer-option" disabled={busy || timeLeft <= 0} key={option} onClick={() => answer(index)} type="button">
                  <span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong>
                </button>
              ))}
            </div>
            <p className="question-footnote">Choose carefully. Your first answer is final.</p>
          </article>
        ) : result ? (
          <div className={`challenge-message result-message result-${result.status}`}>
            <span className="result-mark">{result.status === "correct" ? `+ PIECE ${String(result.awarded_piece).padStart(2, "0")}` : result.status === "expired" ? "TIME" : "NOT QUITE"}</span>
            <h1>{result.status === "correct" ? "LOCKED IN." : result.status === "expired" ? "TIME RAN OUT." : "BACK TO THE BLUEPRINT."}</h1>
            <p>{result.explanation}</p>
            <div className="answer-review">
              <span className="label">CORRECT ANSWER</span>
              <strong>{result.correct_index !== null ? `${String.fromCharCode(65 + result.correct_index)} · ${result.options[result.correct_index]}` : "—"}</strong>
            </div>
            <div className="cooldown-inline"><span>NEXT QUESTION IN</span><strong>{formatCooldown(cooldownLeft)}</strong></div>
            <div className="actions">
              {cooldownLeft === 0 ? <button className="button maroon" disabled={busy} onClick={start} type="button">NEW QUESTION →</button> : null}
              <Link className="button maroon" href="/leaderboard">VIEW LIVE BOARD</Link>
              <Link className="button secondary" href="/">BACK TO THE HUNT</Link>
            </div>
          </div>
        ) : data.can_start ? (
          <div className="challenge-message ready-message">
            <span className="result-mark">15 SECONDS · 1 PIECE</span>
            <h1>YOUR QUESTION IS READY.</h1>
            <p>The three-hour cooldown starts the moment you reveal it. Refreshing, closing the page, or letting time run out still uses this attempt.</p>
            {error ? <p role="alert">{error}</p> : null}
            <button className="button maroon" disabled={busy} onClick={start} type="button">{busy ? "LIGHTING THE FORGE..." : "REVEAL QUESTION →"}</button>
          </div>
        ) : (
          <div className="challenge-message cooldown-message">
            <span className="result-mark">COOLDOWN ACTIVE</span>
            <h1>THE FORGE NEEDS TIME.</h1>
            <p>Your next question unlocks after the three-hour cooldown. Campus QR scans remain available while you wait.</p>
            <div className="cooldown-clock" aria-label={`${cooldownLeft} seconds remaining`}>{formatCooldown(cooldownLeft)}</div>
            <div className="actions"><Link className="button secondary" href="/leaderboard">CHECK YOUR PROGRESS</Link></div>
          </div>
        )}
      </div>
    </section>
  );
}
