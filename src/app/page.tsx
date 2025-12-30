'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { TournamentSetup, MatchTracker, TournamentResults } from '@/components';
import { Swords, RotateCcw } from 'lucide-react';

type AppView = 'setup' | 'tracker' | 'results';

export default function Home() {
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
      setManualView(null); // Reset to auto-computed view
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* App Header */}
        {view === 'setup' && (
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Swords className="w-10 h-10 text-accent-primary" />
              <h1 className="text-4xl font-bold gradient-text">RiftRecord</h1>
            </div>
            <p className="text-foreground-secondary text-lg">
              Track your Riftbound TCG tournament matches
            </p>
            <p className="text-foreground-muted text-sm mt-2">
              Record matchups, generate shareable results, dominate the meta
            </p>
          </header>
        )}

        {/* Reset Confirmation Banner */}
        {showResetConfirm && view === 'tracker' && (
          <div className="mb-4 p-3 bg-accent-warning/10 border border-accent-warning/30 rounded-lg flex items-center justify-between animate-fadeIn">
            <span className="text-sm text-accent-warning">
              Click again to start a new tournament (current data will be lost)
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-danger text-sm py-1.5 px-3"
            >
              <RotateCcw className="w-4 h-4" />
              Confirm Reset
            </button>
          </div>
        )}

        {/* View Content */}
        {view === 'setup' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Tournament Setup
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

        {/* Footer */}
        <footer className="mt-16 text-center text-foreground-muted text-sm">
          <p>
            Built for the Riftbound community
          </p>
        </footer>
      </div>
    </main>
  );
}
