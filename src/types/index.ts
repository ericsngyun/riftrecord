// Leader represents a Riftbound leader card
export interface Leader {
  id: string;
  name: string;
  title: string;
  colors: [string, string]; // Primary and secondary color for gradients
  imageUrl: string;
}

// Tournament format types
export type TournamentFormat =
  | 'standard'
  | 'ffa3'
  | 'ffa4'
  | '2v2'
  | '1v1-duel'
  | '1v1-match';

export const TOURNAMENT_FORMATS: Record<TournamentFormat, string> = {
  'standard': 'Standard (Constructed)',
  'ffa3': 'FFA3 (Skirmish)',
  'ffa4': 'FFA4 (War)',
  '2v2': '2v2 (Magma Chamber)',
  '1v1-duel': '1v1 Duel',
  '1v1-match': '1v1 Match (Best of Three)',
};

// Match result represents the outcome of a Best of 3
export type MatchResult = '2-0' | '2-1' | '1-2' | '0-2';

export interface MatchResultInfo {
  value: MatchResult;
  label: string;
  isWin: boolean;
}

export const MATCH_RESULTS: MatchResultInfo[] = [
  { value: '2-0', label: 'W 2-0', isWin: true },
  { value: '2-1', label: 'W 2-1', isWin: true },
  { value: '1-2', label: 'L 1-2', isWin: false },
  { value: '0-2', label: 'L 0-2', isWin: false },
];

// Topcut placement levels
export type TopcutLevel = 'top64' | 'top32' | 'top16' | 'top8' | 'top4' | 'top2';

export const TOPCUT_LEVELS: Record<TopcutLevel, string> = {
  'top64': 'Top 64',
  'top32': 'Top 32',
  'top16': 'Top 16',
  'top8': 'Top 8',
  'top4': 'Top 4 (Semifinals)',
  'top2': 'Top 2 (Finals)',
};

export interface TopcutLevelInfo {
  value: TopcutLevel;
  label: string;
  shortLabel: string;
}

export const TOPCUT_LEVEL_OPTIONS: TopcutLevelInfo[] = [
  { value: 'top64', label: 'Top 64', shortLabel: 'T64' },
  { value: 'top32', label: 'Top 32', shortLabel: 'T32' },
  { value: 'top16', label: 'Top 16', shortLabel: 'T16' },
  { value: 'top8', label: 'Top 8', shortLabel: 'T8' },
  { value: 'top4', label: 'Top 4 (Semifinals)', shortLabel: 'T4' },
  { value: 'top2', label: 'Top 2 (Finals)', shortLabel: 'Finals' },
];

// Round type: swiss (normal rounds) or topcut (elimination)
export type RoundType = 'swiss' | 'topcut';

// A single round in a tournament
export interface TournamentRound {
  id: string;
  roundNumber: number;
  roundType: RoundType;
  opponentLeaderId: string;
  result: MatchResult;
  topcutLevel?: TopcutLevel; // Only set when roundType is 'topcut'
  notes?: string;
}

// Complete tournament data
export interface Tournament {
  id: string;
  title: string;
  format: TournamentFormat;
  playerLeaderId: string;
  rounds: TournamentRound[];
  createdAt: string;
  updatedAt: string;
}

// Computed tournament stats
export interface TournamentStats {
  wins: number;
  losses: number;
  record: string;
  winRate: number;
}

// Separate stats for swiss and topcut
export interface TournamentFullStats {
  swiss: TournamentStats;
  topcut: TournamentStats;
  overall: TournamentStats;
  finalPlacement?: TopcutLevel;
}
