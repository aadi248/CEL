"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { PrintButton } from "@/components/PrintButton";
import { PIECES } from "@/lib/pieces";
import type { GeneratedQrCode } from "@/types/hunt";

export function QrGenerator({ baseUrl }: { baseUrl: string }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [codes, setCodes] = useState<GeneratedQrCode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadCodes = useCallback(async () => {
    const response = await fetch("/api/generate/codes", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    setAuthenticated(true);
    setCodes(data.codes ?? []);
  }, []);

  useEffect(() => {
    fetch("/api/generate/auth", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) loadCodes();
      })
      .catch(() => setAuthenticated(false));
  }, [loadCodes]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/generate/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") })
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }
    setAuthenticated(true);
    await loadCodes();
  }

  async function signOut() {
    await fetch("/api/generate/auth", { method: "DELETE" });
    setCodes([]);
    setAuthenticated(false);
  }

  async function createCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = event.currentTarget;
    const values = new FormData(form);
    const response = await fetch("/api/generate/codes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(values))
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not generate the QR code.");
      return;
    }
    form.reset();
    await loadCodes();
  }

  async function removeCode(id: string) {
    if (!confirm("Delete this custom QR code?")) return;
    const response = await fetch(`/api/generate/codes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete this code.");
      return;
    }
    await loadCodes();
  }

  async function clearLeaderboard() {
    const confirmed = confirm(
      "Clear the leaderboard and delete all participant, scan, unlock and quiz progress? QR codes and event content will be kept. This cannot be undone."
    );
    if (!confirmed) return;

    setClearing(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/generate/leaderboard", { method: "DELETE" });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Your generator session expired. Sign in again.");
      }
      if (!response.ok) throw new Error(data.error ?? "Could not clear the leaderboard.");
      setNotice("Leaderboard cleared. QR codes and event content were kept.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not clear the leaderboard.");
    } finally {
      setClearing(false);
    }
  }

  if (authenticated === null) return <div className="loading">OPENING QR WORKSPACE...</div>;

  if (!authenticated) {
    return (
      <div className="auth-layout">
        <div>
          <div className="eyebrow">RESTRICTED EVENT TOOL</div>
          <h1 className="display-title">QR CONTROL.</h1>
          <p className="copy">Sign in to download the six poster codes and manage any additional event links.</p>
        </div>
        <form className="auth-card" onSubmit={signIn}>
          <div className="label">GENERATOR ACCESS</div>
          <h2 className="card-title">WELCOME BACK.</h2>
          <label className="field"><span className="label">Username</span><input name="username" autoComplete="username" required autoFocus /></label>
          <label className="field"><span className="label">Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
          {error ? <p role="alert">{error}</p> : null}
          <button className="button maroon" disabled={busy} type="submit">{busy ? "CHECKING..." : "ENTER WORKSPACE →"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="generator-workspace">
      <section className="page-heading generator-heading">
        <div>
          <div className="eyebrow">EVENT OPERATIONS / QR</div>
          <h1 className="display-title">POSTER CODES.</h1>
          <p className="copy">The six primary codes always point to their matching puzzle pieces. Print them once, then place each on its corresponding poster.</p>
        </div>
        <div className="actions no-print">
          <PrintButton />
          <button className="button danger" disabled={clearing} onClick={clearLeaderboard} type="button">
            {clearing ? "CLEARING..." : "CLEAR LEADERBOARD"}
          </button>
          <button className="button secondary" onClick={signOut} type="button">SIGN OUT</button>
        </div>
      </section>

      {notice ? <p className="operation-message success" role="status">{notice}</p> : null}
      {error ? <p className="operation-message error" role="alert">{error}</p> : null}

      <div className="section-heading">
        <div><span className="label">PRIMARY SET</span><h2>SIX EVENT POSTERS</h2></div>
        <span className="status-pill">READY TO PRINT</span>
      </div>
      <section className="qr-grid poster-qr-grid">
        {PIECES.map((piece) => {
          const url = `${baseUrl}/scan/${piece.number}`;
          return (
            <article className={`qr-card accent-${piece.accent}`} key={piece.number}>
              <div className="qr-card-top"><span className="label">PIECE {String(piece.number).padStart(2, "0")}</span><span className="qr-dot" /></div>
              <h2 className="fact-title">{piece.theme}</h2>
              <div className="qr-image"><Image alt={`QR code for puzzle piece ${piece.number}`} src={`/api/qr/${piece.number}`} width={420} height={420} unoptimized /></div>
              <p className="qr-target">{url}</p>
              <div className="actions no-print compact-actions">
                <a className="button secondary" href={`/api/qr/${piece.number}?format=png`}>PNG</a>
                <a className="button secondary" href={`/api/qr/${piece.number}?format=svg`}>SVG</a>
                <CopyButton value={url} />
              </div>
            </article>
          );
        })}
      </section>

      <section className="custom-qr-section no-print">
        <div className="section-heading">
          <div><span className="label">OPTIONAL</span><h2>CUSTOM EVENT CODES</h2></div>
          <span className="meta">{codes.length} SAVED</span>
        </div>
        <div className="generator-grid">
          <form className="generator-form" onSubmit={createCode}>
            <div className="label">CREATE A CODE</div>
            <label className="field"><span className="label">Label</span><input name="label" required minLength={2} placeholder="Registration desk" /></label>
            <label className="field"><span className="label">URL or text</span><textarea name="target" required placeholder="https://..." /></label>
            <label className="field"><span className="label">Internal note</span><input name="notes" placeholder="Where this code will be placed" /></label>
            <div className="color-fields">
              <label className="field"><span className="label">Foreground</span><input name="foreground" type="color" defaultValue="#111111" /></label>
              <label className="field"><span className="label">Background</span><input name="background" type="color" defaultValue="#f2efe6" /></label>
            </div>
            <button className="button maroon" disabled={busy} type="submit">{busy ? "GENERATING..." : "GENERATE & SAVE →"}</button>
          </form>

          <div className="saved-codes">
            {codes.length === 0 ? <div className="empty-state"><strong>NO CUSTOM CODES YET.</strong><span>The six poster codes above are already ready to use.</span></div> : null}
            {codes.map((code) => (
              <article className="saved-code" key={code.id}>
                <Image alt={`QR code for ${code.label}`} src={`/api/generate/qr/${code.id}`} width={160} height={160} unoptimized />
                <div className="saved-code-copy">
                  <span className="label">{new Date(code.created_at).toLocaleDateString()}</span>
                  <h3>{code.label}</h3>
                  <p>{code.notes || code.target}</p>
                  <div className="actions compact-actions">
                    <a className="button secondary" href={`/api/generate/qr/${code.id}?format=png&download=1`}>DOWNLOAD</a>
                    <CopyButton value={code.target} />
                    <button className="text-button danger" onClick={() => removeCode(code.id)} type="button">DELETE</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
