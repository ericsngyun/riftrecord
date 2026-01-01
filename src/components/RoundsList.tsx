'use client';

import { useState } from 'react';
import { TournamentRound } from '@/types';
import { MatchupCard } from './MatchupCard';
import { useTournament } from '@/context/TournamentContext';
import { calculateFullTournamentStats } from '@/lib/utils';
import { Trophy, Swords } from 'lucide-react';

interface RoundsListProps {
  rounds: TournamentRound[];
  playerLeaderId: string;
}

export function RoundsList({ rounds, playerLeaderId }: RoundsListProps) {
  const { deleteRound } = useTournament();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = calculateFullTournamentStats(rounds);
  const swissRounds = rounds.filter((r) => r.roundType === 'swiss');
  const topcutRounds = rounds.filter((r) => r.roundType === 'topcut');

  const handleDeleteClick = (roundId: string) => {
    if (deleteConfirmId === roundId) {
      deleteRound(roundId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(roundId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  if (rounds.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted">
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No rounds yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact Stats Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-background-tertiary rounded-lg text-sm">
        <span className="text-foreground-muted">Record</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">{stats.overall.record}</span>
          <span className="text-foreground-muted">·</span>
          <span className="text-foreground-muted">{stats.overall.winRate}%</span>
        </div>
      </div>

      {/* Swiss Rounds */}
      {swissRounds.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-foreground-muted" />
              <span className="text-xs font-medium text-foreground-muted">Swiss</span>
            </div>
            <span className="text-xs text-foreground-muted">{stats.swiss.record}</span>
          </div>
          <div className="space-y-1.5">
            {swissRounds.map((round) => (
              <MatchupCard
                key={round.id}
                round={round}
                playerLeaderId={playerLeaderId}
                onDelete={() => handleDeleteClick(round.id)}
                showDeleteConfirm={deleteConfirmId === round.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Cut Rounds */}
      {topcutRounds.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-accent-warning" />
              <span className="text-xs font-medium text-accent-warning">Top Cut</span>
            </div>
            <span className="text-xs text-foreground-muted">{stats.topcut.record}</span>
          </div>
          <div className="space-y-1.5">
            {topcutRounds.map((round) => (
              <MatchupCard
                key={round.id}
                round={round}
                playerLeaderId={playerLeaderId}
                onDelete={() => handleDeleteClick(round.id)}
                showDeleteConfirm={deleteConfirmId === round.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
