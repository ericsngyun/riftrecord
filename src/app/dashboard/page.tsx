'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTournament } from '@/context/TournamentContext';
import { TournamentSetup, MatchTracker, TournamentResults } from '@/components';
import { LogOut, User, History, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

type AppView = 'setup' | 'tracker' | 'results' | 'history';

interface SavedTournament {
  id: string;
  title: string;
  format: string;
  leaderId: string;
  date: string;
  playerCount: number | null;
  placing: number | null;
  createdAt: string;
  rounds: Array<{
    id: string;
    roundNumber: number;
    type: string;
    topcutLevel: string | null;
    opponentLeader: string | null;
    result: string | null;
    diceWon: boolean | null;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { state, resetTournament, updateTournament } = useTournament();
  const { tournament, isLoading } = state;
  const [manualView, setManualView] = useState<AppView | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedTournaments, setSavedTournaments] = useState<SavedTournament[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // Fetch saved tournaments
  const fetchSavedTournaments = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/tournaments');
      if (response.ok) {
        const data = await response.json();
        setSavedTournaments(data);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Save current tournament
  const handleSaveTournament = useCallback(async () => {
    if (!tournament) return;

    const response = await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tournament.title,
        format: tournament.format,
        leaderId: tournament.playerLeaderId,
        date: tournament.date,
        playerCount: tournament.playerCount,
        placing: tournament.placing,
        rounds: tournament.rounds,
      }),
    });

    if (response.ok) {
      updateTournament({ savedAt: new Date().toISOString() });
      // Refresh the saved tournaments list
      fetchSavedTournaments();
    } else {
      throw new Error('Failed to save tournament');
    }
  }, [tournament, updateTournament, fetchSavedTournaments]);

  // Fetch saved tournaments on history view
  useEffect(() => {
    if (view === 'history') {
      fetchSavedTournaments();
    }
  }, [view, fetchSavedTournaments]);

  // Format placing with ordinal suffix
  const formatPlacing = (placing: number): string => {
    if (placing === 1) return '1st';
    if (placing === 2) return '2nd';
    if (placing === 3) return '3rd';
    return `${placing}th`;
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
              <button
                onClick={() => setView(view === 'history' ? 'tracker' : 'history')}
                className={`p-1.5 rounded-lg transition-colors ${
                  view === 'history'
                    ? 'text-rose-400 bg-rose-400/10'
                    : 'text-foreground-muted hover:text-foreground hover:bg-background-tertiary'
                }`}
                title="Tournament History"
              >
                <History className="w-4 h-4" />
              </button>
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
              <TournamentResults
                onBack={() => setView('tracker')}
                onSave={handleSaveTournament}
              />
            )}

            {view === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setView(tournament ? 'tracker' : 'setup')}
                    className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="text-lg font-semibold text-foreground">Saved Tournaments</h2>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-8 text-foreground-muted text-sm">
                    Loading...
                  </div>
                ) : savedTournaments.length === 0 ? (
                  <div className="bg-background-secondary rounded-xl border border-border p-8 text-center">
                    <History className="w-8 h-8 text-foreground-muted mx-auto mb-3" />
                    <p className="text-foreground-muted text-sm">No saved tournaments yet</p>
                    <p className="text-foreground-muted/60 text-xs mt-1">
                      Save your tournament results to see them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedTournaments.map((t) => {
                      const wins = t.rounds.filter((r) => r.result === '2-0' || r.result === '2-1').length;
                      const losses = t.rounds.filter((r) => r.result === '1-2' || r.result === '0-2').length;
                      const draws = t.rounds.filter((r) => r.result === 'draw').length;
                      const record = draws > 0 ? `${wins}-${losses}-${draws}` : `${wins}-${losses}`;
                      return (
                        <div
                          key={t.id}
                          className="bg-background-secondary rounded-xl border border-border p-4 hover:border-border-hover transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{t.title}</h3>
                              <p className="text-xs text-foreground-muted">
                                {new Date(t.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                                {t.playerCount && ` · ${t.playerCount} players`}
                                {t.placing && ` · ${formatPlacing(t.placing)}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">{record}</p>
                              <p className="text-xs text-foreground-muted">{t.rounds.length} rounds</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
