'use client';

import { memo } from 'react';
import Image from 'next/image';
import { TournamentRound, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { cn, isWin, isDraw } from '@/lib/utils';
import { BO3Result } from './BO3Result';
import { Trash2, Trophy, Dices } from 'lucide-react';

interface MatchupCardProps {
  round: TournamentRound;
  playerLeaderId: string;
  onDelete?: () => void;
  showDeleteConfirm?: boolean;
}

export const MatchupCard = memo(function MatchupCard({
  round,
  playerLeaderId,
  onDelete,
  showDeleteConfirm = false,
}: MatchupCardProps) {
  const opponentLeader = getLeaderById(round.opponentLeaderId);
  const won = isWin(round.result);
  const draw = isDraw(round.result);
  const isTopcut = round.roundType === 'topcut';
  const topcutInfo = isTopcut && round.topcutLevel
    ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
    : null;

  if (!opponentLeader) return null;

  const [color1, color2] = getLeaderColors(opponentLeader);
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  // Determine border color based on result
  const getBorderClass = () => {
    if (showDeleteConfirm) return 'border-accent-danger/50 bg-accent-danger/5';
    if (isTopcut) return 'border-amber-500/30';
    if (draw) return 'border-white/30';
    if (won) return 'border-emerald-500/20';
    return 'border-red-500/20';
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 p-2 rounded-lg bg-background-secondary border transition-all',
        getBorderClass()
      )}
    >
      {/* Leader Image */}
      <div
        className="relative w-9 h-11 rounded-md p-[1.5px] flex-shrink-0"
        style={{ background: gradientBorder }}
      >
        <div className="w-full h-full rounded-[5px] overflow-hidden bg-black">
          <Image
            src={opponentLeader.imageUrl}
            alt={opponentLeader.displayName}
            width={36}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isTopcut && (
            <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
          )}
          <span className="text-[10px] text-foreground-muted">
            {isTopcut ? topcutInfo?.shortLabel : `R${round.roundNumber}`}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">
          {opponentLeader.displayName}
        </p>
      </div>

      {/* Dice Roll Indicator */}
      {round.diceWon !== undefined && (
        <div
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded',
            round.diceWon
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-foreground-muted/10 text-foreground-muted/50'
          )}
          title={round.diceWon ? 'Won dice roll' : 'Lost dice roll'}
        >
          <Dices className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Result */}
      <BO3Result result={round.result} size="sm" />

      {/* Delete Button */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'p-1.5 rounded transition-colors flex-shrink-0',
            showDeleteConfirm
              ? 'text-accent-danger bg-accent-danger/10'
              : 'text-foreground-muted hover:text-accent-danger hover:bg-accent-danger/10'
          )}
          aria-label={showDeleteConfirm ? 'Confirm delete' : 'Delete round'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});
