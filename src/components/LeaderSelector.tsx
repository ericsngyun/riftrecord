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
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-foreground-secondary">
          {label}
        </label>
      )}

      {/* Selected leader preview */}
      {selectedLeader && (
        <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg border border-border">
          <LeaderCard leader={selectedLeader} size="sm" showName={false} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{selectedLeader.displayName}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="p-1.5 rounded-md hover:bg-background-secondary transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search leaders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
          aria-label="Search leaders"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-background-tertiary"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Leader grid */}
      <div
        className={cn(
          'grid gap-3 max-h-80 overflow-y-auto p-1',
          size === 'sm' && 'grid-cols-5 sm:grid-cols-6 md:grid-cols-8',
          size === 'md' && 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5',
          size === 'lg' && 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
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
        <div className="text-center py-8 text-foreground-muted">
          <p>No leaders found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}
