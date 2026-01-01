'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { calculateFullTournamentStats, isWin } from '@/lib/utils';
import { ArrowLeft, Download, Copy, Check, Twitter, Trophy, Swords, Dices } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TournamentResultsProps {
  onBack: () => void;
}

export function TournamentResults({ onBack }: TournamentResultsProps) {
  const { state } = useTournament();
  const { tournament } = state;
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!tournament) return null;

  const playerLeader = getLeaderById(tournament.playerLeaderId);
  const formatLabel = TOURNAMENT_FORMATS[tournament.format];
  const stats = calculateFullTournamentStats(tournament.rounds);
  const swissRounds = tournament.rounds.filter((r) => r.roundType === 'swiss');
  const topcutRounds = tournament.rounds.filter((r) => r.roundType === 'topcut');

  const [color1, color2] = playerLeader ? getLeaderColors(playerLeader) : ['#6b7280', '#9ca3af'];

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.querySelector('[data-export]');
          if (clonedEl) {
            (clonedEl as HTMLElement).style.borderRadius = '0';
          }
        },
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `riftrecord-${tournament.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Fallback to download
            handleExport();
          }
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (error) {
      console.error('Copy failed:', error);
      setIsExporting(false);
    }
  };

  const tweetText = encodeURIComponent(
    `${tournament.title}\n\nPlaying ${playerLeader?.displayName}: ${stats.overall.record} (${stats.overall.winRate}% WR)${topcutRounds.length > 0 ? `\nTop Cut: ${stats.topcut.record}` : ''}\n\n#Riftbound #RiftRecord`
  );

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Export Card */}
      <div
        ref={exportRef}
        data-export
        className="rounded-xl overflow-hidden mx-auto"
        style={{ maxWidth: '400px' }}
      >
        <div
          className="p-4"
          style={{
            background: `linear-gradient(135deg, ${color1}15 0%, #0a0a0f 50%, ${color2}15 100%)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
            {playerLeader && (
              <div
                className="w-12 h-[60px] rounded-lg p-[2px] flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
              >
                <div className="w-full h-full rounded-[6px] overflow-hidden bg-black">
                  <Image
                    src={playerLeader.imageUrl}
                    alt={playerLeader.displayName}
                    width={48}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{tournament.title}</h2>
              <p className="text-[10px] text-white/50">{formatLabel}</p>
              {playerLeader && (
                <p className="text-xs text-white/70">{playerLeader.displayName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{stats.overall.record}</p>
              <p className="text-[10px] text-white/50">{stats.overall.winRate}% WR</p>
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
                    const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
                    return (
                      <div
                        key={round.id}
                        className={cn(
                          'p-1.5 rounded border',
                          won ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
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
                          <span className={cn(
                            'text-[9px] font-bold',
                            won ? 'text-emerald-400' : 'text-red-400'
                          )}>
                            {round.result}
                          </span>
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
                    const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
                    const topcutInfo = round.topcutLevel
                      ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
                      : null;
                    return (
                      <div
                        key={round.id}
                        className={cn(
                          'p-1.5 rounded border border-amber-500/30',
                          won ? 'bg-emerald-500/5' : 'bg-red-500/5'
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
                          <span className={cn(
                            'text-[9px] font-bold',
                            won ? 'text-emerald-400' : 'text-red-400'
                          )}>
                            {round.result}
                          </span>
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
          <div className="mt-4 pt-2 border-t border-white/10">
            <p className="text-[8px] text-white/30 text-center uppercase tracking-widest">
              RiftRecord
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 max-w-[400px] mx-auto">
        <button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
            copied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
          )}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Image'}
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 py-2.5 bg-background-tertiary hover:bg-background-secondary text-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-background-tertiary hover:bg-background-secondary text-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          Share
        </a>
      </div>

      {/* Detailed Results */}
      <div className="bg-background-secondary rounded-xl border border-border overflow-hidden max-w-[400px] mx-auto">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground">Match Details</h3>
        </div>

        <div className="divide-y divide-border">
          {/* Swiss Rounds */}
          {swissRounds.map((round) => {
            const opponent = getLeaderById(round.opponentLeaderId);
            const won = isWin(round.result);
            const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
            return (
              <div key={round.id} className="flex items-center gap-2 px-3 py-2">
                <span className="text-[10px] text-foreground-muted w-5">R{round.roundNumber}</span>
                <div
                  className="w-6 h-7 rounded p-[1px] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                >
                  {opponent && (
                    <div className="w-full h-full rounded-[3px] overflow-hidden bg-black">
                      <Image
                        src={opponent.imageUrl}
                        alt={opponent.displayName}
                        width={24}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs text-foreground flex-1 truncate">{opponent?.displayName}</span>
                {round.diceWon !== undefined && (
                  <Dices className={cn(
                    'w-3.5 h-3.5',
                    round.diceWon ? 'text-emerald-400' : 'text-foreground-muted/30'
                  )} />
                )}
                <span className={cn(
                  'text-xs font-bold',
                  won ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {won ? 'W' : 'L'} {round.result}
                </span>
              </div>
            );
          })}

          {/* Top Cut Rounds */}
          {topcutRounds.map((round) => {
            const opponent = getLeaderById(round.opponentLeaderId);
            const won = isWin(round.result);
            const [oColor1, oColor2] = opponent ? getLeaderColors(opponent) : ['#666', '#888'];
            const topcutInfo = round.topcutLevel
              ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
              : null;
            return (
              <div key={round.id} className="flex items-center gap-2 px-3 py-2 bg-amber-500/5">
                <span className="text-[10px] text-amber-400 w-5">{topcutInfo?.shortLabel}</span>
                <div
                  className="w-6 h-7 rounded p-[1px] flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${oColor1}, ${oColor2})` }}
                >
                  {opponent && (
                    <div className="w-full h-full rounded-[3px] overflow-hidden bg-black">
                      <Image
                        src={opponent.imageUrl}
                        alt={opponent.displayName}
                        width={24}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs text-foreground flex-1 truncate">{opponent?.displayName}</span>
                {round.diceWon !== undefined && (
                  <Dices className={cn(
                    'w-3.5 h-3.5',
                    round.diceWon ? 'text-emerald-400' : 'text-foreground-muted/30'
                  )} />
                )}
                <span className={cn(
                  'text-xs font-bold',
                  won ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {won ? 'W' : 'L'} {round.result}
                </span>
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
}
