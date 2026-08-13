import "server-only";
import crypto from "node:crypto";
import type { Player, PuzzleScan, QuizAttempt, QuizAttemptStatus, QuizState } from "@/types/hunt";
import { firebaseDb, hasFirebaseEnv } from "@/lib/firebase-admin";
import { readLocalDb, writeLocalDb } from "@/lib/local-store";
import { FORGE_QUESTIONS, type ForgeQuestion } from "@/lib/question-bank";
import { makeId, nowIso } from "@/lib/utils";

export const QUIZ_DURATION_SECONDS = 15;
export const QUIZ_COOLDOWN_SECONDS = 3 * 60 * 60;

const collections = {
  players: "players",
  scans: "puzzle_scans",
  attempts: "quiz_attempts",
  states: "quiz_states"
} as const;

export class ChallengeError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code = "challenge_error"
  ) {
    super(message);
  }
}

export type ChallengeAttemptView = {
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

export type ChallengeStatus = {
  player: Player;
  scans: PuzzleScan[];
  attempt: ChallengeAttemptView | null;
  can_start: boolean;
  completed: boolean;
  next_available_at: string | null;
  cooldown_remaining_seconds: number;
  duration_seconds: number;
  cooldown_seconds: number;
  server_time: string;
};

function questionById(id: string) {
  return FORGE_QUESTIONS.find((question) => question.id === id);
}

function randomItem<T>(items: readonly T[]): T {
  if (!items.length) throw new Error("Cannot choose from an empty list.");
  return items[crypto.randomInt(items.length)];
}

function chooseQuestion(history: string[]) {
  const unseen = FORGE_QUESTIONS.filter((question) => !history.includes(question.id));
  return randomItem(unseen.length ? unseen : FORGE_QUESTIONS);
}

function effectiveStatus(attempt: QuizAttempt, timestamp = Date.now()): QuizAttemptStatus {
  if (attempt.status === "active" && new Date(attempt.expires_at).getTime() <= timestamp) return "expired";
  return attempt.status;
}

function viewAttempt(attempt: QuizAttempt | null, timestamp = Date.now()): ChallengeAttemptView | null {
  if (!attempt) return null;
  const question = questionById(attempt.question_id);
  if (!question) throw new Error(`Question ${attempt.question_id} is missing from the FORGE bank.`);
  const status = effectiveStatus(attempt, timestamp);
  const revealed = status !== "active";
  return {
    id: attempt.id,
    question_id: attempt.question_id,
    category: question.category,
    prompt: question.prompt,
    options: question.options,
    started_at: attempt.started_at,
    expires_at: attempt.expires_at,
    submitted_at: attempt.submitted_at,
    selected_index: attempt.selected_index,
    status,
    awarded_piece: attempt.awarded_piece,
    correct_index: revealed ? question.correctIndex : null,
    explanation: revealed ? question.explanation : null
  };
}

function shapeStatus(player: Player, scans: PuzzleScan[], state: QuizState | null, attempt: QuizAttempt | null): ChallengeStatus {
  const timestamp = Date.now();
  const nextAvailableAt = state?.next_available_at ?? null;
  const cooldownRemaining = nextAvailableAt
    ? Math.max(0, Math.ceil((new Date(nextAvailableAt).getTime() - timestamp) / 1000))
    : 0;
  const pieces = new Set(scans.map((scan) => scan.piece_number));
  const completed = player.completed || pieces.size >= 6;
  const attemptView = viewAttempt(attempt, timestamp);
  return {
    player,
    scans: scans.slice().sort((a, b) => a.piece_number - b.piece_number),
    attempt: attemptView,
    can_start: !completed && cooldownRemaining === 0 && attemptView?.status !== "active",
    completed,
    next_available_at: nextAvailableAt,
    cooldown_remaining_seconds: cooldownRemaining,
    duration_seconds: QUIZ_DURATION_SECONDS,
    cooldown_seconds: QUIZ_COOLDOWN_SECONDS,
    server_time: new Date(timestamp).toISOString()
  };
}

async function firebaseStatus(playerId: string): Promise<ChallengeStatus> {
  const db = firebaseDb();
  const [playerSnapshot, scansSnapshot, stateSnapshot] = await Promise.all([
    db.collection(collections.players).doc(playerId).get(),
    db.collection(collections.scans).where("player_id", "==", playerId).get(),
    db.collection(collections.states).doc(playerId).get()
  ]);
  if (!playerSnapshot.exists) throw new ChallengeError("Player not found.", 404, "player_not_found");
  const player = playerSnapshot.data() as Player;
  const scans = scansSnapshot.docs.map((document) => document.data() as PuzzleScan);
  const state = stateSnapshot.exists ? (stateSnapshot.data() as QuizState) : null;
  let attempt: QuizAttempt | null = null;
  if (state?.active_attempt_id) {
    const attemptSnapshot = await db.collection(collections.attempts).doc(state.active_attempt_id).get();
    attempt = attemptSnapshot.exists ? (attemptSnapshot.data() as QuizAttempt) : null;
    if (attempt && effectiveStatus(attempt) === "expired" && attempt.status === "active") {
      attempt = { ...attempt, status: "expired", submitted_at: attempt.expires_at };
      await db.collection(collections.attempts).doc(attempt.id).set(attempt, { merge: true });
    }
  }
  return shapeStatus(player, scans, state, attempt);
}

async function localStatus(playerId: string): Promise<ChallengeStatus> {
  const db = await readLocalDb();
  const player = db.players.find((row) => row.id === playerId);
  if (!player) throw new ChallengeError("Player not found.", 404, "player_not_found");
  const scans = db.puzzle_scans.filter((scan) => scan.player_id === playerId);
  const state = db.quiz_states.find((row) => row.player_id === playerId) ?? null;
  const attempt = state?.active_attempt_id
    ? db.quiz_attempts.find((row) => row.id === state.active_attempt_id) ?? null
    : null;
  if (attempt && effectiveStatus(attempt) === "expired" && attempt.status === "active") {
    attempt.status = "expired";
    attempt.submitted_at = attempt.expires_at;
    await writeLocalDb(db);
  }
  return shapeStatus(player, scans, state, attempt);
}

export async function getChallengeStatus(playerId: string) {
  return hasFirebaseEnv() ? firebaseStatus(playerId) : localStatus(playerId);
}

export async function startChallenge(playerId: string): Promise<ChallengeStatus> {
  const current = await getChallengeStatus(playerId);
  if (current.completed) throw new ChallengeError("Your puzzle is already complete.", 409, "puzzle_complete");
  if (current.attempt?.status === "active") return current;
  if (current.cooldown_remaining_seconds > 0) {
    throw new ChallengeError("Your next FORGE question is still cooling down.", 429, "cooldown_active");
  }

  const now = Date.now();
  const startedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + QUIZ_DURATION_SECONDS * 1000).toISOString();
  const nextAvailableAt = new Date(now + QUIZ_COOLDOWN_SECONDS * 1000).toISOString();

  if (hasFirebaseEnv()) {
    const db = firebaseDb();
    const stateRef = db.collection(collections.states).doc(playerId);
    let createdAttempt: QuizAttempt | null = null;
    await db.runTransaction(async (transaction) => {
      const stateSnapshot = await transaction.get(stateRef);
      const previous = stateSnapshot.exists ? (stateSnapshot.data() as QuizState) : null;
      if (previous && new Date(previous.next_available_at).getTime() > now) {
        throw new ChallengeError("Your next FORGE question is still cooling down.", 429, "cooldown_active");
      }
      const question = chooseQuestion(previous?.question_history ?? []);
      createdAttempt = {
        id: makeId("quiz"),
        player_id: playerId,
        question_id: question.id,
        started_at: startedAt,
        expires_at: expiresAt,
        submitted_at: null,
        selected_index: null,
        status: "active",
        awarded_piece: null
      };
      const priorHistory = previous?.question_history ?? [];
      const history = priorHistory.length >= FORGE_QUESTIONS.length ? [question.id] : [...priorHistory, question.id];
      const state: QuizState = {
        id: playerId,
        player_id: playerId,
        active_attempt_id: createdAttempt.id,
        next_available_at: nextAvailableAt,
        question_history: history,
        updated_at: startedAt
      };
      transaction.set(db.collection(collections.attempts).doc(createdAttempt.id), createdAttempt);
      transaction.set(stateRef, state);
    });
    if (!createdAttempt) throw new Error("Challenge attempt was not created.");
    return firebaseStatus(playerId);
  }

  const db = await readLocalDb();
  const priorState = db.quiz_states.find((row) => row.player_id === playerId);
  if (priorState && new Date(priorState.next_available_at).getTime() > now) {
    throw new ChallengeError("Your next FORGE question is still cooling down.", 429, "cooldown_active");
  }
  const question = chooseQuestion(priorState?.question_history ?? []);
  const attempt: QuizAttempt = {
    id: makeId("quiz"),
    player_id: playerId,
    question_id: question.id,
    started_at: startedAt,
    expires_at: expiresAt,
    submitted_at: null,
    selected_index: null,
    status: "active",
    awarded_piece: null
  };
  const priorHistory = priorState?.question_history ?? [];
  const history = priorHistory.length >= FORGE_QUESTIONS.length ? [question.id] : [...priorHistory, question.id];
  const state: QuizState = {
    id: playerId,
    player_id: playerId,
    active_attempt_id: attempt.id,
    next_available_at: nextAvailableAt,
    question_history: history,
    updated_at: startedAt
  };
  db.quiz_attempts.push(attempt);
  const stateIndex = db.quiz_states.findIndex((row) => row.player_id === playerId);
  if (stateIndex >= 0) db.quiz_states[stateIndex] = state;
  else db.quiz_states.push(state);
  await writeLocalDb(db);
  return localStatus(playerId);
}

function answerIsCorrect(question: ForgeQuestion, selectedIndex: number) {
  return Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex <= 3 && selectedIndex === question.correctIndex;
}

export async function submitChallenge(playerId: string, attemptId: string, selectedIndex: number): Promise<ChallengeStatus> {
  if (!attemptId) throw new ChallengeError("Missing challenge attempt.", 400, "missing_attempt");
  const submittedAt = nowIso();
  const submittedTimestamp = new Date(submittedAt).getTime();

  if (hasFirebaseEnv()) {
    const db = firebaseDb();
    const attemptRef = db.collection(collections.attempts).doc(attemptId);
    const playerRef = db.collection(collections.players).doc(playerId);
    const scanRefs = Array.from({ length: 6 }, (_, index) => db.collection(collections.scans).doc(`${playerId}__${index + 1}`));
    await db.runTransaction(async (transaction) => {
      const attemptSnapshot = await transaction.get(attemptRef);
      const playerSnapshot = await transaction.get(playerRef);
      if (!attemptSnapshot.exists || !playerSnapshot.exists) {
        throw new ChallengeError("Challenge attempt not found.", 404, "attempt_not_found");
      }
      const attempt = attemptSnapshot.data() as QuizAttempt;
      if (attempt.player_id !== playerId) throw new ChallengeError("This attempt belongs to another player.", 403, "attempt_forbidden");
      if (attempt.status !== "active") return;
      const question = questionById(attempt.question_id);
      if (!question) throw new Error(`Question ${attempt.question_id} is missing.`);
      const expired = new Date(attempt.expires_at).getTime() <= submittedTimestamp;
      const correct = !expired && answerIsCorrect(question, selectedIndex);
      const scanSnapshots = await transaction.getAll(...scanRefs);
      const missingPieces = scanSnapshots.flatMap((snapshot, index) => snapshot.exists ? [] : [index + 1]);
      let awardedPiece: number | null = null;
      if (correct && missingPieces.length) {
        awardedPiece = randomItem(missingPieces);
        const scan: PuzzleScan = {
          id: `${playerId}__${awardedPiece}`,
          player_id: playerId,
          piece_number: awardedPiece,
          first_scanned_at: submittedAt,
          last_scanned_at: submittedAt,
          scan_count: 1,
          unique_scan: true,
          acquisition_method: "quiz"
        };
        transaction.set(scanRefs[awardedPiece - 1], scan);
        if (missingPieces.length === 1) {
          const player = playerSnapshot.data() as Player;
          transaction.set(playerRef, { ...player, completed: true, completion_time: submittedAt, updated_at: submittedAt });
        }
      }
      transaction.set(attemptRef, {
        ...attempt,
        submitted_at: submittedAt,
        selected_index: Number.isInteger(selectedIndex) ? selectedIndex : null,
        status: expired ? "expired" : correct ? "correct" : "incorrect",
        awarded_piece: awardedPiece
      });
    });
    return firebaseStatus(playerId);
  }

  const db = await readLocalDb();
  const attempt = db.quiz_attempts.find((row) => row.id === attemptId);
  if (!attempt) throw new ChallengeError("Challenge attempt not found.", 404, "attempt_not_found");
  if (attempt.player_id !== playerId) throw new ChallengeError("This attempt belongs to another player.", 403, "attempt_forbidden");
  if (attempt.status === "active") {
    const question = questionById(attempt.question_id);
    if (!question) throw new Error(`Question ${attempt.question_id} is missing.`);
    const expired = new Date(attempt.expires_at).getTime() <= submittedTimestamp;
    const correct = !expired && answerIsCorrect(question, selectedIndex);
    const playerScans = db.puzzle_scans.filter((scan) => scan.player_id === playerId);
    const found = new Set(playerScans.map((scan) => scan.piece_number));
    const missingPieces = Array.from({ length: 6 }, (_, index) => index + 1).filter((piece) => !found.has(piece));
    let awardedPiece: number | null = null;
    if (correct && missingPieces.length) {
      awardedPiece = randomItem(missingPieces);
      db.puzzle_scans.push({
        id: makeId("scan"),
        player_id: playerId,
        piece_number: awardedPiece,
        first_scanned_at: submittedAt,
        last_scanned_at: submittedAt,
        scan_count: 1,
        unique_scan: true,
        acquisition_method: "quiz"
      });
      if (missingPieces.length === 1) {
        const player = db.players.find((row) => row.id === playerId);
        if (player) {
          player.completed = true;
          player.completion_time = submittedAt;
          player.updated_at = submittedAt;
        }
      }
    }
    attempt.submitted_at = submittedAt;
    attempt.selected_index = Number.isInteger(selectedIndex) ? selectedIndex : null;
    attempt.status = expired ? "expired" : correct ? "correct" : "incorrect";
    attempt.awarded_piece = awardedPiece;
    await writeLocalDb(db);
  }
  return localStatus(playerId);
}
