"use client";

import { useState } from "react";

export function OnboardingForm({ onDone }: { onDone: () => void }) {
  const [nickname, setNickname] = useState("");
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
      body: JSON.stringify({ nickname, bits_id: bitsId })
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
      <div className="label">ONE-TIME CHECK-IN</div>
      <h2>LET&apos;S MARK YOUR FIRST PIECE.</h2>
      <label className="field">
        <span className="label">Name</span>
        <input value={nickname} onChange={(event) => setNickname(event.target.value)} required minLength={2} autoComplete="name" placeholder="How you should appear on the board" />
      </label>
      <label className="field">
        <span className="label">BITS ID</span>
        <input value={bitsId} onChange={(event) => setBitsId(event.target.value)} autoComplete="off" required minLength={4} placeholder="Your campus ID" />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <button className="button maroon" disabled={busy} type="submit">
        {busy ? "CALIBRATING..." : "ENTER THE HUNT →"}
      </button>
      <p className="source">You only do this once. Your BITS ID is hashed before it reaches storage.</p>
    </form>
  );
}
