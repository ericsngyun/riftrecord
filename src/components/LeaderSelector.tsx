'use client';

import { useState, useMemo } from 'react';
import { LEADERS } from '@/data/leaders';
import { LeaderCard } from './LeaderCard';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderSelectorProps {
  selectedLeaderId: string | null;
  onSelect: (leaderId: string) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LeaderSelector({
  selectedLeaderId,
  onSelect,
  label,
  size = 'md',
}: LeaderSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaders = useMemo(() => {
    if (!searchQuery.trim()) return LEADERS;
    const query = searchQuery.toLowerCase();
    return LEADERS.filter(
      (leader) =>
        leader.name.toLowerCase().includes(query) ||
        leader.displayName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedLeader = selectedLeaderId
    ? LEADERS.find((l) => l.id === selectedLeaderId)
    : null;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-foreground-muted">
          {label}
        </label>
      )}

      {/* Selected leader preview - compact inline */}
      {selectedLeader && (
        <div className="flex items-center gap-2 p-2 bg-background-tertiary rounded-lg">
          <LeaderCard leader={selectedLeader} size="sm" showName={false} />
          <span className="flex-1 text-sm font-medium text-foreground truncate">
            {selectedLeader.displayName}
          </span>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="p-1 rounded hover:bg-background-secondary transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-3.5 h-3.5 text-foreground-muted" />
          </button>
        </div>
      )}

      {/* Search input - compact */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background-tertiary border border-border rounded-lg pl-8 pr-8 py-1.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-primary"
          aria-label="Search leaders"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-background-secondary"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Leader grid - compact */}
      <div
        className={cn(
          'grid gap-1.5 max-h-48 overflow-y-auto p-0.5',
          size === 'sm' && 'grid-cols-6 sm:grid-cols-8',
          size === 'md' && 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6',
          size === 'lg' && 'grid-cols-3 sm:grid-cols-4'
        )}
        role="listbox"
        aria-label="Available leaders"
      >
        {filteredLeaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            selected={leader.id === selectedLeaderId}
            onClick={() => onSelect(leader.id)}
            size={size}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredLeaders.length === 0 && (
        <div className="text-center py-4 text-foreground-muted text-sm">
          No leaders found
        </div>
      )}
    </div>
  );
}
