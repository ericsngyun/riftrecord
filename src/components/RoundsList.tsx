'use client';

import { useState } from 'react';
import { TournamentRound } from '@/types';
import { MatchupCard } from './MatchupCard';
import { useTournament } from '@/context/TournamentContext';
import { calculateFullTournamentStats } from '@/lib/utils';
import { Trophy, AlertTriangle, Swords } from 'lucide-react';

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
      <div className="card text-center py-12">
        <Trophy className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No rounds yet</h3>
        <p className="text-foreground-muted">
          Add your first round to start tracking your tournament!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg border border-border">
        <div>
          <p className="text-sm text-foreground-muted">Overall Record</p>
          <p className="text-2xl font-bold text-foreground">{stats.overall.record}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground-muted">Win Rate</p>
          <p className="text-2xl font-bold text-foreground">{stats.overall.winRate}%</p>
        </div>
      </div>

      {/* Swiss Rounds Section */}
      {swissRounds.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-foreground-muted" />
              <h3 className="text-lg font-semibold text-foreground">Swiss Rounds</h3>
            </div>
            <span className="text-sm text-foreground-muted">
              {stats.swiss.record} ({stats.swiss.winRate}%)
            </span>
          </div>
          <div className="space-y-3">
            {swissRounds.map((round) => (
              <div key={round.id}>
                {deleteConfirmId === round.id && (
                  <div className="flex items-center gap-2 p-2 mb-2 bg-accent-danger/10 border border-accent-danger/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-accent-danger" />
                    <span className="text-sm text-accent-danger">
                      Click delete again to confirm removal
                    </span>
                  </div>
                )}
                <MatchupCard
                  round={round}
                  playerLeaderId={playerLeaderId}
                  onDelete={() => handleDeleteClick(round.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Cut Section */}
      {topcutRounds.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-warning" />
              <h3 className="text-lg font-semibold text-accent-warning">Top Cut</h3>
            </div>
            <span className="text-sm text-foreground-muted">
              {stats.topcut.record} ({stats.topcut.winRate}%)
            </span>
          </div>
          <div className="space-y-3">
            {topcutRounds.map((round) => (
              <div key={round.id}>
                {deleteConfirmId === round.id && (
                  <div className="flex items-center gap-2 p-2 mb-2 bg-accent-danger/10 border border-accent-danger/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-accent-danger" />
                    <span className="text-sm text-accent-danger">
                      Click delete again to confirm removal
                    </span>
                  </div>
                )}
                <MatchupCard
                  round={round}
                  playerLeaderId={playerLeaderId}
                  onDelete={() => handleDeleteClick(round.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
