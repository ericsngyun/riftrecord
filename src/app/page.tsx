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
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Animated Background Elements */}
      <div className="aurora" />

      <div className="orbs-container">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* Glow Lines */}
      <div className="glow-line glow-line-top" />
      <div className="glow-line glow-line-bottom" />

      {/* Content Overlay */}
      <div
        className="min-h-screen flex flex-col relative z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 10, 20, 0.7) 0%, rgba(20, 15, 25, 0.55) 50%, rgba(15, 20, 25, 0.7) 100%)',
        }}
      >
        {/* Header */}
        <header className="px-8 py-6">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <span
              className="text-2xl tracking-tight fade-in-up"
              style={{ fontWeight: 300 }}
            >
              <span className="text-rose-400">Rift</span>
              <span className="text-white" style={{ fontWeight: 500 }}>Record</span>
            </span>
            <Link
              href="/login"
              className="px-5 py-2 text-sm tracking-wide border border-rose-400/40 text-rose-300 hover:bg-rose-400/20 hover:border-rose-400/60 transition-all duration-300 rounded fade-in-up"
              style={{ fontWeight: 400 }}
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
              className="text-xs tracking-[0.3em] uppercase text-cyan-400/80 mb-6 fade-in-up fade-in-up-delay-1"
              style={{ fontWeight: 500 }}
            >
              Tournament Tracking for Riftbound
            </p>

            {/* Main Headline */}
            <h1
              className="text-5xl md:text-7xl mb-6 leading-tight fade-in-up fade-in-up-delay-2"
              style={{ fontWeight: 200, letterSpacing: '-0.02em' }}
            >
              <span className="text-white">Track every</span>
              <br />
              <span
                className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
                style={{ fontWeight: 300 }}
              >
                victory.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed fade-in-up fade-in-up-delay-3"
              style={{ fontWeight: 300 }}
            >
              Track every round from Swiss to Top Cut.
              <br className="hidden md:block" />
              Analyze your performance. Share your results.
            </p>

            {/* CTA */}
            <div className="fade-in-up fade-in-up-delay-4">
              <Link
                href="/login"
                className="btn-cta inline-block px-10 py-4 text-sm tracking-wide rounded-lg text-white transition-all duration-300"
                style={{ fontWeight: 500 }}
              >
                Get Started
              </Link>
            </div>

            {/* Features */}
            <div className="mt-20 grid md:grid-cols-3 gap-8 fade-in-up fade-in-up-delay-5">
              <div
                className="p-6 rounded-xl border border-white/10 hover:border-rose-400/30 transition-all duration-500 hover:transform hover:-translate-y-1"
                style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(4px)' }}
              >
                <p
                  className="text-rose-400 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 500 }}
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
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  Log matches with detailed results and opponent tracking
                </p>
              </div>

              <div
                className="p-6 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:transform hover:-translate-y-1"
                style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(4px)' }}
              >
                <p
                  className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 500 }}
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
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  View win rates, matchup statistics, and performance trends
                </p>
              </div>

              <div
                className="p-6 rounded-xl border border-white/10 hover:border-fuchsia-400/30 transition-all duration-500 hover:transform hover:-translate-y-1"
                style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(4px)' }}
              >
                <p
                  className="text-fuchsia-400 text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ fontWeight: 500 }}
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
                  className="text-white/50 text-sm leading-relaxed"
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
            className="text-center text-white/30 text-xs tracking-wide"
            style={{ fontWeight: 300 }}
          >
            Built for the Riftbound community
          </p>
        </footer>
      </div>
    </div>
  );
}
