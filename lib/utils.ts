import crypto from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function makeId(prefix = "") {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}_${id}` : id;
}

export function hashValue(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function displayName(nickname: string) {
  const parts = nickname.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ANON.";
  if (parts.length === 1) return parts[0].slice(0, 18).toUpperCase();
  return `${parts[0]} ${parts[parts.length - 1][0]}.`.slice(0, 22).toUpperCase();
}

export function completionCode(playerId: string) {
  return `CEL-HUNT-${crypto.createHash("sha1").update(playerId).digest("hex").slice(0, 6).toUpperCase()}`;
}

export function elapsedSeconds(start: string, end: string | null) {
  if (!end) return null;
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000));
}

export function csvEscape(value: unknown) {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
