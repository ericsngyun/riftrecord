'use client';

import { TournamentFormat, TOURNAMENT_FORMATS } from '@/types';
import { ChevronDown } from 'lucide-react';

interface FormatSelectorProps {
  value: TournamentFormat | '';
  onChange: (format: TournamentFormat) => void;
  label?: string;
}

export function FormatSelector({ value, onChange, label }: FormatSelectorProps) {
  const formats = Object.entries(TOURNAMENT_FORMATS) as [TournamentFormat, string][];

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-foreground-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TournamentFormat)}
          className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground appearance-none pr-8 cursor-pointer focus:outline-none focus:border-accent-primary"
          aria-label={label || 'Select tournament format'}
        >
          <option value="" disabled>
            Select format...
          </option>
          {formats.map(([formatKey, formatLabel]) => (
            <option key={formatKey} value={formatKey}>
              {formatLabel}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted pointer-events-none" />
      </div>
    </div>
  );
}
