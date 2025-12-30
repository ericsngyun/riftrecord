'use client';

import { useState } from 'react';
import { TournamentFormat } from '@/types';
import { LeaderSelector } from './LeaderSelector';
import { FormatSelector } from './FormatSelector';
import { useTournament } from '@/context/TournamentContext';
import { ArrowRight, Calendar } from 'lucide-react';

interface TournamentSetupProps {
  onComplete: () => void;
}

export function TournamentSetup({ onComplete }: TournamentSetupProps) {
  const { createTournament } = useTournament();
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<TournamentFormat | ''>('');
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!format) {
      newErrors.format = 'Please select a format';
    }

    if (!leaderId) {
      newErrors.leader = 'Please select your leader';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    createTournament(title.trim(), format as TournamentFormat, leaderId!);
    onComplete();
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Event Title */}
      <div className="space-y-2">
        <label
          htmlFor="event-title"
          className="block text-sm font-medium text-foreground-secondary"
        >
          Event Title
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder={`Store Championship - ${today}`}
            className="input pl-10"
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
        </div>
        {errors.title && (
          <p id="title-error" className="text-sm text-accent-danger">
            {errors.title}
          </p>
        )}
      </div>

      {/* Format Selection */}
      <div className="space-y-2">
        <FormatSelector
          value={format}
          onChange={(f) => {
            setFormat(f);
            if (errors.format) setErrors({ ...errors, format: '' });
          }}
          label="Tournament Format"
        />
        {errors.format && (
          <p className="text-sm text-accent-danger">{errors.format}</p>
        )}
      </div>

      {/* Leader Selection */}
      <div className="space-y-2">
        <LeaderSelector
          selectedLeaderId={leaderId}
          onSelect={(id) => {
            setLeaderId(id || null);
            if (errors.leader) setErrors({ ...errors, leader: '' });
          }}
          label="Your Leader"
          size="md"
        />
        {errors.leader && (
          <p className="text-sm text-accent-danger">{errors.leader}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn btn-primary w-full text-base py-3"
        >
          Start Tracking
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
