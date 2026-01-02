'use client';

import { useState } from 'react';
import { TournamentFormat } from '@/types';
import { LeaderSelector } from './LeaderSelector';
import { FormatSelector } from './FormatSelector';
import { DateSelector } from './DateSelector';
import { useTournament } from '@/context/TournamentContext';
import { ArrowRight, Users } from 'lucide-react';

interface TournamentSetupProps {
  onComplete: () => void;
}

export function TournamentSetup({ onComplete }: TournamentSetupProps) {
  const { createTournament } = useTournament();
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<TournamentFormat | ''>('');
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [playerCount, setPlayerCount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Required';
    }

    if (!format) {
      newErrors.format = 'Required';
    }

    if (!leaderId) {
      newErrors.leader = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const count = playerCount ? parseInt(playerCount, 10) : undefined;
    createTournament(title.trim(), format as TournamentFormat, leaderId!, date, count);
    onComplete();
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Event Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="event-title"
          className="block text-xs font-medium text-foreground-muted"
        >
          Event Title
        </label>
        <input
          id="event-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          placeholder={`Local ${today}`}
          className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-primary"
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-xs text-accent-danger">
            {errors.title}
          </p>
        )}
      </div>

      {/* Date and Player Count Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Date Selection */}
        <DateSelector
          value={date}
          onChange={setDate}
          label="Date"
        />

        {/* Player Count */}
        <div className="space-y-1.5">
          <label
            htmlFor="player-count"
            className="block text-xs font-medium text-foreground-muted"
          >
            Players
          </label>
          <div className="relative">
            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
            <input
              id="player-count"
              type="number"
              min="2"
              max="999"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              placeholder="# of players"
              className="w-full bg-background-tertiary border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-1.5">
        <FormatSelector
          value={format}
          onChange={(f) => {
            setFormat(f);
            if (errors.format) setErrors({ ...errors, format: '' });
          }}
          label="Format"
        />
        {errors.format && (
          <p className="text-xs text-accent-danger">{errors.format}</p>
        )}
      </div>

      {/* Leader Selection */}
      <div className="space-y-1.5">
        <LeaderSelector
          selectedLeaderId={leaderId}
          onSelect={(id) => {
            setLeaderId(id || null);
            if (errors.leader) setErrors({ ...errors, leader: '' });
          }}
          label="Your Leader"
          size="sm"
        />
        {errors.leader && (
          <p className="text-xs text-accent-danger">{errors.leader}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-accent-primary hover:bg-purple-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors mt-2"
      >
        Start Tracking
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
