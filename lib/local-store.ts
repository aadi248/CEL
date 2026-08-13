import fs from "node:fs/promises";
import path from "node:path";
import type { AdminSettings, FunFact, Player, PuzzleScan, Unlock } from "@/types/hunt";
import { SEED_FACTS } from "@/lib/content";

type LocalDb = {
  players: Player[];
  puzzle_scans: PuzzleScan[];
  unlocks: Unlock[];
  fun_facts: FunFact[];
  admin_settings: AdminSettings[];
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
    admin_settings: [defaultSettings]
  };
}

export async function readLocalDb(): Promise<LocalDb> {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    const parsed = JSON.parse(raw) as LocalDb;
    if (!parsed.fun_facts?.length) parsed.fun_facts = SEED_FACTS;
    if (!parsed.admin_settings?.length) parsed.admin_settings = [defaultSettings];
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
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;
}
