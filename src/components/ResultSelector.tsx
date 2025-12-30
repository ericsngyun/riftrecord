'use client';

import { MatchResult, MATCH_RESULTS } from '@/types';
import { cn } from '@/lib/utils';

interface ResultSelectorProps {
  value: MatchResult | null;
  onChange: (result: MatchResult) => void;
  label?: string;
}

export function ResultSelector({ value, onChange, label }: ResultSelectorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground-secondary">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {MATCH_RESULTS.map((result) => (
          <button
            key={result.value}
            type="button"
            onClick={() => onChange(result.value)}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all',
              'border-2',
              value === result.value
                ? result.isWin
                  ? 'bg-accent-success/20 border-accent-success text-accent-success'
                  : 'bg-accent-danger/20 border-accent-danger text-accent-danger'
                : 'bg-background-tertiary border-border text-foreground-secondary hover:border-border-hover'
            )}
            aria-pressed={value === result.value}
          >
            {result.label}
          </button>
        ))}
      </div>
    </div>
  );
}
