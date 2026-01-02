'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { LEADERS, getLeaderColors } from '@/data/leaders';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom image positioning for each leader (vertical offset percentage)
const LEADER_IMAGE_POSITIONS: Record<string, string> = {
  'ahri': 'center 10%',          // raised
  'darius': 'center 10%',        // raised
  'jinx': 'center 12%',          // raised
  'kaisa': 'center 20%',         // default
  'leesin': 'center 20%',        // default
  'leona': 'center 15%',         // raised slightly
  'missfortune': 'center 20%',   // default
  'sett': 'center 15%',          // raised slightly
  'teemo': 'center 25%',         // lowered slightly
  'viktor': 'center 25%',        // lowered slightly
  'volibear': 'center 15%',      // raised a little
  'yasuo': 'center 20%',         // default
  'azir': 'center 20%',          // default
  'draven': 'center 20%',        // default
  'ezreal': 'center 20%',        // default
  'fiora': 'center 20%',         // default
  'irelia': 'center 12%',        // raised a bit
  'jax': 'center 25%',           // lowered a bit
  'lucian': 'center 12%',        // raised
  'ornn': 'center 20%',          // default
  'reksai': 'center 12%',        // raised a bit
  'renata': 'center 15%',        // raised slightly
  'rumble': 'center 30%',        // lowered a bit
  'sivir': 'center 20%',         // default
};

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
        leader.displayName.toLowerCase().includes(query) ||
        leader.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedLeader = selectedLeaderId
    ? LEADERS.find((l) => l.id === selectedLeaderId)
    : null;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search leaders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background-tertiary border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all"
          aria-label="Search leaders"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-background-secondary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Leader list - scrollable column */}
      <div
        className="space-y-2.5 max-h-[280px] overflow-y-auto overflow-x-hidden p-1"
        role="listbox"
        aria-label="Available leaders"
      >
        {filteredLeaders.map((leader) => {
          const [color1, color2] = getLeaderColors(leader);
          const isSelected = leader.id === selectedLeaderId;
          const imagePosition = LEADER_IMAGE_POSITIONS[leader.id] || 'center 20%';

          return (
            <button
              key={leader.id}
              type="button"
              onClick={() => onSelect(leader.id)}
              className={cn(
                'group relative w-full h-28 rounded-xl overflow-hidden transition-all duration-300',
                'active:scale-[0.98]',
                isSelected
                  ? 'ring-2 ring-rose-400 shadow-xl shadow-rose-400/20'
                  : 'ring-1 ring-border/50 hover:ring-border hover:shadow-lg'
              )}
              aria-label={`Select ${leader.displayName}`}
              aria-pressed={isSelected}
            >
              {/* Background gradient with domain colors */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${color1}20 0%, ${color2}20 100%)`
                }}
              />

              {/* Leader image on right side with fade mask */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.7) 30%, black 50%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.7) 30%, black 50%)'
                }}
              >
                <Image
                  src={leader.imageUrl}
                  alt={leader.displayName}
                  width={400}
                  height={520}
                  className="h-full w-auto object-cover"
                  style={{
                    minWidth: '100%',
                    objectPosition: imagePosition
                  }}
                  priority={false}
                  quality={95}
                />
              </div>

              {/* Subtle background overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg,
                    #1a1a22 0%,
                    #1a1a22ee 35%,
                    #1a1a2266 60%,
                    transparent 100%)`
                }}
              />

              {/* Domain color accent gradient */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: `linear-gradient(90deg,
                    ${color1}30 0%,
                    ${color1}15 30%,
                    transparent 50%,
                    ${color2}15 70%,
                    ${color2}25 100%)`
                }}
              />

              {/* Content */}
              <div className="relative h-full flex items-center px-4 gap-3">
                {/* Accent gradient bar - left side */}
                <div
                  className={cn(
                    "w-1 h-16 rounded-full transition-all duration-300 flex-shrink-0",
                    isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                  )}
                  style={{
                    background: `linear-gradient(180deg, ${color1}, ${color2})`
                  }}
                />

                {/* Leader info */}
                <div className="flex-1 text-left min-w-0 py-3">
                  <h3 className={cn(
                    'font-bold truncate transition-all duration-300 leading-tight drop-shadow-lg',
                    isSelected ? 'text-rose-400 text-xl' : 'text-foreground text-lg group-hover:text-rose-300'
                  )}>
                    {leader.displayName}
                  </h3>
                  <p className={cn(
                    'text-sm truncate transition-colors drop-shadow-md mt-0.5 tracking-wide',
                    isSelected ? 'text-foreground-secondary' : 'text-foreground-muted group-hover:text-foreground-secondary'
                  )}>
                    {leader.title}
                  </p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  !isSelected && "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLeaders.length === 0 && (
        <div className="text-center py-8 text-foreground-muted">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No leaders found</p>
          <p className="text-xs mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results count */}
      {searchQuery && filteredLeaders.length > 0 && (
        <p className="text-xs text-foreground-muted text-center">
          Found {filteredLeaders.length} leader{filteredLeaders.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
