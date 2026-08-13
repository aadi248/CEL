import type { AdminSettings, FunFact, LeaderboardRow, Player, PuzzleScan, ScanResult, Unlock } from "@/types/hunt";
import { SEED_FACTS } from "@/lib/content";
import { isValidPiece } from "@/lib/pieces";
import { hasSupabaseEnv, supabaseAdmin } from "@/lib/supabase";
import { isLocalMode, readLocalDb, writeLocalDb } from "@/lib/local-store";
import { completionCode, displayName, elapsedSeconds, hashValue, makeId, nowIso } from "@/lib/utils";

type CreatePlayerInput = {
  nickname: string;
  branch?: string | null;
  bits_id?: string | null;
};

const defaultSettings: AdminSettings = {
  id: "default",
  leaderboard_enabled: true,
  hunt_enabled: true,
  announcement: null
};

export function backendMode() {
  return hasSupabaseEnv() ? "supabase" : "local";
}

export async function ensureSeedContent() {
  if (!hasSupabaseEnv()) return;
  const supabase = supabaseAdmin();
  const { count } = await supabase.from("fun_facts").select("id", { count: "exact", head: true });
  if (count && count > 0) return;
  await supabase.from("fun_facts").upsert(SEED_FACTS, { onConflict: "id" });
  await supabase.from("admin_settings").upsert(defaultSettings, { onConflict: "id" });
}

export async function getSettings(): Promise<AdminSettings> {
  if (hasSupabaseEnv()) {
    const { data } = await supabaseAdmin().from("admin_settings").select("*").eq("id", "default").maybeSingle();
    return data ?? defaultSettings;
  }
  const db = await readLocalDb();
  return db.admin_settings[0] ?? defaultSettings;
}

export async function updateSettings(input: Partial<AdminSettings>) {
  const settings = { ...(await getSettings()), ...input, id: "default" };
  if (hasSupabaseEnv()) {
    await supabaseAdmin().from("admin_settings").upsert(settings, { onConflict: "id" });
    return settings;
  }
  const db = await readLocalDb();
  db.admin_settings = [settings];
  await writeLocalDb(db);
  return settings;
}

export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  const cleanNickname = input.nickname.trim().slice(0, 48);
  if (cleanNickname.length < 2) throw new Error("Nickname must be at least 2 characters.");
  const now = nowIso();
  const player: Player = {
    id: makeId("player"),
    nickname: cleanNickname,
    first_name: cleanNickname.split(/\s+/)[0] ?? cleanNickname,
    branch: input.branch?.trim().slice(0, 48) || null,
    bits_id_hash: input.bits_id ? hashValue(input.bits_id) : null,
    created_at: now,
    updated_at: now,
    completion_time: null,
    completed: false
  };

  if (hasSupabaseEnv()) {
    const { data, error } = await supabaseAdmin().from("players").insert(player).select("*").single();
    if (error) throw error;
    return data;
  }

  const db = await readLocalDb();
  db.players.push(player);
  await writeLocalDb(db);
  return player;
}

export async function getPlayer(playerId: string | undefined | null): Promise<Player | null> {
  if (!playerId) return null;
  if (hasSupabaseEnv()) {
    const { data } = await supabaseAdmin().from("players").select("*").eq("id", playerId).maybeSingle();
    return data ?? null;
  }
  const db = await readLocalDb();
  return db.players.find((player) => player.id === playerId) ?? null;
}

export async function getPlayerScans(playerId: string): Promise<PuzzleScan[]> {
  if (hasSupabaseEnv()) {
    const { data, error } = await supabaseAdmin()
      .from("puzzle_scans")
      .select("*")
      .eq("player_id", playerId)
      .order("piece_number", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
  const db = await readLocalDb();
  return db.puzzle_scans.filter((scan) => scan.player_id === playerId).sort((a, b) => a.piece_number - b.piece_number);
}

function pickUnlock(contents: FunFact[], pieceNumber: number, isNew: boolean) {
  const active = contents.filter((item) => item.active);
  const facts = active.filter((item) => item.kind === "fact");
  const jokes = active.filter((item) => item.kind === "joke");
  const pool = isNew ? (pieceNumber % 2 ? facts : [...facts, ...jokes]) : jokes.length ? jokes : active;
  return pool[Math.floor(Math.random() * pool.length)] ?? SEED_FACTS[0];
}

export async function recordScan(playerId: string, pieceNumber: number): Promise<ScanResult> {
  if (!isValidPiece(pieceNumber)) throw new Error("Invalid piece.");
  const settings = await getSettings();
  if (!settings.hunt_enabled) throw new Error("The hunt is currently paused.");
  const player = await getPlayer(playerId);
  if (!player) throw new Error("Player not found.");

  if (hasSupabaseEnv()) {
    const supabase = supabaseAdmin();
    const now = nowIso();
    const { data: existing } = await supabase
      .from("puzzle_scans")
      .select("*")
      .eq("player_id", playerId)
      .eq("piece_number", pieceNumber)
      .maybeSingle();

    let scan: PuzzleScan;
    let isNewPiece = false;
    if (existing) {
      const { data, error } = await supabase
        .from("puzzle_scans")
        .update({ last_scanned_at: now, scan_count: existing.scan_count + 1 })
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw error;
      scan = data;
    } else {
      isNewPiece = true;
      const { data, error } = await supabase
        .from("puzzle_scans")
        .insert({
          id: makeId("scan"),
          player_id: playerId,
          piece_number: pieceNumber,
          first_scanned_at: now,
          last_scanned_at: now,
          scan_count: 1,
          unique_scan: true
        })
        .select("*")
        .single();
      if (error) throw error;
      scan = data;
    }

    const scans = await getPlayerScans(playerId);
    let updatedPlayer = player;
    if (scans.length >= 6 && !player.completed) {
      const completion_time = nowIso();
      const { data, error } = await supabase
        .from("players")
        .update({ completed: true, completion_time, updated_at: completion_time })
        .eq("id", playerId)
        .select("*")
        .single();
      if (error) throw error;
      updatedPlayer = data;
    }

    const { data: contentRows } = await supabase.from("fun_facts").select("*").eq("active", true);
    const unlock = pickUnlock((contentRows as FunFact[]) ?? SEED_FACTS, pieceNumber, isNewPiece);
    await supabase.from("unlocks").insert({
      id: makeId("unlock"),
      player_id: playerId,
      piece_number: pieceNumber,
      content_id: unlock.id,
      unlocked_at: nowIso()
    });
    return { player: updatedPlayer, scan, scans, unlock, is_new_piece: isNewPiece, completion_code: scans.length >= 6 ? completionCode(playerId) : null };
  }

  const db = await readLocalDb();
  const now = nowIso();
  let scan = db.puzzle_scans.find((row) => row.player_id === playerId && row.piece_number === pieceNumber);
  const isNewPiece = !scan;
  if (scan) {
    scan.last_scanned_at = now;
    scan.scan_count += 1;
  } else {
    scan = {
      id: makeId("scan"),
      player_id: playerId,
      piece_number: pieceNumber,
      first_scanned_at: now,
      last_scanned_at: now,
      scan_count: 1,
      unique_scan: true
    };
    db.puzzle_scans.push(scan);
  }
  const scans = db.puzzle_scans.filter((row) => row.player_id === playerId);
  const dbPlayer = db.players.find((row) => row.id === playerId) ?? player;
  if (scans.length >= 6 && !dbPlayer.completed) {
    dbPlayer.completed = true;
    dbPlayer.completion_time = now;
    dbPlayer.updated_at = now;
  }
  const unlock = pickUnlock(db.fun_facts, pieceNumber, isNewPiece);
  const unlockRow: Unlock = { id: makeId("unlock"), player_id: playerId, piece_number: pieceNumber, content_id: unlock.id, unlocked_at: now };
  db.unlocks.push(unlockRow);
  await writeLocalDb(db);
  return { player: dbPlayer, scan, scans, unlock, is_new_piece: isNewPiece, completion_code: scans.length >= 6 ? completionCode(playerId) : null };
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const players = hasSupabaseEnv()
    ? ((await supabaseAdmin().from("players").select("*")).data as Player[]) ?? []
    : (await readLocalDb()).players;
  const scans = hasSupabaseEnv()
    ? ((await supabaseAdmin().from("puzzle_scans").select("*")).data as PuzzleScan[]) ?? []
    : (await readLocalDb()).puzzle_scans;

  const rows = players.map((player) => {
    const playerScans = scans.filter((scan) => scan.player_id === player.id && scan.unique_scan);
    return {
      rank: 0,
      player_id: player.id,
      display_name: displayName(player.nickname),
      pieces: new Set(playerScans.map((scan) => scan.piece_number)).size,
      completed: player.completed,
      completion_time: player.completion_time,
      elapsed_seconds: elapsedSeconds(player.created_at, player.completion_time)
    };
  });

  rows.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? -1 : 1;
    if (b.pieces !== a.pieces) return b.pieces - a.pieces;
    if (a.completed && b.completed) return String(a.completion_time).localeCompare(String(b.completion_time));
    return a.display_name.localeCompare(b.display_name);
  });

  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export async function getAdminStats() {
  const db = hasSupabaseEnv()
    ? {
        players: ((await supabaseAdmin().from("players").select("*")).data as Player[]) ?? [],
        puzzle_scans: ((await supabaseAdmin().from("puzzle_scans").select("*")).data as PuzzleScan[]) ?? [],
        unlocks: ((await supabaseAdmin().from("unlocks").select("*")).data as Unlock[]) ?? [],
        fun_facts: ((await supabaseAdmin().from("fun_facts").select("*")).data as FunFact[]) ?? [],
        admin_settings: [await getSettings()]
      }
    : await readLocalDb();
  const uniqueScans = db.puzzle_scans.filter((scan) => scan.unique_scan);
  const pieceCounts = Array.from({ length: 6 }, (_, index) => {
    const piece = index + 1;
    return {
      piece,
      unique: uniqueScans.filter((scan) => scan.piece_number === piece).length,
      total: db.puzzle_scans.filter((scan) => scan.piece_number === piece).reduce((sum, scan) => sum + scan.scan_count, 0)
    };
  });
  const mostPopular = [...pieceCounts].sort((a, b) => b.total - a.total)[0];
  return {
    mode: isLocalMode() ? "local" : "supabase",
    settings: db.admin_settings[0] ?? defaultSettings,
    totalParticipants: db.players.length,
    totalScans: db.puzzle_scans.reduce((sum, scan) => sum + scan.scan_count, 0),
    uniqueScans: uniqueScans.length,
    completionCount: db.players.filter((player) => player.completed).length,
    pieceCounts,
    mostPopular,
    leaderboard: await getLeaderboard(),
    participants: db.players.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)),
    recentScans: db.puzzle_scans.slice().sort((a, b) => b.last_scanned_at.localeCompare(a.last_scanned_at)).slice(0, 25),
    content: db.fun_facts
  };
}

export async function resetProgress() {
  if (hasSupabaseEnv()) {
    const supabase = supabaseAdmin();
    await supabase.from("unlocks").delete().neq("id", "");
    await supabase.from("puzzle_scans").delete().neq("id", "");
    await supabase.from("players").delete().neq("id", "");
    return;
  }
  const db = await readLocalDb();
  db.players = [];
  db.puzzle_scans = [];
  db.unlocks = [];
  await writeLocalDb(db);
}

export async function upsertContent(item: FunFact) {
  if (hasSupabaseEnv()) {
    await supabaseAdmin().from("fun_facts").upsert(item, { onConflict: "id" });
    return item;
  }
  const db = await readLocalDb();
  const index = db.fun_facts.findIndex((row) => row.id === item.id);
  if (index >= 0) db.fun_facts[index] = item;
  else db.fun_facts.push(item);
  await writeLocalDb(db);
  return item;
}

export async function deleteContent(id: string) {
  if (hasSupabaseEnv()) {
    await supabaseAdmin().from("fun_facts").delete().eq("id", id);
    return;
  }
  const db = await readLocalDb();
  db.fun_facts = db.fun_facts.filter((item) => item.id !== id);
  await writeLocalDb(db);
}
