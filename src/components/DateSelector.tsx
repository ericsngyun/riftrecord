'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  value: string; // ISO date string
  onChange: (date: string) => void;
  label?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DateSelector({ value, onChange, label }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(today.toISOString());
    setViewDate(today);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Generate calendar days
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-foreground-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground text-left flex items-center gap-2 hover:border-border-hover focus:outline-none focus:border-accent-primary transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
          <span className={cn(!value && 'text-foreground-muted')}>
            {value ? formatDisplayDate(value) : 'Select date'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background-secondary border border-border rounded-xl shadow-lg z-50 p-3 animate-fadeIn">
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-foreground">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-medium text-foreground-muted text-center py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === month &&
                  today.getFullYear() === year;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      'aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center',
                      isSelected
                        ? 'bg-accent-primary text-white'
                        : isToday
                        ? 'bg-accent-primary/20 text-accent-primary ring-1 ring-accent-primary/50'
                        : 'text-foreground hover:bg-background-tertiary'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today Button */}
            <div className="mt-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleToday}
                className="w-full py-1.5 text-xs font-medium text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
