'use client';

import { useState } from 'react';
import { TournamentRound } from '@/types';
import { MatchupCard } from './MatchupCard';
import { useTournament } from '@/context/TournamentContext';
import { calculateTournamentStats } from '@/lib/utils';
import { Trophy, AlertTriangle } from 'lucide-react';

interface RoundsListProps {
  rounds: TournamentRound[];
  playerLeaderId: string;
}

export function RoundsList({ rounds, playerLeaderId }: RoundsListProps) {
  const { deleteRound } = useTournament();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = calculateTournamentStats(rounds);

  const handleDeleteClick = (roundId: string) => {
    if (deleteConfirmId === roundId) {
      deleteRound(roundId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(roundId);
      // Auto-cancel after 3 seconds
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
    <div className="space-y-4">
      {/* Running Record */}
      <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg border border-border">
        <div>
          <p className="text-sm text-foreground-muted">Current Record</p>
          <p className="text-2xl font-bold gradient-text">{stats.record}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground-muted">Win Rate</p>
          <p className="text-2xl font-bold text-foreground">{stats.winRate}%</p>
        </div>
      </div>

      {/* Rounds List */}
      <div className="space-y-3">
        {rounds.map((round) => (
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
  );
}
