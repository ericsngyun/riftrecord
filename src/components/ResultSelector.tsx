'use client';

import { MatchResult, MATCH_RESULTS } from '@/types';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface ResultSelectorProps {
  value: MatchResult | null;
  onChange: (result: MatchResult) => void;
  label?: string;
}

export function ResultSelector({ value, onChange, label }: ResultSelectorProps) {
  // Separate win/loss results from draw
  const winLossResults = MATCH_RESULTS.filter(r => !r.isDraw);
  const drawResult = MATCH_RESULTS.find(r => r.isDraw);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-foreground-muted">
          {label}
        </label>
      )}
      <div className="flex gap-1.5">
        {winLossResults.map((result) => (
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
        {/* Draw Button */}
        {drawResult && (
          <button
            type="button"
            onClick={() => onChange(drawResult.value)}
            className={cn(
              'py-1.5 px-2.5 rounded-lg font-medium text-xs transition-all flex items-center gap-1',
              value === drawResult.value
                ? 'bg-white/20 text-white ring-1 ring-white/50'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            )}
            aria-pressed={value === drawResult.value}
          >
            <Flag className="w-3 h-3" />
            {drawResult.label}
          </button>
        )}
      </div>
    </div>
  );
}
