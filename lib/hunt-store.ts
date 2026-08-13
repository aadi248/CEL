import type {
  AdminSettings,
  FunFact,
  GeneratedQrCode,
  LeaderboardRow,
  Player,
  PuzzleScan,
  ScanResult,
  Unlock
} from "@/types/hunt";
import { SEED_FACTS } from "@/lib/content";
import { firebaseDb, hasFirebaseEnv } from "@/lib/firebase-admin";
import { isValidPiece } from "@/lib/pieces";
import { readLocalDb, writeLocalDb } from "@/lib/local-store";
import { completionCode, displayName, elapsedSeconds, hashValue, makeId, nowIso } from "@/lib/utils";

type CreatePlayerInput = {
  nickname: string;
  bits_id?: string | null;
};

const defaultSettings: AdminSettings = {
  id: "default",
  leaderboard_enabled: true,
  hunt_enabled: true,
  announcement: null
};

const collections = {
  players: "players",
  scans: "puzzle_scans",
  unlocks: "unlocks",
  content: "fun_facts",
  settings: "admin_settings",
  qrCodes: "qr_codes"
} as const;

export function backendMode() {
  return hasFirebaseEnv() ? "firebase" : "local";
}

function assertProductionPersistence() {
  if (!hasFirebaseEnv() && process.env.VERCEL) {
    throw new Error("Firebase Admin credentials are required on Vercel.");
  }
}

async function allDocuments<T>(name: string): Promise<T[]> {
  const snapshot = await firebaseDb().collection(name).get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

export async function ensureSeedContent() {
  if (!hasFirebaseEnv()) return;
  const db = firebaseDb();
  const existing = await db.collection(collections.content).limit(1).get();
  if (!existing.empty) return;
  const batch = db.batch();
  for (const item of SEED_FACTS) batch.set(db.collection(collections.content).doc(item.id), item);
  batch.set(db.collection(collections.settings).doc(defaultSettings.id), defaultSettings);
  await batch.commit();
}

export async function getSettings(): Promise<AdminSettings> {
  assertProductionPersistence();
  if (hasFirebaseEnv()) {
    const snapshot = await firebaseDb().collection(collections.settings).doc("default").get();
    return snapshot.exists ? (snapshot.data() as AdminSettings) : defaultSettings;
  }
  const db = await readLocalDb();
  return db.admin_settings[0] ?? defaultSettings;
}

export async function updateSettings(input: Partial<AdminSettings>) {
  const settings = { ...(await getSettings()), ...input, id: "default" };
  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.settings).doc(settings.id).set(settings, { merge: true });
    return settings;
  }
  const db = await readLocalDb();
  db.admin_settings = [settings];
  await writeLocalDb(db);
  return settings;
}

export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  const cleanNickname = input.nickname.trim().slice(0, 48);
  const cleanBitsId = input.bits_id?.trim().slice(0, 64) ?? "";
  if (cleanNickname.length < 2) throw new Error("Name must be at least 2 characters.");
  if (cleanBitsId.length < 4) throw new Error("Enter a valid BITS ID.");
  const bitsIdHash = hashValue(cleanBitsId);

  if (hasFirebaseEnv()) {
    const existing = await firebaseDb().collection(collections.players).where("bits_id_hash", "==", bitsIdHash).limit(1).get();
    if (!existing.empty) return existing.docs[0].data() as Player;
  } else {
    assertProductionPersistence();
    const local = await readLocalDb();
    const existing = local.players.find((row) => row.bits_id_hash === bitsIdHash);
    if (existing) return existing;
  }

  const now = nowIso();
  const player: Player = {
    id: makeId("player"),
    nickname: cleanNickname,
    first_name: cleanNickname.split(/\s+/)[0] ?? cleanNickname,
    bits_id_hash: bitsIdHash,
    created_at: now,
    updated_at: now,
    completion_time: null,
    completed: false
  };

  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.players).doc(player.id).set(player);
    return player;
  }
  const db = await readLocalDb();
  db.players.push(player);
  await writeLocalDb(db);
  return player;
}

export async function getPlayer(playerId: string | undefined | null): Promise<Player | null> {
  if (!playerId) return null;
  if (hasFirebaseEnv()) {
    const snapshot = await firebaseDb().collection(collections.players).doc(playerId).get();
    return snapshot.exists ? (snapshot.data() as Player) : null;
  }
  assertProductionPersistence();
  const db = await readLocalDb();
  return db.players.find((player) => player.id === playerId) ?? null;
}

export async function getPlayerScans(playerId: string): Promise<PuzzleScan[]> {
  if (hasFirebaseEnv()) {
    const snapshot = await firebaseDb().collection(collections.scans).where("player_id", "==", playerId).get();
    return snapshot.docs
      .map((doc) => doc.data() as PuzzleScan)
      .sort((a, b) => a.piece_number - b.piece_number);
  }
  const db = await readLocalDb();
  return db.puzzle_scans
    .filter((scan) => scan.player_id === playerId)
    .sort((a, b) => a.piece_number - b.piece_number);
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

  if (hasFirebaseEnv()) {
    const db = firebaseDb();
    const now = nowIso();
    const scanRef = db.collection(collections.scans).doc(`${playerId}__${pieceNumber}`);
    let scan: PuzzleScan | null = null;
    let isNewPiece = false;

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(scanRef);
      if (snapshot.exists) {
        const existing = snapshot.data() as PuzzleScan;
        scan = { ...existing, last_scanned_at: now, scan_count: existing.scan_count + 1 };
        transaction.set(scanRef, scan);
      } else {
        isNewPiece = true;
        scan = {
          id: scanRef.id,
          player_id: playerId,
          piece_number: pieceNumber,
          first_scanned_at: now,
          last_scanned_at: now,
          scan_count: 1,
          unique_scan: true
        };
        transaction.set(scanRef, scan);
      }
    });

    const scans = await getPlayerScans(playerId);
    let updatedPlayer = player;
    if (scans.length >= 6 && !player.completed) {
      const completionTime = nowIso();
      updatedPlayer = { ...player, completed: true, completion_time: completionTime, updated_at: completionTime };
      await db.collection(collections.players).doc(playerId).set(updatedPlayer);
    }

    const contentRows = await allDocuments<FunFact>(collections.content);
    const unlock = pickUnlock(contentRows.length ? contentRows : SEED_FACTS, pieceNumber, isNewPiece);
    const unlockRow: Unlock = {
      id: makeId("unlock"),
      player_id: playerId,
      piece_number: pieceNumber,
      content_id: unlock.id,
      unlocked_at: nowIso()
    };
    await db.collection(collections.unlocks).doc(unlockRow.id).set(unlockRow);
    return {
      player: updatedPlayer,
      scan: scan as unknown as PuzzleScan,
      scans,
      unlock,
      is_new_piece: isNewPiece,
      completion_code: scans.length >= 6 ? completionCode(playerId) : null
    };
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
  assertProductionPersistence();
  const local = hasFirebaseEnv() ? null : await readLocalDb();
  const players = hasFirebaseEnv() ? await allDocuments<Player>(collections.players) : local!.players;
  const scans = hasFirebaseEnv() ? await allDocuments<PuzzleScan>(collections.scans) : local!.puzzle_scans;

  const rows = players.map((player) => {
    const pieceNumbers = Array.from(new Set(scans
      .filter((scan) => scan.player_id === player.id && scan.unique_scan)
      .map((scan) => scan.piece_number)))
      .sort((a, b) => a - b);
    return {
      rank: 0,
      player_id: player.id,
      display_name: displayName(player.nickname),
      pieces: pieceNumbers.length,
      piece_numbers: pieceNumbers,
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
  const local = hasFirebaseEnv() ? null : await readLocalDb();
  const store = hasFirebaseEnv()
    ? {
        players: await allDocuments<Player>(collections.players),
        puzzle_scans: await allDocuments<PuzzleScan>(collections.scans),
        unlocks: await allDocuments<Unlock>(collections.unlocks),
        fun_facts: await allDocuments<FunFact>(collections.content),
        admin_settings: [await getSettings()]
      }
    : local!;
  const uniqueScans = store.puzzle_scans.filter((scan) => scan.unique_scan);
  const pieceCounts = Array.from({ length: 6 }, (_, index) => {
    const piece = index + 1;
    return {
      piece,
      unique: uniqueScans.filter((scan) => scan.piece_number === piece).length,
      total: store.puzzle_scans.filter((scan) => scan.piece_number === piece).reduce((sum, scan) => sum + scan.scan_count, 0)
    };
  });
  return {
    mode: backendMode(),
    settings: store.admin_settings[0] ?? defaultSettings,
    totalParticipants: store.players.length,
    totalScans: store.puzzle_scans.reduce((sum, scan) => sum + scan.scan_count, 0),
    uniqueScans: uniqueScans.length,
    completionCount: store.players.filter((player) => player.completed).length,
    pieceCounts,
    mostPopular: [...pieceCounts].sort((a, b) => b.total - a.total)[0],
    leaderboard: await getLeaderboard(),
    participants: store.players.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)),
    recentScans: store.puzzle_scans.slice().sort((a, b) => b.last_scanned_at.localeCompare(a.last_scanned_at)).slice(0, 25),
    content: store.fun_facts
  };
}

async function deleteFirebaseCollection(name: string) {
  const db = firebaseDb();
  while (true) {
    const snapshot = await db.collection(name).limit(400).get();
    if (snapshot.empty) return;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export async function resetProgress() {
  if (hasFirebaseEnv()) {
    await deleteFirebaseCollection(collections.unlocks);
    await deleteFirebaseCollection(collections.scans);
    await deleteFirebaseCollection(collections.players);
    return;
  }
  const db = await readLocalDb();
  db.players = [];
  db.puzzle_scans = [];
  db.unlocks = [];
  await writeLocalDb(db);
}

export async function upsertContent(item: FunFact) {
  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.content).doc(item.id).set(item);
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
  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.content).doc(id).delete();
    return;
  }
  const db = await readLocalDb();
  db.fun_facts = db.fun_facts.filter((item) => item.id !== id);
  await writeLocalDb(db);
}

export async function listQrCodes(): Promise<GeneratedQrCode[]> {
  const rows = hasFirebaseEnv()
    ? await allDocuments<GeneratedQrCode>(collections.qrCodes)
    : (await readLocalDb()).qr_codes;
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getQrCode(id: string): Promise<GeneratedQrCode | null> {
  if (hasFirebaseEnv()) {
    const snapshot = await firebaseDb().collection(collections.qrCodes).doc(id).get();
    return snapshot.exists ? (snapshot.data() as GeneratedQrCode) : null;
  }
  return (await readLocalDb()).qr_codes.find((item) => item.id === id) ?? null;
}

export async function saveQrCode(input: Omit<GeneratedQrCode, "id" | "created_at" | "updated_at">) {
  const now = nowIso();
  const row: GeneratedQrCode = { ...input, id: makeId("qr"), created_at: now, updated_at: now };
  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.qrCodes).doc(row.id).set(row);
    return row;
  }
  const db = await readLocalDb();
  db.qr_codes.push(row);
  await writeLocalDb(db);
  return row;
}

export async function deleteQrCode(id: string) {
  if (hasFirebaseEnv()) {
    await firebaseDb().collection(collections.qrCodes).doc(id).delete();
    return;
  }
  const db = await readLocalDb();
  db.qr_codes = db.qr_codes.filter((item) => item.id !== id);
  await writeLocalDb(db);
}
