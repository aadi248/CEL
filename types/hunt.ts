export type Accent = "maroon" | "blue" | "green" | "red" | "orange" | "purple";

export type Player = {
  id: string;
  nickname: string;
  first_name: string;
  bits_id_hash: string | null;
  created_at: string;
  updated_at: string;
  completion_time: string | null;
  completed: boolean;
};

export type PuzzleScan = {
  id: string;
  player_id: string;
  piece_number: number;
  first_scanned_at: string;
  last_scanned_at: string;
  scan_count: number;
  unique_scan: boolean;
  acquisition_method?: "qr" | "quiz";
};

export type QuizAttemptStatus = "active" | "correct" | "incorrect" | "expired";

export type QuizAttempt = {
  id: string;
  player_id: string;
  question_id: string;
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  selected_index: number | null;
  status: QuizAttemptStatus;
  awarded_piece: number | null;
};

export type QuizState = {
  id: string;
  player_id: string;
  active_attempt_id: string | null;
  next_available_at: string;
  question_history: string[];
  updated_at: string;
};

export type Unlock = {
  id: string;
  player_id: string;
  piece_number: number;
  content_id: string;
  unlocked_at: string;
};

export type FunFact = {
  id: string;
  category: string;
  title: string;
  body: string;
  source: string;
  source_url: string;
  source_date: string | null;
  accent_color: Accent;
  active: boolean;
  kind: "fact" | "joke";
};

export type AdminSettings = {
  id: string;
  leaderboard_enabled: boolean;
  hunt_enabled: boolean;
  announcement: string | null;
};

export type Piece = {
  number: number;
  slug: string;
  theme: string;
  headline: string;
  accent: Accent;
  visual: string;
  proposition: string;
  microcopy: string;
};

export type LeaderboardRow = {
  rank: number;
  player_id: string;
  display_name: string;
  pieces: number;
  completed: boolean;
  completion_time: string | null;
  elapsed_seconds: number | null;
  piece_numbers: number[];
};

export type GeneratedQrCode = {
  id: string;
  label: string;
  target: string;
  notes: string | null;
  foreground: string;
  background: string;
  created_at: string;
  updated_at: string;
};

export type ScanResult = {
  player: Player;
  scan: PuzzleScan;
  scans: PuzzleScan[];
  unlock: FunFact;
  is_new_piece: boolean;
  completion_code: string | null;
};
