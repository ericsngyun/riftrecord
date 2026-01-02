'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTournament } from '@/context/TournamentContext';
import { TournamentSetup, MatchTracker, TournamentResults } from '@/components';
import { LogOut, User } from 'lucide-react';
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
        {/* Header - Matching Landing Page */}
        <header className="sticky top-0 z-50 bg-background-secondary/90 backdrop-blur-sm border-b border-border">
          <div className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-3 md:px-6 py-2.5 flex items-center justify-between">
            <span
              className="text-xl tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.05em' }}
            >
              <span className="text-rose-400">Rift</span>
              <span className="text-white">Record</span>
            </span>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-rose-400/20"
                  unoptimized
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center ring-2 ring-rose-400/20">
                  <User className="w-4 h-4 text-foreground-muted" />
                </div>
              )}
              {session?.user?.name && (
                <span className="text-sm text-foreground font-medium hidden sm:inline-block">
                  {session.user.name}
                </span>
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
        <main className="py-4 md:py-6 px-3 md:px-6">
          <div className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
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
