import { clsx, type ClassValue } from 'clsx';
import { TournamentRound, TournamentStats, MATCH_RESULTS } from '@/types';
import { getLeaderColors } from '@/data/leaders';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate a gradient CSS string from two leaders' colors
export function generateMatchupGradient(
  playerLeaderId: string,
  opponentLeaderId: string,
  angle: number = 135
): string {
  const [playerPrimary] = getLeaderColors(playerLeaderId);
  const [opponentPrimary] = getLeaderColors(opponentLeaderId);

  return `linear-gradient(${angle}deg, ${playerPrimary} 0%, ${opponentPrimary} 100%)`;
}

// Generate a leader's color gradient
export function generateLeaderGradient(
  leaderId: string,
  angle: number = 135
): string {
  const [primary, secondary] = getLeaderColors(leaderId);
  return `linear-gradient(${angle}deg, ${primary} 0%, ${secondary} 100%)`;
}

// Calculate tournament statistics from rounds
export function calculateTournamentStats(rounds: TournamentRound[]): TournamentStats {
  const wins = rounds.filter((round) => {
    const result = MATCH_RESULTS.find((r) => r.value === round.result);
    return result?.isWin;
  }).length;

  const losses = rounds.length - wins;
  const winRate = rounds.length > 0 ? (wins / rounds.length) * 100 : 0;

  return {
    wins,
    losses,
    record: `${wins}-${losses}`,
    winRate: Math.round(winRate * 10) / 10,
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
