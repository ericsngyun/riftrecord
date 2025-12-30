'use client';

import { useState } from 'react';
import { MatchResult } from '@/types';
import { LeaderSelector } from './LeaderSelector';
import { ResultSelector } from './ResultSelector';
import { useTournament } from '@/context/TournamentContext';
import { Plus, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoundEntryProps {
  roundNumber: number;
  onComplete?: () => void;
}

export function RoundEntry({ roundNumber, onComplete }: RoundEntryProps) {
  const { addRound } = useTournament();
  const [opponentLeaderId, setOpponentLeaderId] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!opponentLeaderId) {
      newErrors.opponent = 'Please select opponent\'s leader';
    }

    if (!result) {
      newErrors.result = 'Please select the result';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addRound(opponentLeaderId!, result!, notes.trim() || undefined);

    // Reset form
    setOpponentLeaderId(null);
    setResult(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
    onComplete?.();
  };

  const handleCancel = () => {
    setOpponentLeaderId(null);
    setResult(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
  };

  const isFormDirty = opponentLeaderId || result || notes;

  return (
    <div className="card space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Round {roundNumber}
        </h3>
        {isFormDirty && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-ghost text-sm py-1.5 px-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Opponent Leader Selection */}
      <div className="space-y-2">
        <LeaderSelector
          selectedLeaderId={opponentLeaderId}
          onSelect={(id) => {
            setOpponentLeaderId(id || null);
            if (errors.opponent) setErrors({ ...errors, opponent: '' });
          }}
          label="Opponent's Leader"
          size="sm"
        />
        {errors.opponent && (
          <p className="text-sm text-accent-danger">{errors.opponent}</p>
        )}
      </div>

      {/* Result Selection */}
      <div className="space-y-2">
        <ResultSelector
          value={result}
          onChange={(r) => {
            setResult(r);
            if (errors.result) setErrors({ ...errors, result: '' });
          }}
          label="Match Result"
        />
        {errors.result && (
          <p className="text-sm text-accent-danger">{errors.result}</p>
        )}
      </div>

      {/* Notes Toggle & Input */}
      <div className="space-y-2">
        {!showNotes ? (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="btn btn-ghost text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Add notes
          </button>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground-secondary">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Game notes, key plays, etc..."
              rows={2}
              className="input resize-none"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          'btn w-full',
          opponentLeaderId && result ? 'btn-primary' : 'btn-secondary'
        )}
        disabled={!opponentLeaderId || !result}
      >
        <Plus className="w-5 h-5" />
        Add Round {roundNumber}
      </button>
    </div>
  );
}
