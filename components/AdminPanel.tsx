"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FunFact } from "@/types/hunt";

type Stats = Awaited<ReturnType<typeof shapeStats>>;

function shapeStats() {
  return {
    mode: "local",
    totalParticipants: 0,
    totalScans: 0,
    uniqueScans: 0,
    completionCount: 0,
    pieceCounts: [] as { piece: number; unique: number; total: number }[],
    mostPopular: null as null | { piece: number; unique: number; total: number },
    leaderboard: [] as { rank: number; display_name: string; pieces: number; piece_numbers: number[]; completed: boolean }[],
    participants: [] as { id: string; nickname: string; completed: boolean; created_at: string }[],
    recentScans: [] as { id: string; player_id: string; piece_number: number; scan_count: number; last_scanned_at: string }[],
    content: [] as FunFact[],
    settings: { hunt_enabled: true, leaderboard_enabled: true, announcement: "" as string | null }
  };
}

export function AdminPanel() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<Stats>(shapeStats());
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FunFact | null>(null);

  const headers = useMemo<Record<string, string>>(() => {
    const nextHeaders: Record<string, string> = {};
    if (password) nextHeaders["x-admin-password"] = password;
    return nextHeaders;
  }, [password]);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/stats", { headers, cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Admin password required.");
      return;
    }
    setError(null);
    setStats(data);
  }, [headers]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  async function saveSettings() {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(stats.settings)
    });
    await load();
  }

  async function reset() {
    const ok = confirm("Reset all players, scans and unlocks? This cannot be undone.");
    if (!ok) return;
    await fetch("/api/admin/reset", { method: "POST", headers });
    await load();
  }

  async function saveContent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const item = {
      id: formData.get("id") || undefined,
      category: formData.get("category"),
      title: formData.get("title"),
      body: formData.get("body"),
      source: formData.get("source"),
      source_url: formData.get("source_url"),
      source_date: formData.get("source_date"),
      accent_color: formData.get("accent_color"),
      kind: formData.get("kind"),
      active: formData.get("active") === "on"
    };
    await fetch("/api/admin/content", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(item) });
    setSelected(null);
    await load();
  }

  return (
    <div className="grid-layout">
      <div>
        <section className="panel">
          <label className="field">
            <span className="label">Admin password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          <div className="actions">
            <button className="button maroon" onClick={load} type="button">AUTHENTICATE</button>
            <a className="button secondary" href={`/api/admin/export`} onClick={(event) => {
              if (password) (event.currentTarget as HTMLAnchorElement).href = `/api/admin/export?password=${encodeURIComponent(password)}`;
            }}>EXPORT CSV</a>
            <a className="button secondary" href="/generate">QR WORKSPACE</a>
          </div>
          {error ? <p role="alert" className="source">{error}</p> : null}
        </section>

        <section className="admin-grid" style={{ marginTop: 20 }}>
          <div className="stat"><span className="label">Participants</span><strong>{stats.totalParticipants}</strong></div>
          <div className="stat"><span className="label">Total scans</span><strong>{stats.totalScans}</strong></div>
          <div className="stat"><span className="label">Unique scans</span><strong>{stats.uniqueScans}</strong></div>
          <div className="stat"><span className="label">Complete</span><strong>{stats.completionCount}</strong></div>
        </section>

        <section className="panel">
          <div className="label">Hunt control · {stats.mode.toUpperCase()}</div>
          <label className="field">
            <span><input type="checkbox" checked={stats.settings.hunt_enabled} onChange={(event) => setStats({ ...stats, settings: { ...stats.settings, hunt_enabled: event.target.checked } })} /> Hunt enabled</span>
          </label>
          <label className="field">
            <span><input type="checkbox" checked={stats.settings.leaderboard_enabled} onChange={(event) => setStats({ ...stats, settings: { ...stats.settings, leaderboard_enabled: event.target.checked } })} /> Leaderboard visible</span>
          </label>
          <label className="field">
            <span className="label">Announcement</span>
            <textarea value={stats.settings.announcement ?? ""} onChange={(event) => setStats({ ...stats, settings: { ...stats.settings, announcement: event.target.value } })} />
          </label>
          <div className="actions">
            <button className="button maroon" onClick={saveSettings} type="button">SAVE CONTROL</button>
            <button className="button secondary" onClick={reset} type="button">RESET ALL PROGRESS</button>
          </div>
        </section>

        <section className="panel">
          <div className="label">Piece-by-piece scans</div>
          <table className="leaderboard">
            <tbody>
              {stats.pieceCounts.map((row) => (
                <tr key={row.piece}>
                  <td>POSTER {String(row.piece).padStart(2, "0")}</td>
                  <td>{row.unique} unique</td>
                  <td>{row.total} total</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <aside>
        <section className="panel">
          <div className="label">Live participant list</div>
          <table className="leaderboard">
            <tbody>
              {stats.participants.slice(0, 12).map((player) => (
                <tr key={player.id}>
                  <td className="player">{player.nickname}</td>
                  <td>{player.completed ? "COMPLETE" : "ACTIVE"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="label">Recent scans</div>
          <table className="leaderboard">
            <tbody>
              {stats.recentScans.slice(0, 12).map((scan) => (
                <tr key={scan.id}>
                  <td>PIECE {String(scan.piece_number).padStart(2, "0")}</td>
                  <td>{scan.scan_count}x</td>
                  <td>{new Date(scan.last_scanned_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="label">Content control</div>
          <form onSubmit={saveContent} key={selected?.id ?? "new"}>
            <input name="id" type="hidden" defaultValue={selected?.id ?? ""} />
            <label className="field"><span className="label">Kind</span><select name="kind" defaultValue={selected?.kind ?? "fact"}><option value="fact">Fact</option><option value="joke">Joke</option></select></label>
            <label className="field"><span className="label">Category</span><input name="category" defaultValue={selected?.category ?? ""} /></label>
            <label className="field"><span className="label">Title</span><input name="title" defaultValue={selected?.title ?? ""} /></label>
            <label className="field"><span className="label">Body</span><textarea name="body" defaultValue={selected?.body ?? ""} required /></label>
            <label className="field"><span className="label">Source</span><input name="source" defaultValue={selected?.source ?? ""} /></label>
            <label className="field"><span className="label">Source URL</span><input name="source_url" defaultValue={selected?.source_url ?? ""} /></label>
            <label className="field"><span className="label">Source date</span><input name="source_date" defaultValue={selected?.source_date ?? ""} /></label>
            <label className="field"><span className="label">Accent</span><select name="accent_color" defaultValue={selected?.accent_color ?? "maroon"}>{["maroon","blue","green","red","orange","purple"].map((accent) => <option key={accent}>{accent}</option>)}</select></label>
            <label className="field"><span><input name="active" type="checkbox" defaultChecked={selected?.active ?? true} /> Active</span></label>
            <button className="button maroon" type="submit">SAVE CONTENT</button>
          </form>
          <div style={{ maxHeight: 320, overflow: "auto", marginTop: 16 }}>
            {stats.content.slice(0, 60).map((item) => (
              <button className="button secondary" key={item.id} onClick={() => setSelected(item)} style={{ width: "100%", justifyContent: "flex-start", marginBottom: 8 }} type="button">
                {item.kind.toUpperCase()} · {item.title}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
