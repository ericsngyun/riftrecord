import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Swords, Trophy, Share2, BarChart3 } from 'lucide-react';

export default async function HomePage() {
  const session = await auth();

  // If logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-app min-h-screen">
      <div className="bg-app-overlay min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-8 h-8 text-accent-primary" />
              <span className="text-xl font-bold text-foreground">RiftRecord</span>
            </div>
            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fadeIn">
              Track Your Tournament Journey
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto animate-fadeIn">
              Record your Riftbound TCG tournament matches, track your performance from Swiss rounds through Top Cut, and share your results with the community.
            </p>

            {/* CTA Button */}
            <Link
              href="/login"
              className="btn btn-primary text-lg py-4 px-8 animate-pulse-glow"
            >
              Get Started
            </Link>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="card-glass p-6 animate-fadeIn">
                <Trophy className="w-10 h-10 text-accent-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Track Every Match
                </h3>
                <p className="text-foreground-muted text-sm">
                  Log Swiss rounds and Top Cut games with opponent details and results
                </p>
              </div>

              <div className="card-glass p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <BarChart3 className="w-10 h-10 text-accent-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Analyze Performance
                </h3>
                <p className="text-foreground-muted text-sm">
                  View your win rates, matchup stats, and tournament history
                </p>
              </div>

              <div className="card-glass p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <Share2 className="w-10 h-10 text-accent-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Share Results
                </h3>
                <p className="text-foreground-muted text-sm">
                  Generate beautiful tournament summary images for Twitter/X
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8 text-center">
          <p className="text-foreground-muted text-sm">
            Built for the Riftbound community
          </p>
        </footer>
      </div>
    </div>
  );
}
