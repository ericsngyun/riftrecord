'use client';

import { useState } from 'react';
import { MatchResult, RoundType, TopcutLevel, TOPCUT_LEVEL_OPTIONS } from '@/types';
import { LeaderSelector } from './LeaderSelector';
import { ResultSelector } from './ResultSelector';
import { useTournament } from '@/context/TournamentContext';
import { Plus, X, MessageSquare, Trophy, Swords, Dices } from 'lucide-react';
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
  const [diceWon, setDiceWon] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentRoundNumber = roundType === 'swiss' ? swissRoundNumber : topcutRoundNumber;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!opponentLeaderId) {
      newErrors.opponent = 'Select opponent';
    }

    if (!result) {
      newErrors.result = 'Select result';
    }

    if (roundType === 'topcut' && !topcutLevel) {
      newErrors.topcutLevel = 'Select stage';
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
      diceWon ?? undefined,
      notes.trim() || undefined
    );

    // Reset form
    setOpponentLeaderId(null);
    setResult(null);
    setTopcutLevel(null);
    setDiceWon(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
    onComplete?.();
  };

  const handleCancel = () => {
    setOpponentLeaderId(null);
    setResult(null);
    setTopcutLevel(null);
    setDiceWon(null);
    setNotes('');
    setShowNotes(false);
    setErrors({});
  };

  const isFormDirty = opponentLeaderId || result || notes || topcutLevel || diceWon !== null;
  const isValid = opponentLeaderId && result && (roundType === 'swiss' || topcutLevel);

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-3 space-y-3">
      {/* Round Type Toggle */}
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => {
            setRoundType('swiss');
            setTopcutLevel(null);
          }}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5',
            roundType === 'swiss'
              ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/50'
              : 'bg-background-tertiary text-foreground-muted hover:text-foreground border border-transparent'
          )}
        >
          <Swords className="w-3.5 h-3.5" />
          Swiss {currentRoundNumber > 1 && roundType === 'swiss' && `R${currentRoundNumber}`}
        </button>
        <button
          type="button"
          onClick={() => setRoundType('topcut')}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5',
            roundType === 'topcut'
              ? 'bg-accent-warning/20 text-accent-warning border border-accent-warning/50'
              : 'bg-background-tertiary text-foreground-muted hover:text-foreground border border-transparent'
          )}
        >
          <Trophy className="w-3.5 h-3.5" />
          Top Cut
        </button>
      </div>

      {/* Topcut Level */}
      {roundType === 'topcut' && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1">
            {TOPCUT_LEVEL_OPTIONS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => {
                  setTopcutLevel(level.value);
                  if (errors.topcutLevel) setErrors({ ...errors, topcutLevel: '' });
                }}
                className={cn(
                  'py-1 px-2.5 rounded text-xs font-medium transition-all',
                  topcutLevel === level.value
                    ? 'bg-accent-warning text-black'
                    : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
                )}
              >
                {level.shortLabel}
              </button>
            ))}
          </div>
          {errors.topcutLevel && (
            <p className="text-xs text-accent-danger">{errors.topcutLevel}</p>
          )}
        </div>
      )}

      {/* Opponent Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-muted">Opponent</span>
          {isFormDirty && (
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-foreground-muted hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        <LeaderSelector
          selectedLeaderId={opponentLeaderId}
          onSelect={(id) => {
            setOpponentLeaderId(id || null);
            if (errors.opponent) setErrors({ ...errors, opponent: '' });
          }}
          size="sm"
        />
        {errors.opponent && (
          <p className="text-xs text-accent-danger">{errors.opponent}</p>
        )}
      </div>

      {/* Result Selection */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-foreground-muted">Result</span>
        <ResultSelector
          value={result}
          onChange={(r) => {
            setResult(r);
            if (errors.result) setErrors({ ...errors, result: '' });
          }}
        />
        {errors.result && (
          <p className="text-xs text-accent-danger">{errors.result}</p>
        )}
      </div>

      {/* Dice Roll Toggle */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-foreground-muted">Dice Roll</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setDiceWon(true)}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5',
              diceWon === true
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            )}
          >
            <Dices className="w-3.5 h-3.5" />
            Won
          </button>
          <button
            type="button"
            onClick={() => setDiceWon(false)}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5',
              diceWon === false
                ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            )}
          >
            <Dices className="w-3.5 h-3.5" />
            Lost
          </button>
          <button
            type="button"
            onClick={() => setDiceWon(null)}
            className={cn(
              'py-1.5 px-2 rounded-lg text-xs font-medium transition-all',
              diceWon === null
                ? 'bg-foreground-muted/20 text-foreground-muted'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            )}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Notes */}
      {!showNotes ? (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="text-xs text-foreground-muted hover:text-foreground flex items-center gap-1"
        >
          <MessageSquare className="w-3 h-3" />
          Add notes
        </button>
      ) : (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes..."
          rows={2}
          className="w-full bg-background-tertiary border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground-muted resize-none focus:outline-none focus:border-accent-primary"
        />
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className={cn(
          'w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
          isValid
            ? roundType === 'topcut'
              ? 'bg-accent-warning text-black hover:bg-amber-400'
              : 'bg-accent-primary text-white hover:bg-purple-500'
            : 'bg-background-tertiary text-foreground-muted cursor-not-allowed'
        )}
      >
        <Plus className="w-4 h-4" />
        Add {roundType === 'swiss' ? `Round ${currentRoundNumber}` : topcutLevel ? TOPCUT_LEVEL_OPTIONS.find(l => l.value === topcutLevel)?.shortLabel : 'Game'}
      </button>
    </div>
  );
}
