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
}: LeaderCardProps) {
  const sizeClasses = {
    sm: 'w-10 h-12',
    md: 'w-14 h-[72px]',
    lg: 'w-20 h-[104px]',
  };

  const borderWidth = {
    sm: 'p-[1.5px]',
    md: 'p-[2px]',
    lg: 'p-[2px]',
  };

  const innerRadius = {
    sm: 'rounded-[4px]',
    md: 'rounded-[6px]',
    lg: 'rounded-[8px]',
  };

  const [color1, color2] = getLeaderColors(leader);
  const gradientBorder = `linear-gradient(135deg, ${color1}, ${color2})`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-md overflow-hidden transition-all duration-150',
        'group flex-shrink-0',
        sizeClasses[size],
        borderWidth[size],
        onClick && 'cursor-pointer hover:scale-105 active:scale-100',
        selected && 'ring-1.5 ring-white ring-offset-1 ring-offset-background',
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
          width={80}
          height={104}
          className="w-full h-full object-cover"
        />

        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow">
            <Check className="w-2 h-2 text-black" />
          </div>
        )}

        {/* Hover overlay */}
        {onClick && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        )}
      </div>
    </button>
  );
}
