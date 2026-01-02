'use client';

import { memo, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { calculateFullTournamentStats, isWin, isDraw } from '@/lib/utils';
import { ArrowLeft, Swords, Dices, Trophy, Users, Medal, Flag, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TournamentResultsProps {
  onBack: () => void;
  onSave?: () => Promise<void>;
}

export const TournamentResults = memo(function TournamentResults({ onBack, onSave }: TournamentResultsProps) {
  const { state, updateTournament } = useTournament();
  const { tournament } = state;
  const [placingInput, setPlacingInput] = useState<string>('');
  const [isEditingPlacing, setIsEditingPlacing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!tournament) return null;

  const playerLeader = getLeaderById(tournament.playerLeaderId);
  const formatLabel = TOURNAMENT_FORMATS[tournament.format];
  const stats = useMemo(() => calculateFullTournamentStats(tournament.rounds), [tournament.rounds]);
  const swissRounds = useMemo(() => tournament.rounds.filter((r) => r.roundType === 'swiss'), [tournament.rounds]);
  const topcutRounds = useMemo(() => tournament.rounds.filter((r) => r.roundType === 'topcut'), [tournament.rounds]);

  const [color1, color2] = playerLeader ? getLeaderColors(playerLeader) : ['#6b7280', '#9ca3af'];

  const handlePlacingSubmit = () => {
    const placing = parseInt(placingInput, 10);
    if (placing > 0) {
      updateTournament({ placing });
    }
    setIsEditingPlacing(false);
    setPlacingInput('');
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Format placing with ordinal suffix
  const formatPlacing = (placing: number): string => {
    if (placing === 1) return '1st';
    if (placing === 2) return '2nd';
    if (placing === 3) return '3rd';
    return `${placing}th`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Back and Save */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              saveSuccess
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-accent-primary hover:bg-purple-500 text-white'
            )}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : isSaving ? (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Result
              </>
            )}
          </button>
        )}
      </div>

      {/* Placing & Player Count Editor */}
      <div className="flex gap-2">
        {/* Placing */}
        <div className="flex-1 bg-background-secondary rounded-lg border border-border p-2.5">
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-foreground-muted">Placing</span>
          </div>
          {isEditingPlacing ? (
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="number"
                min="1"
                value={placingInput}
                onChange={(e) => setPlacingInput(e.target.value)}
                placeholder="#"
                className="w-16 bg-background-tertiary border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePlacingSubmit();
                  if (e.key === 'Escape') setIsEditingPlacing(false);
                }}
              />
              <button
                type="button"
                onClick={handlePlacingSubmit}
                className="text-xs text-accent-primary hover:text-purple-400"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlacingInput(tournament.placing?.toString() || '');
                setIsEditingPlacing(true);
              }}
              className="text-lg font-bold text-white mt-0.5 hover:text-accent-primary transition-colors"
            >
              {tournament.placing ? formatPlacing(tournament.placing) : 'Add'}
            </button>
          )}
        </div>

        {/* Player Count */}
        <div className="flex-1 bg-background-secondary rounded-lg border border-border p-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-foreground-muted">Players</span>
          </div>
          <p className="text-lg font-bold text-white mt-0.5">
            {tournament.playerCount || '—'}
          </p>
        </div>
      </div>

      {/* Results Card - Optimized for Screenshots */}
      <div className="rounded-xl overflow-hidden mx-auto w-full max-w-[400px] border-2 border-border shadow-2xl">
        <div
          className="p-5"
          style={{
            background: `linear-gradient(135deg, ${color1}15 0%, #0a0a0f 50%, ${color2}15 100%)`,
          }}
        >
          {/* Header */}
          <div className="mb-5 pb-4 border-b border-white/10">
            {/* Summary Info */}
            <div className="mb-3 space-y-1">
              <h2 className="text-lg font-bold text-white">{tournament.title}</h2>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span>{formatLabel}</span>
                {tournament.playerCount && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {tournament.playerCount}
                    </span>
                  </>
                )}
                {tournament.placing && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Medal className="w-3 h-3" />
                      {formatPlacing(tournament.placing)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-white/50">
                {new Date(tournament.date || tournament.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Leader and Score */}
            <div className="flex items-center gap-3">
              {playerLeader && (
                <div
                  className="w-14 h-[70px] rounded-lg p-[2px] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
                >
                  <div className="w-full h-full rounded-[6px] overflow-hidden bg-black">
                    <Image
                      src={playerLeader.imageUrl}
                      alt={playerLeader.displayName}
                      width={56}
                      height={70}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                {playerLeader && (
                  <p className="text-base font-bold text-white">{playerLeader.displayName}</p>
                )}
                <p className="text-[11px] text-white/60">{playerLeader?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white leading-none mb-1">{stats.overall.record}</p>
                <p className="text-[11px] text-white/60">{stats.overall.winRate}% WR</p>
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-3">
            {/* Swiss */}
            {swissRounds.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Swords className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                    Swiss {stats.swiss.record}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {swissRounds.slice(0, 8).map((round) => {
                    const opponent = getLeaderById(round.opponentLeaderId);
                    const won = isWin(round.result);
                    const draw = isDraw(round.result);
                    const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
                    return (
                      <div
                        key={round.id}
                        className={cn(
                          'p-1.5 rounded border',
                          draw
                            ? 'border-white/30 bg-white/5'
                            : won
                              ? 'border-emerald-500/30 bg-emerald-500/5'
                              : 'border-red-500/30 bg-red-500/5'
                        )}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div
                            className="w-4 h-5 rounded-sm overflow-hidden flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                          >
                            {opponent && (
                              <Image
                                src={opponent.imageUrl}
                                alt={opponent.displayName}
                                width={16}
                                height={20}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-[8px] text-white/70 truncate flex-1">
                            {opponent?.displayName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          {draw ? (
                            <Flag className="w-3 h-3 text-white/70" />
                          ) : (
                            <span className={cn(
                              'text-[9px] font-bold',
                              won ? 'text-emerald-400' : 'text-red-400'
                            )}>
                              {round.result}
                            </span>
                          )}
                          {round.diceWon !== undefined && (
                            <Dices className={cn(
                              'w-2.5 h-2.5',
                              round.diceWon ? 'text-emerald-400' : 'text-white/20'
                            )} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Cut */}
            {topcutRounds.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">
                    Top Cut {stats.topcut.record}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {topcutRounds.map((round) => {
                    const opponent = getLeaderById(round.opponentLeaderId);
                    const won = isWin(round.result);
                    const draw = isDraw(round.result);
                    const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
                    const topcutInfo = round.topcutLevel
                      ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
                      : null;
                    return (
                      <div
                        key={round.id}
                        className={cn(
                          'p-1.5 rounded border border-amber-500/30',
                          draw ? 'bg-white/5' : won ? 'bg-emerald-500/5' : 'bg-red-500/5'
                        )}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[7px] font-bold text-amber-400">
                            {topcutInfo?.shortLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <div
                            className="w-4 h-5 rounded-sm overflow-hidden flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                          >
                            {opponent && (
                              <Image
                                src={opponent.imageUrl}
                                alt={opponent.displayName}
                                width={16}
                                height={20}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-[8px] text-white/70 truncate flex-1">
                            {opponent?.displayName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          {draw ? (
                            <Flag className="w-3 h-3 text-white/70" />
                          ) : (
                            <span className={cn(
                              'text-[9px] font-bold',
                              won ? 'text-emerald-400' : 'text-red-400'
                            )}>
                              {round.result}
                            </span>
                          )}
                          {round.diceWon !== undefined && (
                            <Dices className={cn(
                              'w-2.5 h-2.5',
                              round.diceWon ? 'text-emerald-400' : 'text-white/20'
                            )} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-white/10">
            <p className="text-[9px] text-white/40 text-center uppercase tracking-widest font-medium">
              RiftRecord
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-background-secondary rounded-xl border border-border overflow-hidden max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground">Match Details</h3>
        </div>

        <div className="divide-y divide-border">
          {/* Swiss Rounds */}
          {swissRounds.map((round, index) => {
            const opponent = getLeaderById(round.opponentLeaderId);
            const won = isWin(round.result);
            const draw = isDraw(round.result);
            const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
            return (
              <div key={round.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-background-tertiary/30 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background-tertiary flex-shrink-0">
                  <span className="text-xs font-bold text-foreground">
                    {index + 1}
                  </span>
                </div>
                <div
                  className="w-7 h-9 rounded p-[1px] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                >
                  {opponent && (
                    <div className="w-full h-full rounded-[3px] overflow-hidden bg-black">
                      <Image
                        src={opponent.imageUrl}
                        alt={opponent.displayName}
                        width={28}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{opponent?.displayName}</p>
                  <p className="text-[10px] text-foreground-muted">Round {round.roundNumber}</p>
                </div>
                {round.diceWon !== undefined && (
                  <Dices className={cn(
                    'w-4 h-4',
                    round.diceWon ? 'text-emerald-400' : 'text-foreground-muted/30'
                  )} />
                )}
                <div className={cn(
                  'px-3 py-1.5 rounded-lg font-bold text-sm min-w-[60px] text-center flex items-center justify-center gap-1',
                  draw
                    ? 'bg-white/10 text-white'
                    : won
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                )}>
                  {draw ? (
                    <>
                      <Flag className="w-3 h-3" />
                      DRAW
                    </>
                  ) : (
                    round.result
                  )}
                </div>
              </div>
            );
          })}

          {/* Top Cut Rounds */}
          {topcutRounds.map((round, index) => {
            const opponent = getLeaderById(round.opponentLeaderId);
            const won = isWin(round.result);
            const draw = isDraw(round.result);
            const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
            const topcutInfo = round.topcutLevel
              ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
              : null;
            return (
              <div key={round.id} className="flex items-center gap-3 px-3 py-2.5 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 flex-shrink-0">
                  <span className="text-xs font-bold text-amber-400">
                    {index + 1}
                  </span>
                </div>
                <div
                  className="w-7 h-9 rounded p-[1px] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                >
                  {opponent && (
                    <div className="w-full h-full rounded-[3px] overflow-hidden bg-black">
                      <Image
                        src={opponent.imageUrl}
                        alt={opponent.displayName}
                        width={28}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{opponent?.displayName}</p>
                  <p className="text-[10px] text-amber-400">{topcutInfo?.label}</p>
                </div>
                {round.diceWon !== undefined && (
                  <Dices className={cn(
                    'w-4 h-4',
                    round.diceWon ? 'text-emerald-400' : 'text-foreground-muted/30'
                  )} />
                )}
                <div className={cn(
                  'px-3 py-1.5 rounded-lg font-bold text-sm min-w-[60px] text-center flex items-center justify-center gap-1',
                  draw
                    ? 'bg-white/10 text-white'
                    : won
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                )}>
                  {draw ? (
                    <>
                      <Flag className="w-3 h-3" />
                      DRAW
                    </>
                  ) : (
                    round.result
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="px-3 py-3 border-t border-border bg-background-tertiary/50">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-emerald-400">{stats.overall.wins}</p>
              <p className="text-[9px] text-foreground-muted uppercase">Wins</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-lg font-bold text-red-400">{stats.overall.losses}</p>
              <p className="text-[9px] text-foreground-muted uppercase">Losses</p>
            </div>
            {stats.overall.draws > 0 && (
              <>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-bold text-white">{stats.overall.draws}</p>
                  <p className="text-[9px] text-foreground-muted uppercase">Draws</p>
                </div>
              </>
            )}
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-lg font-bold text-foreground">{stats.overall.winRate}%</p>
              <p className="text-[9px] text-foreground-muted uppercase">Win Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
