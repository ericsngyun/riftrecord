'use client';

import { Leader } from '@/types';
import { cn, generateLeaderGradient } from '@/lib/utils';
import { Check } from 'lucide-react';

interface LeaderCardProps {
  leader: Leader;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function LeaderCard({
  leader,
  selected = false,
  onClick,
  size = 'md',
  showName = true,
}: LeaderCardProps) {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-44',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-lg overflow-hidden transition-all duration-200',
        'border-2 group',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-lg',
        selected
          ? 'border-accent-primary ring-2 ring-accent-primary/50'
          : 'border-border hover:border-border-hover',
        !onClick && 'cursor-default'
      )}
      aria-label={`Select ${leader.name}`}
      aria-pressed={selected}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: generateLeaderGradient(leader.id) }}
      />

      {/* Placeholder for leader art - shows initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            'font-bold text-white/90 drop-shadow-lg',
            iconSizes[size]
          )}
        >
          {leader.name.charAt(0)}
        </span>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-accent-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Hover overlay */}
      {onClick && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      )}

      {/* Name label */}
      {showName && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1.5">
          <p className="text-white text-xs font-medium text-center truncate">
            {leader.name}
          </p>
        </div>
      )}
    </button>
  );
}
