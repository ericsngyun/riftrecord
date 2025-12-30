'use client';

import { TournamentRound, MATCH_RESULTS, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById } from '@/data/leaders';
import { generateMatchupGradient, cn, isWin } from '@/lib/utils';
import { LeaderCard } from './LeaderCard';
import { Trash2, MessageSquare, Swords, Trophy } from 'lucide-react';

interface MatchupCardProps {
  round: TournamentRound;
  playerLeaderId: string;
  onDelete?: () => void;
  showDeleteConfirm?: boolean;
  compact?: boolean;
}

export function MatchupCard({
  round,
  playerLeaderId,
  onDelete,
  compact = false,
}: MatchupCardProps) {
  const playerLeader = getLeaderById(playerLeaderId);
  const opponentLeader = getLeaderById(round.opponentLeaderId);
  const resultInfo = MATCH_RESULTS.find((r) => r.value === round.result);
  const won = isWin(round.result);
  const isTopcut = round.roundType === 'topcut';
  const topcutInfo = isTopcut && round.topcutLevel
    ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
    : null;

  if (!playerLeader || !opponentLeader) return null;

  const gradient = generateMatchupGradient(playerLeaderId, round.opponentLeaderId);

  if (compact) {
    return (
      <div
        className={cn(
          'relative rounded-lg overflow-hidden p-3',
          'border transition-all',
          isTopcut
            ? 'border-accent-warning/50'
            : won
              ? 'border-accent-success/30'
              : 'border-accent-danger/30'
        )}
        style={{ background: gradient }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTopcut ? (
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {topcutInfo?.shortLabel}
              </span>
            ) : (
              <span className="text-xs font-medium text-white/70">R{round.roundNumber}</span>
            )}
            <span className="text-sm font-semibold text-white">
              vs {opponentLeader.name}
            </span>
          </div>
          <span
            className={cn(
              'text-sm font-bold px-2 py-0.5 rounded',
              won ? 'bg-accent-success/30 text-accent-success' : 'bg-accent-danger/30 text-accent-danger'
            )}
          >
            {resultInfo?.label}
          </span>
        </div>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden animate-slideIn',
        'border-2 transition-all',
        isTopcut
          ? 'border-accent-warning/70'
          : won
            ? 'border-accent-success/50'
            : 'border-accent-danger/50'
      )}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-80"
        style={{ background: gradient }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {isTopcut ? (
            <span className="badge-topcut flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              {topcutInfo?.label || 'Top Cut'}
            </span>
          ) : (
            <span className="badge-swiss">
              Round {round.roundNumber}
            </span>
          )}
          <span
            className={cn(
              'text-lg font-bold px-3 py-1 rounded-lg',
              won
                ? 'bg-accent-success/20 text-accent-success'
                : 'bg-accent-danger/20 text-accent-danger'
            )}
          >
            {resultInfo?.label}
          </span>
        </div>

        {/* Matchup Display */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <LeaderCard leader={playerLeader} size="sm" showName={false} />
            <span className="text-sm font-medium text-white">
              {playerLeader.name}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Swords className="w-6 h-6 text-white/70" />
            <span className="text-xs text-white/50">vs</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <LeaderCard leader={opponentLeader} size="sm" showName={false} />
            <span className="text-sm font-medium text-white">
              {opponentLeader.name}
            </span>
          </div>
        </div>

        {/* Notes */}
        {round.notes && (
          <div className="mt-4 flex items-start gap-2 p-2 bg-black/30 rounded-lg">
            <MessageSquare className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/70">{round.notes}</p>
          </div>
        )}

        {/* Delete button */}
        {onDelete && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onDelete}
              className="btn btn-ghost text-white/60 hover:text-accent-danger hover:bg-accent-danger/20 text-sm py-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
