"use client";

import { useState } from "react";

export function OnboardingForm({ onDone }: { onDone: () => void }) {
  const [nickname, setNickname] = useState("");
  const [branch, setBranch] = useState("");
  const [bitsId, setBitsId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/player", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname, branch, bits_id: bitsId })
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not create your hunt profile.");
      return;
    }
    localStorage.setItem("cel_player_hint", data.player.id);
    onDone();
  }

  return (
    <form className="unlock-card" onSubmit={submit}>
      <div className="label">PLAYER ONBOARDING</div>
      <h2>WHAT SHOULD WE CALL YOU?</h2>
      <label className="field">
        <span className="label">Your name / nickname</span>
        <input value={nickname} onChange={(event) => setNickname(event.target.value)} required minLength={2} autoComplete="nickname" />
      </label>
      <label className="field">
        <span className="label">First year branch</span>
        <input value={branch} onChange={(event) => setBranch(event.target.value)} autoComplete="organization-title" />
      </label>
      <label className="field">
        <span className="label">BITS ID</span>
        <input value={bitsId} onChange={(event) => setBitsId(event.target.value)} autoComplete="off" />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <button className="button maroon" disabled={busy} type="submit">
        {busy ? "CALIBRATING..." : "ENTER THE HUNT →"}
      </button>
      <p className="source">Leaderboard names default to nickname plus first initial. BITS IDs are hashed before storage.</p>
    </form>
  );
}
