'use client';

import { useState } from 'react';
import { MatchResult, RoundType, TopcutLevel, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { LeaderSelector } from './LeaderSelector';
import { ResultSelector } from './ResultSelector';
import { useTournament } from '@/context/TournamentContext';
import { Plus, X, MessageSquare, Trophy, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoundEntryProps {
  swissRoundNumber: number;
  topcutRoundNumber: number;
  onComplete?: () => void;
}

export function RoundEntry({ swissRoundNumber, topcutRoundNumber, onComplete }: RoundEntryProps) {
  const { addRound } = useTournament();
  const [roundType, setRoundType] = useState<RoundType>('swiss');
  const [topcutLevel, setTopcutLevel] = useState<TopcutLevel | null>(null);
  const [opponentLeaderId, setOpponentLeaderId] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentRoundNumber = roundType === 'swiss' ? swissRoundNumber : topcutRoundNumber;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!opponentLeaderId) {
      newErrors.opponent = 'Please select opponent\'s leader';
    }

    if (!result) {
      newErrors.result = 'Please select the result';
    }

    if (roundType === 'topcut' && !topcutLevel) {
      newErrors.topcutLevel = 'Please select the topcut stage';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addRound(
      opponentLeaderId!,
      result!,
      roundType,
      roundType === 'topcut' ? topcutLevel! : undefined,
      notes.trim() || undefined
    );

    // Reset form
    setOpponentLeaderId(null);
    setResult(null);
    setTopcutLevel(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
    onComplete?.();
  };

  const handleCancel = () => {
    setOpponentLeaderId(null);
    setResult(null);
    setTopcutLevel(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
  };

  const isFormDirty = opponentLeaderId || result || notes || topcutLevel;

  return (
    <div className="card space-y-6 animate-fadeIn">
      {/* Round Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setRoundType('swiss');
            setTopcutLevel(null);
          }}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all border-2 flex items-center justify-center gap-2',
            roundType === 'swiss'
              ? 'bg-background-tertiary border-accent-primary text-foreground'
              : 'bg-transparent border-border text-foreground-secondary hover:border-border-hover'
          )}
        >
          <Swords className="w-4 h-4" />
          Swiss Round
        </button>
        <button
          type="button"
          onClick={() => setRoundType('topcut')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all border-2 flex items-center justify-center gap-2',
            roundType === 'topcut'
              ? 'bg-accent-warning/20 border-accent-warning text-accent-warning'
              : 'bg-transparent border-border text-foreground-secondary hover:border-border-hover'
          )}
        >
          <Trophy className="w-4 h-4" />
          Top Cut
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {roundType === 'swiss' ? (
            <>Round {currentRoundNumber}</>
          ) : (
            <span className="text-accent-warning">Top Cut Game {currentRoundNumber}</span>
          )}
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

      {/* Topcut Level Selection */}
      {roundType === 'topcut' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-secondary">
            Top Cut Stage
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TOPCUT_LEVEL_OPTIONS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => {
                  setTopcutLevel(level.value);
                  if (errors.topcutLevel) setErrors({ ...errors, topcutLevel: '' });
                }}
                className={cn(
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all border',
                  topcutLevel === level.value
                    ? 'bg-accent-warning/20 border-accent-warning text-accent-warning'
                    : 'bg-background-tertiary border-border text-foreground-secondary hover:border-border-hover'
                )}
              >
                {level.shortLabel}
              </button>
            ))}
          </div>
          {errors.topcutLevel && (
            <p className="text-sm text-accent-danger">{errors.topcutLevel}</p>
          )}
        </div>
      )}

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
          opponentLeaderId && result && (roundType === 'swiss' || topcutLevel)
            ? roundType === 'topcut'
              ? 'bg-accent-warning hover:bg-amber-600 text-white'
              : 'btn-primary'
            : 'btn-secondary'
        )}
        disabled={!opponentLeaderId || !result || (roundType === 'topcut' && !topcutLevel)}
      >
        <Plus className="w-5 h-5" />
        {roundType === 'swiss' ? `Add Round ${currentRoundNumber}` : `Add ${topcutLevel ? TOPCUT_LEVEL_OPTIONS.find(l => l.value === topcutLevel)?.label : 'Top Cut'} Game`}
      </button>
    </div>
  );
}
