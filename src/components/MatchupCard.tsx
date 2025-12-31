'use client';

import Image from 'next/image';
import { TournamentRound, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { cn, isWin } from '@/lib/utils';
import { BO3Result } from './BO3Result';
import { Trash2, MessageSquare, Trophy } from 'lucide-react';

interface MatchupCardProps {
  round: TournamentRound;
  playerLeaderId: string;
  onDelete?: () => void;
  compact?: boolean;
}

// Dice icon component
function DiceIcon({ won, className }: { won: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('w-5 h-5', className, won ? 'text-white' : 'text-white/30')}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill={won ? 'currentColor' : 'none'}
      />
      {won ? (
        // Winning dice - filled with dots
        <>
          <circle cx="8" cy="8" r="1.5" fill={won ? '#000' : 'currentColor'} />
          <circle cx="12" cy="12" r="1.5" fill={won ? '#000' : 'currentColor'} />
          <circle cx="16" cy="16" r="1.5" fill={won ? '#000' : 'currentColor'} />
        </>
      ) : (
        // Losing dice - outline only
        <>
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export function MatchupCard({
  round,
  playerLeaderId,
  onDelete,
  compact = false,
}: MatchupCardProps) {
  const opponentLeader = getLeaderById(round.opponentLeaderId);
  const won = isWin(round.result);
  const isTopcut = round.roundType === 'topcut';
  const topcutInfo = isTopcut && round.topcutLevel
    ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
    : null;

  if (!opponentLeader) return null;

  const [color1, color2] = getLeaderColors(opponentLeader);
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-white/5 border transition-all',
          isTopcut
            ? 'border-amber-500/50'
            : won
              ? 'border-emerald-500/30'
              : 'border-red-500/30'
        )}
      >
        {/* Leader Image with gradient border */}
        <div
          className="relative w-10 h-12 rounded-lg p-[2px] flex-shrink-0"
          style={{ background: gradientBorder }}
        >
          <div className="w-full h-full rounded-[6px] overflow-hidden bg-black">
            <Image
              src={opponentLeader.imageUrl}
              alt={opponentLeader.displayName}
              width={40}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isTopcut && (
              <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
            )}
            <span className="text-xs text-white/50">
              {isTopcut ? topcutInfo?.shortLabel : `R${round.roundNumber}`}
            </span>
          </div>
          <p className="text-sm font-medium text-white truncate">
            {opponentLeader.displayName}
          </p>
        </div>

        {/* Result */}
        <BO3Result result={round.result} size="sm" />

        {/* Dice */}
        {round.diceWon !== undefined && (
          <DiceIcon won={round.diceWon} className="flex-shrink-0" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden bg-background-secondary border-2 transition-all',
        isTopcut
          ? 'border-amber-500/70'
          : won
            ? 'border-emerald-500/40'
            : 'border-red-500/40'
      )}
    >
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isTopcut ? (
              <span className="badge-topcut flex items-center gap-1.5 text-xs">
                <Trophy className="w-3.5 h-3.5" />
                {topcutInfo?.label || 'Top Cut'}
              </span>
            ) : (
              <span className="badge-swiss text-xs">
                Round {round.roundNumber}
              </span>
            )}
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="btn btn-ghost text-white/40 hover:text-red-400 hover:bg-red-500/10 p-1.5"
              aria-label="Remove round"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Content Row */}
        <div className="flex items-center gap-4">
          {/* Leader Image with gradient border */}
          <div
            className="relative w-16 h-20 rounded-xl p-[3px] flex-shrink-0"
            style={{ background: gradientBorder }}
          >
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-black">
              <Image
                src={opponentLeader.imageUrl}
                alt={opponentLeader.displayName}
                width={64}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Leader Info */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-white truncate">
              {opponentLeader.displayName}
            </p>
            {round.opponentName && (
              <p className="text-sm text-white/50 truncate">
                {round.opponentName}
              </p>
            )}
          </div>

          {/* Result & Dice */}
          <div className="flex items-center gap-3">
            <BO3Result result={round.result} size="md" />

            {round.diceWon !== undefined && (
              <div className="flex flex-col items-center gap-0.5">
                <DiceIcon won={round.diceWon} />
                <span className="text-[10px] text-white/30">
                  {round.diceWon ? 'Won' : 'Lost'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {round.notes && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-white/5 rounded-lg">
            <MessageSquare className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/60">{round.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
