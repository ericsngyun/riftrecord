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

  // Compute the current view based on state and manual overrides
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
          <div className="animate-pulse text-foreground-muted">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <div className="bg-app-overlay min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-secondary/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-accent-primary" />
              <span className="text-lg font-bold text-foreground">RiftRecord</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center">
                  <User className="w-4 h-4 text-foreground-muted" />
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-ghost text-sm py-1.5 px-2"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Reset Confirmation Banner */}
            {showResetConfirm && view === 'tracker' && (
              <div className="mb-4 p-3 bg-accent-warning/10 border border-accent-warning/30 rounded-lg flex items-center justify-between animate-fadeIn">
                <span className="text-sm text-accent-warning">
                  Click again to start a new tournament
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-danger text-sm py-1.5 px-3"
                >
                  Confirm Reset
                </button>
              </div>
            )}

            {/* View Content */}
            {view === 'setup' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-foreground mb-6">
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
