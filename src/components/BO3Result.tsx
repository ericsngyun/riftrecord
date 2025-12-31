'use client';

import { cn } from '@/lib/utils';
import type { MatchResult } from '@/types';

interface BO3ResultProps {
  result: MatchResult;
  size?: 'sm' | 'md' | 'lg';
}

// Parse result into individual game wins
function parseResult(result: MatchResult): { player: number; opponent: number; games: ('win' | 'loss')[] } {
  const [player, opponent] = result.split('-').map(Number);
  const games: ('win' | 'loss')[] = [];

  // Reconstruct the game sequence (wins first, then losses)
  for (let i = 0; i < player; i++) games.push('win');
  for (let i = 0; i < opponent; i++) games.push('loss');

  return { player, opponent, games };
}

export function BO3Result({ result, size = 'md' }: BO3ResultProps) {
  const { player, opponent, games } = parseResult(result);
  const isWin = player > opponent;

  const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center', sizeClasses[size])}>
      {games.map((game, index) => (
        <div
          key={index}
          className={cn(
            'rounded-full transition-all',
            dotSizes[size],
            game === 'win'
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
              : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
          )}
        />
      ))}
      {/* Show empty slot for 2-0 or 0-2 to indicate BO3 */}
      {games.length === 2 && (
        <div
          className={cn(
            'rounded-full border border-white/20',
            dotSizes[size]
          )}
        />
      )}
    </div>
  );
}

// Alternative display showing W/L text with colored background
export function BO3ResultBadge({ result, size = 'md' }: BO3ResultProps) {
  const { player, opponent } = parseResult(result);
  const isWin = player > opponent;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div
      className={cn(
        'font-bold rounded-lg inline-flex items-center gap-1',
        sizeClasses[size],
        isWin
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-red-500/20 text-red-400'
      )}
    >
      <span>{isWin ? 'W' : 'L'}</span>
      <span className="opacity-70">{result}</span>
    </div>
  );
}
