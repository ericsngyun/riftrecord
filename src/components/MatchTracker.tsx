'use client';

import { useTournament } from '@/context/TournamentContext';
import { TOURNAMENT_FORMATS } from '@/types';
import { getLeaderById } from '@/data/leaders';
import { RoundEntry } from './RoundEntry';
import { RoundsList } from './RoundsList';
import { LeaderCard } from './LeaderCard';
import { generateLeaderGradient } from '@/lib/utils';
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
  const nextRound = tournament.rounds.length + 1;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tournament Header */}
      <div
        className="relative rounded-xl overflow-hidden p-6"
        style={{ background: generateLeaderGradient(tournament.playerLeaderId, 135) }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">
          {/* Tournament Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                {tournament.title}
              </h1>
              <p className="text-sm text-white/70">{formatLabel}</p>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Tournament settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Player Leader */}
          <div className="flex items-center gap-4">
            {playerLeader && (
              <>
                <LeaderCard leader={playerLeader} size="sm" showName={false} />
                <div>
                  <p className="text-sm text-white/70">Playing as</p>
                  <p className="text-lg font-semibold text-white">
                    {playerLeader.name}
                  </p>
                  <p className="text-xs text-white/50">{playerLeader.title}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Round Entry */}
      <RoundEntry roundNumber={nextRound} />

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
