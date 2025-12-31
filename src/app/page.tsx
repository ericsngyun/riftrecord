import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 10, 14, 0.92) 0%, rgba(10, 10, 14, 0.98) 100%)',
        }}
      >
        {/* Header */}
        <header className="px-8 py-6">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <span
              className="text-2xl tracking-tight text-white"
              style={{ fontWeight: 300 }}
            >
              Rift<span style={{ fontWeight: 500 }}>Record</span>
            </span>
            <Link
              href="/login"
              className="text-sm tracking-wide text-white/70 hover:text-white transition-colors duration-300"
              style={{ fontWeight: 300 }}
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline */}
            <p
              className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8"
              style={{ fontWeight: 400 }}
            >
              Tournament Tracking for Riftbound
            </p>

            {/* Main Headline */}
            <h1
              className="text-5xl md:text-7xl text-white mb-8 leading-tight"
              style={{ fontWeight: 200, letterSpacing: '-0.02em' }}
            >
              Your matches.
              <br />
              <span className="text-white/60">Your story.</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-white/50 mb-12 max-w-xl mx-auto leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              Track every round from Swiss to Top Cut.
              Analyze your performance. Share your results.
            </p>

            {/* CTA */}
            <Link
              href="/login"
              className="inline-block px-10 py-4 text-sm tracking-wide border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontWeight: 400 }}
            >
              Get Started
            </Link>

            {/* Features - Minimal text only */}
            <div className="mt-24 grid md:grid-cols-3 gap-12 md:gap-8">
              <div className="group">
                <p
                  className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 400 }}
                >
                  01
                </p>
                <h3
                  className="text-white text-lg mb-2"
                  style={{ fontWeight: 400 }}
                >
                  Record
                </h3>
                <p
                  className="text-white/40 text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  Log matches with detailed results and opponent tracking
                </p>
              </div>

              <div className="group">
                <p
                  className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 400 }}
                >
                  02
                </p>
                <h3
                  className="text-white text-lg mb-2"
                  style={{ fontWeight: 400 }}
                >
                  Analyze
                </h3>
                <p
                  className="text-white/40 text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  View win rates, matchup statistics, and performance trends
                </p>
              </div>

              <div className="group">
                <p
                  className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 400 }}
                >
                  03
                </p>
                <h3
                  className="text-white text-lg mb-2"
                  style={{ fontWeight: 400 }}
                >
                  Share
                </h3>
                <p
                  className="text-white/40 text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  Export tournament summaries as images for social media
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8">
          <p
            className="text-center text-white/20 text-xs tracking-wide"
            style={{ fontWeight: 300 }}
          >
            Built for the Riftbound community
          </p>
        </footer>
      </div>
    </div>
  );
}
