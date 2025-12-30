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
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TournamentFormat)}
          className="input appearance-none pr-10 cursor-pointer"
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
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
      </div>
    </div>
  );
}
