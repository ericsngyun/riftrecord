'use client';

import { useRef, useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { getLeaderById } from '@/data/leaders';
import { calculateFullTournamentStats, generateLeaderGradient, generateMatchupGradient, isWin } from '@/lib/utils';
import { LeaderCard } from './LeaderCard';
import { ArrowLeft, Download, Copy, Check, Twitter, Trophy, Swords } from 'lucide-react';

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

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0f0f13',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `riftrecord-${tournament.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
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
        backgroundColor: '#0f0f13',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          handleExport();
        }
      }
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
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

      {/* Export Preview Card */}
      <div
        ref={exportRef}
        className="rounded-xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '480px',
          aspectRatio: '1200 / 675',
          margin: '0 auto',
        }}
      >
        <div
          className="w-full h-full p-4 flex flex-col relative"
          style={{
            background: playerLeader
              ? generateLeaderGradient(tournament.playerLeaderId, 135)
              : '#1a1a22',
          }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.75) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {playerLeader && (
                  <LeaderCard leader={playerLeader} size="sm" showName={false} />
                )}
                <div>
                  <h2 className="text-sm font-bold text-white line-clamp-1">
                    {tournament.title}
                  </h2>
                  <p className="text-[10px] text-white/60">{formatLabel}</p>
                  {playerLeader && (
                    <p className="text-xs font-medium text-white/80">{playerLeader.displayName}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/60 justify-end">
                  <Trophy className="w-3 h-3" />
                  <span className="text-[9px]">Record</span>
                </div>
                <p className="text-lg font-bold text-white">{stats.overall.record}</p>
              </div>
            </div>

            {/* Rounds Container */}
            <div className="flex-1 overflow-hidden flex flex-col gap-1.5">
              {/* Swiss Rounds */}
              {swissRounds.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Swords className="w-2.5 h-2.5 text-white/60" />
                    <span className="text-[9px] font-medium text-white/60">
                      Swiss: {stats.swiss.record}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {swissRounds.slice(0, 8).map((round) => {
                      const opponent = getLeaderById(round.opponentLeaderId);
                      const won = isWin(round.result);
                      return (
                        <div
                          key={round.id}
                          className="relative rounded overflow-hidden p-1"
                          style={{
                            background: generateMatchupGradient(
                              tournament.playerLeaderId,
                              round.opponentLeaderId
                            ),
                          }}
                        >
                          <div className="absolute inset-0 bg-black/50" />
                          <div className="relative z-10 flex items-center justify-between gap-0.5">
                            <span className="text-[8px] text-white/80 truncate flex-1">
                              {opponent?.displayName}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-0.5 rounded ${
                                won ? 'bg-green-500/40 text-green-300' : 'bg-red-500/40 text-red-300'
                              }`}
                            >
                              {round.result}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Top Cut Rounds */}
              {topcutRounds.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Trophy className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] font-medium text-amber-400">
                      Top Cut: {stats.topcut.record}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {topcutRounds.map((round) => {
                      const opponent = getLeaderById(round.opponentLeaderId);
                      const won = isWin(round.result);
                      const topcutInfo = round.topcutLevel
                        ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
                        : null;
                      return (
                        <div
                          key={round.id}
                          className="relative rounded overflow-hidden p-1 border border-amber-500/30"
                          style={{
                            background: generateMatchupGradient(
                              tournament.playerLeaderId,
                              round.opponentLeaderId
                            ),
                          }}
                        >
                          <div className="absolute inset-0 bg-black/50" />
                          <div className="relative z-10">
                            <span className="text-[7px] font-bold text-amber-400">
                              {topcutInfo?.shortLabel}
                            </span>
                            <div className="flex items-center justify-between gap-0.5">
                              <span className="text-[8px] text-white/80 truncate flex-1">
                                {opponent?.displayName}
                              </span>
                              <span
                                className={`text-[8px] font-bold px-0.5 rounded ${
                                  won ? 'bg-green-500/40 text-green-300' : 'bg-red-500/40 text-red-300'
                                }`}
                              >
                                {round.result}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-1.5 border-t border-white/10">
              <p className="text-[8px] text-white/40 text-center">
                Generated with RiftRecord
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions - Compact */}
      <div className="flex gap-2 max-w-[480px] mx-auto">
        <button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="flex-1 py-2 bg-accent-primary hover:bg-purple-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 py-2 bg-background-tertiary hover:bg-background-secondary text-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>

        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 bg-background-tertiary hover:bg-background-secondary text-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Twitter className="w-3.5 h-3.5" />
          Share
        </a>
      </div>

      {/* Full Results List - Compact */}
      <div className="bg-background-secondary rounded-xl border border-border p-3 max-w-[480px] mx-auto">
        <h3 className="text-sm font-semibold text-foreground mb-3">Full Results</h3>

        {/* Swiss Results */}
        {swissRounds.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Swords className="w-3 h-3 text-foreground-muted" />
              <span className="text-xs font-medium text-foreground-muted">
                Swiss ({stats.swiss.record})
              </span>
            </div>
            <div className="space-y-1">
              {swissRounds.map((round) => {
                const opponent = getLeaderById(round.opponentLeaderId);
                const won = isWin(round.result);
                return (
                  <div
                    key={round.id}
                    className="flex items-center justify-between py-1.5 px-2 bg-background-tertiary rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground-muted w-6">R{round.roundNumber}</span>
                      <span className="text-xs font-medium text-foreground">{opponent?.displayName}</span>
                    </div>
                    <span className={`text-xs font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
                      {won ? 'W' : 'L'} {round.result}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topcut Results */}
        {topcutRounds.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3 h-3 text-accent-warning" />
              <span className="text-xs font-medium text-accent-warning">
                Top Cut ({stats.topcut.record})
              </span>
            </div>
            <div className="space-y-1">
              {topcutRounds.map((round) => {
                const opponent = getLeaderById(round.opponentLeaderId);
                const won = isWin(round.result);
                const topcutInfo = round.topcutLevel
                  ? TOPCUT_LEVEL_OPTIONS.find((t) => t.value === round.topcutLevel)
                  : null;
                return (
                  <div
                    key={round.id}
                    className="flex items-center justify-between py-1.5 px-2 bg-background-tertiary rounded border-l-2 border-accent-warning/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-accent-warning w-8">
                        {topcutInfo?.shortLabel}
                      </span>
                      <span className="text-xs font-medium text-foreground">{opponent?.displayName}</span>
                    </div>
                    <span className={`text-xs font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
                      {won ? 'W' : 'L'} {round.result}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Summary - Compact */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-emerald-400">{stats.overall.wins}</p>
              <p className="text-[10px] text-foreground-muted">Wins</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-400">{stats.overall.losses}</p>
              <p className="text-[10px] text-foreground-muted">Losses</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.overall.winRate}%</p>
              <p className="text-[10px] text-foreground-muted">WR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
