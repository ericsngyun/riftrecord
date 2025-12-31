'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getLeaderColors, type Leader } from '@/data/leaders';
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

  const borderWidth = {
    sm: 'p-[2px]',
    md: 'p-[3px]',
    lg: 'p-[3px]',
  };

  const innerRadius = {
    sm: 'rounded-[6px]',
    md: 'rounded-[9px]',
    lg: 'rounded-[11px]',
  };

  const [color1, color2] = getLeaderColors(leader);
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-lg overflow-hidden transition-all duration-200',
        'group',
        sizeClasses[size],
        borderWidth[size],
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-lg',
        selected && 'ring-2 ring-white ring-offset-2 ring-offset-background',
        !onClick && 'cursor-default'
      )}
      style={{ background: gradientBorder }}
      aria-label={`Select ${leader.displayName}`}
      aria-pressed={selected}
    >
      {/* Inner container */}
      <div className={cn('w-full h-full overflow-hidden bg-black', innerRadius[size])}>
        {/* Leader image */}
        <Image
          src={leader.imageUrl}
          alt={leader.displayName}
          width={128}
          height={176}
          className="w-full h-full object-cover"
        />

        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-3 h-3 text-black" />
          </div>
        )}

        {/* Hover overlay */}
        {onClick && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        )}

        {/* Name label */}
        {showName && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-1 py-2">
            <p className="text-white text-xs font-medium text-center truncate">
              {leader.displayName}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
