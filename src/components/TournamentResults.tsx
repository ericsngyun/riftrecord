'use client';

import { useRef, useState } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS } from '@/types';
import { getLeaderById } from '@/data/leaders';
import { calculateTournamentStats, generateLeaderGradient, generateMatchupGradient, isWin } from '@/lib/utils';
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
  const stats = calculateTournamentStats(tournament.rounds);

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

      // Download the image
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
            // Fallback: trigger download if clipboard fails
            handleExport();
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const tweetText = encodeURIComponent(
    `${tournament.title}\n\nPlaying ${playerLeader?.name}: ${stats.record} (${stats.winRate}% WR)\n\n#Riftbound #RiftRecord`
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="btn btn-ghost"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Tracker
      </button>

      {/* Export Preview Card */}
      <div
        ref={exportRef}
        className="rounded-xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '600px',
          aspectRatio: '1200 / 675',
          margin: '0 auto',
        }}
      >
        <div
          className="w-full h-full p-6 flex flex-col"
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
              background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-1">
                  {tournament.title}
                </h2>
                <p className="text-xs md:text-sm text-white/70">{formatLabel}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/70">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs">Record</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.record}</p>
              </div>
            </div>

            {/* Player Leader */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-black/30 rounded-lg">
              {playerLeader && (
                <>
                  <LeaderCard leader={playerLeader} size="sm" showName={false} />
                  <div>
                    <p className="text-xs text-white/60">Playing as</p>
                    <p className="text-base font-semibold text-white">
                      {playerLeader.name}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Matchups Grid */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-2 gap-2">
                {tournament.rounds.slice(0, 8).map((round) => {
                  const opponent = getLeaderById(round.opponentLeaderId);
                  const won = isWin(round.result);
                  return (
                    <div
                      key={round.id}
                      className="relative rounded-lg overflow-hidden p-2"
                      style={{
                        background: generateMatchupGradient(
                          tournament.playerLeaderId,
                          round.opponentLeaderId
                        ),
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/60">R{round.roundNumber}</span>
                          <Swords className="w-3 h-3 text-white/60" />
                          <span className="text-xs font-medium text-white truncate max-w-[80px]">
                            {opponent?.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            won
                              ? 'bg-green-500/30 text-green-400'
                              : 'bg-red-500/30 text-red-400'
                          }`}
                        >
                          {round.result}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {tournament.rounds.length > 8 && (
                <p className="text-xs text-white/50 text-center mt-2">
                  +{tournament.rounds.length - 8} more rounds
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-white/10">
              <p className="text-xs text-white/50 text-center">
                Generated with RiftRecord
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-[600px] mx-auto">
        <button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="btn btn-primary flex-1"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Image
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="btn btn-secondary flex-1"
        >
          <Download className="w-5 h-5" />
          Download
        </button>

        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary flex-1"
        >
          <Twitter className="w-5 h-5" />
          Share on X
        </a>
      </div>

      {/* Full Results List */}
      <div className="card max-w-[600px] mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Full Results</h3>
        <div className="space-y-2">
          {tournament.rounds.map((round) => {
            const opponent = getLeaderById(round.opponentLeaderId);
            const won = isWin(round.result);
            return (
              <div
                key={round.id}
                className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground-muted w-8">
                    R{round.roundNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    vs {opponent?.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    won ? 'text-accent-success' : 'text-accent-danger'
                  }`}
                >
                  {won ? 'W' : 'L'} {round.result}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent-success">{stats.wins}</p>
              <p className="text-sm text-foreground-muted">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-danger">{stats.losses}</p>
              <p className="text-sm text-foreground-muted">Losses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.winRate}%</p>
              <p className="text-sm text-foreground-muted">Win Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
