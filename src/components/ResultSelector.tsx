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
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-foreground-muted">
          {label}
        </label>
      )}
      <div className="flex gap-1.5">
        {MATCH_RESULTS.map((result) => (
          <button
            key={result.value}
            type="button"
            onClick={() => onChange(result.value)}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg font-medium text-xs transition-all',
              value === result.value
                ? result.isWin
                  ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                  : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
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
