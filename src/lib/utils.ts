import { clsx, type ClassValue } from 'clsx';
import { TournamentRound, TournamentStats, TournamentFullStats, MATCH_RESULTS, TopcutLevel } from '@/types';
import { getLeaderById, getLeaderColors, DOMAINS, type Leader } from '@/data/leaders';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Get colors for a leader by ID
export function getLeaderColorsById(leaderId: string): [string, string] {
  const leader = getLeaderById(leaderId);
  if (!leader) {
    return ['#6b7280', '#9ca3af']; // Default gray
  }
  return [DOMAINS[leader.domains[0]].color, DOMAINS[leader.domains[1]].color];
}

// Generate a gradient CSS string from two leaders' colors
export function generateMatchupGradient(
  playerLeaderId: string,
  opponentLeaderId: string,
  angle: number = 135
): string {
  const [playerPrimary] = getLeaderColorsById(playerLeaderId);
  const [opponentPrimary] = getLeaderColorsById(opponentLeaderId);

  return `linear-gradient(${angle}deg, ${playerPrimary} 0%, ${opponentPrimary} 100%)`;
}

// Generate a leader's color gradient by ID
export function generateLeaderGradient(
  leaderId: string,
  angle: number = 135
): string {
  const [primary, secondary] = getLeaderColorsById(leaderId);
  return `linear-gradient(${angle}deg, ${primary} 0%, ${secondary} 100%)`;
}

// Generate a leader's border gradient (for card borders)
export function generateLeaderBorderGradient(leader: Leader): string {
  const [color1, color2] = getLeaderColors(leader);
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

// Calculate tournament statistics from rounds
export function calculateTournamentStats(rounds: TournamentRound[]): TournamentStats {
  const wins = rounds.filter((round) => {
    const result = MATCH_RESULTS.find((r) => r.value === round.result);
    return result?.isWin;
  }).length;

  const draws = rounds.filter((round) => {
    const result = MATCH_RESULTS.find((r) => r.value === round.result);
    return result?.isDraw;
  }).length;

  const losses = rounds.length - wins - draws;
  const winRate = rounds.length > 0 ? (wins / rounds.length) * 100 : 0;

  // Format record with draws if any
  const record = draws > 0 ? `${wins}-${losses}-${draws}` : `${wins}-${losses}`;

  return {
    wins,
    losses,
    draws,
    record,
    winRate: Math.round(winRate * 10) / 10,
  };
}

// Calculate full tournament statistics with swiss/topcut separation
export function calculateFullTournamentStats(rounds: TournamentRound[]): TournamentFullStats {
  const swissRounds = rounds.filter((r) => r.roundType === 'swiss');
  const topcutRounds = rounds.filter((r) => r.roundType === 'topcut');

  const swiss = calculateTournamentStats(swissRounds);
  const topcut = calculateTournamentStats(topcutRounds);
  const overall = calculateTournamentStats(rounds);

  // Determine final placement based on topcut results
  let finalPlacement: TopcutLevel | undefined;
  if (topcutRounds.length > 0) {
    const lastTopcutRound = topcutRounds[topcutRounds.length - 1];
    if (lastTopcutRound.topcutLevel) {
      finalPlacement = lastTopcutRound.topcutLevel;
    }
  }

  return {
    swiss,
    topcut,
    overall,
    finalPlacement,
  };
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Check if a result is a win
export function isWin(result: string): boolean {
  return result === '2-0' || result === '2-1';
}

// Check if a result is a draw
export function isDraw(result: string): boolean {
  return result === 'draw';
}

// Local storage helpers
const STORAGE_KEY = 'riftrecord_tournament';

export function saveTournamentToStorage(tournament: unknown): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
  }
}

export function loadTournamentFromStorage(): unknown | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearTournamentStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
