'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTournament } from '@/context/TournamentContext';
import { TournamentSetup, MatchTracker, TournamentResults } from '@/components';
import { Swords, LogOut, User } from 'lucide-react';
import Image from 'next/image';

type AppView = 'setup' | 'tracker' | 'results';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { state, resetTournament } = useTournament();
  const { tournament, isLoading } = state;
  const [manualView, setManualView] = useState<AppView | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const view = useMemo((): AppView => {
    if (manualView) return manualView;
    if (isLoading) return 'setup';
    return tournament ? 'tracker' : 'setup';
  }, [manualView, isLoading, tournament]);

  const setView = useCallback((newView: AppView) => {
    setManualView(newView);
  }, []);

  const handleReset = () => {
    if (showResetConfirm) {
      resetTournament();
      setManualView(null);
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app">
        <div className="bg-app-overlay min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-foreground-muted text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <div className="bg-app-overlay min-h-screen">
        {/* Header - Compact */}
        <header className="sticky top-0 z-50 bg-background-secondary/90 backdrop-blur-sm border-b border-border">
          <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Swords className="w-5 h-5 text-accent-primary" />
              <span className="text-base font-bold text-foreground">RiftRecord</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-background-tertiary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-foreground-muted" />
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - Tighter Padding */}
        <main className="py-4 px-3">
          <div className="max-w-lg mx-auto">
            {/* Reset Confirmation Banner */}
            {showResetConfirm && view === 'tracker' && (
              <div className="mb-3 p-2.5 bg-accent-warning/10 border border-accent-warning/30 rounded-lg flex items-center justify-between">
                <span className="text-xs text-accent-warning">
                  Click again to start a new tournament
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-medium text-white bg-accent-danger hover:bg-red-600 px-2.5 py-1 rounded transition-colors"
                >
                  Confirm
                </button>
              </div>
            )}

            {/* View Content */}
            {view === 'setup' && (
              <div className="bg-background-secondary rounded-xl border border-border p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  New Tournament
                </h2>
                <TournamentSetup onComplete={() => setView('tracker')} />
              </div>
            )}

            {view === 'tracker' && tournament && (
              <MatchTracker
                onViewResults={() => setView('results')}
                onReset={handleReset}
              />
            )}

            {view === 'results' && tournament && (
              <TournamentResults onBack={() => setView('tracker')} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
