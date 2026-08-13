import fs from "node:fs/promises";
import path from "node:path";
import type { AdminSettings, FunFact, GeneratedQrCode, Player, PuzzleScan, Unlock } from "@/types/hunt";
import { SEED_FACTS } from "@/lib/content";

type LocalDb = {
  players: Player[];
  puzzle_scans: PuzzleScan[];
  unlocks: Unlock[];
  fun_facts: FunFact[];
  admin_settings: AdminSettings[];
  qr_codes: GeneratedQrCode[];
};

const dbPath = path.join(process.cwd(), "data", "local-db.json");

const defaultSettings: AdminSettings = {
  id: "default",
  leaderboard_enabled: true,
  hunt_enabled: true,
  announcement: null
};

function freshDb(): LocalDb {
  return {
    players: [],
    puzzle_scans: [],
    unlocks: [],
    fun_facts: SEED_FACTS,
    admin_settings: [defaultSettings],
    qr_codes: []
  };
}

export async function readLocalDb(): Promise<LocalDb> {
  if (process.env.VERCEL && isLocalMode()) {
    throw new Error("Firebase Admin credentials are required on Vercel; local filesystem storage is disabled.");
  }
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    const parsed = JSON.parse(raw) as LocalDb;
    if (!parsed.fun_facts?.length) parsed.fun_facts = SEED_FACTS;
    if (!parsed.admin_settings?.length) parsed.admin_settings = [defaultSettings];
    if (!parsed.qr_codes) parsed.qr_codes = [];
    return parsed;
  } catch {
    const db = freshDb();
    await writeLocalDb(db);
    return db;
  }
}

export async function writeLocalDb(db: LocalDb) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export function isLocalMode() {
  return !process.env.FIREBASE_PROJECT_ID ||
    (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY && (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY));
}
