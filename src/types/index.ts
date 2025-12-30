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

// A single round in a tournament
export interface TournamentRound {
  id: string;
  roundNumber: number;
  opponentLeaderId: string;
  result: MatchResult;
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
