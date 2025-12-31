'use client';

import Image from 'next/image';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { RoundEntry } from './RoundEntry';
import { RoundsList } from './RoundsList';
import { generateLeaderGradient, formatDate } from '@/lib/utils';
import { Settings, Share2 } from 'lucide-react';

interface MatchTrackerProps {
  onViewResults: () => void;
  onReset: () => void;
}

export function MatchTracker({ onViewResults, onReset }: MatchTrackerProps) {
  const { state } = useTournament();
  const { tournament } = state;

  if (!tournament) return null;

  const playerLeader = getLeaderById(tournament.playerLeaderId);
  const formatLabel = TOURNAMENT_FORMATS[tournament.format];

  // Calculate next round numbers for swiss and topcut
  const swissRounds = tournament.rounds.filter((r) => r.roundType === 'swiss');
  const topcutRounds = tournament.rounds.filter((r) => r.roundType === 'topcut');
  const nextSwissRound = swissRounds.length + 1;
  const nextTopcutRound = topcutRounds.length + 1;

  // Get leader colors for gradient border
  const [color1, color2] = playerLeader
    ? getLeaderColors(playerLeader)
    : ['#6b7280', '#9ca3af'];
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tournament Header */}
      <div className="bg-background-secondary rounded-xl overflow-hidden border border-border">
        <div className="p-5">
          {/* Top Row: Title, Date, Settings */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">
                {tournament.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>{formatLabel}</span>
                <span className="text-white/30">·</span>
                <span>{formatDate(tournament.createdAt)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost text-white/50 hover:text-white hover:bg-white/10 p-2"
              aria-label="Tournament settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Player Leader */}
          {playerLeader && (
            <div className="flex items-center gap-4">
              {/* Leader image with gradient border */}
              <div
                className="relative w-14 h-[72px] rounded-xl p-[3px] flex-shrink-0"
                style={{ background: gradientBorder }}
              >
                <div className="w-full h-full rounded-[9px] overflow-hidden bg-black">
                  <Image
                    src={playerLeader.imageUrl}
                    alt={playerLeader.displayName}
                    width={56}
                    height={72}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Playing as</p>
                <p className="text-lg font-semibold text-white">
                  {playerLeader.displayName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Round Entry */}
      <RoundEntry
        swissRoundNumber={nextSwissRound}
        topcutRoundNumber={nextTopcutRound}
      />

      {/* Rounds List */}
      <RoundsList
        rounds={tournament.rounds}
        playerLeaderId={tournament.playerLeaderId}
      />

      {/* View Results Button */}
      {tournament.rounds.length > 0 && (
        <div className="sticky bottom-4 pt-4">
          <button
            type="button"
            onClick={onViewResults}
            className="btn btn-primary w-full py-4 text-base animate-pulse-glow"
          >
            <Share2 className="w-5 h-5" />
            View & Share Results
          </button>
        </div>
      )}
    </div>
  );
}
