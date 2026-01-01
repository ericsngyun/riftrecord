'use client';

import Image from 'next/image';
import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS } from '@/types';
import { getLeaderById, getLeaderColors } from '@/data/leaders';
import { RoundEntry } from './RoundEntry';
import { RoundsList } from './RoundsList';
import { formatDate } from '@/lib/utils';
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

  // Calculate next round numbers
  const swissRounds = tournament.rounds.filter((r) => r.roundType === 'swiss');
  const topcutRounds = tournament.rounds.filter((r) => r.roundType === 'topcut');
  const nextSwissRound = swissRounds.length + 1;
  const nextTopcutRound = topcutRounds.length + 1;

  // Get leader colors for gradient
  const [color1, color2] = playerLeader
    ? getLeaderColors(playerLeader)
    : ['#6b7280', '#9ca3af'];
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  return (
    <div className="space-y-3">
      {/* Tournament Header - Compact */}
      <div className="bg-background-secondary rounded-xl border border-border p-3">
        <div className="flex items-center gap-3">
          {/* Leader Image */}
          {playerLeader && (
            <div
              className="relative w-12 h-[60px] rounded-lg p-[2px] flex-shrink-0"
              style={{ background: gradientBorder }}
            >
              <div className="w-full h-full rounded-[7px] overflow-hidden bg-black">
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

          {/* Tournament Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">
              {tournament.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <span>{formatLabel}</span>
              <span className="text-white/30">·</span>
              <span>{formatDate(tournament.createdAt)}</span>
            </div>
            {playerLeader && (
              <p className="text-sm text-white/70 mt-0.5">
                {playerLeader.displayName}
              </p>
            )}
          </div>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tournament settings"
          >
            <Settings className="w-4 h-4" />
          </button>
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
        <div className="sticky bottom-3 pt-2">
          <button
            type="button"
            onClick={onViewResults}
            className="w-full py-2.5 bg-accent-primary hover:bg-purple-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            View & Share Results
          </button>
        </div>
      )}
    </div>
  );
}
