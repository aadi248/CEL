export type Accent = "maroon" | "blue" | "green" | "red" | "orange" | "purple";

export type Player = {
  id: string;
  nickname: string;
  first_name: string;
  branch: string | null;
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
};

export type ScanResult = {
  player: Player;
  scan: PuzzleScan;
  scans: PuzzleScan[];
  unlock: FunFact;
  is_new_piece: boolean;
  completion_code: string | null;
};
