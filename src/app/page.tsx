import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LandingAnimations, AnimatedContent } from '@/components/LandingAnimations';
import { VideoBackground } from '@/components/VideoBackground';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background with image fallback */}
      <VideoBackground className="z-0" />

      {/* Animated Background Elements */}
      <LandingAnimations />

      {/* Content Overlay */}
      <div
        className="min-h-screen flex flex-col relative z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 10, 20, 0.5) 0%, rgba(20, 15, 25, 0.35) 50%, rgba(15, 20, 25, 0.5) 100%)',
        }}
      >
        {/* Header */}
        <header className="px-8 py-6">
          <AnimatedContent delay={100}>
            <nav className="max-w-6xl mx-auto flex items-center justify-between">
              <span
                className="text-3xl tracking-wide uppercase"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.05em' }}
              >
                <span className="text-rose-400">Rift</span>
                <span className="text-white">Record</span>
              </span>
              <Link
                href="/login"
                className="px-5 py-2 text-sm tracking-wide border border-rose-400/40 text-rose-300 hover:bg-rose-400/20 hover:border-rose-400/60 transition-all duration-300 rounded"
                style={{ fontWeight: 400 }}
              >
                Sign In
              </Link>
            </nav>
          </AnimatedContent>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Main Headline */}
            <AnimatedContent delay={200}>
              <p className="text-sm text-white/40 tracking-widest uppercase mb-6">
                Tournament Tracker
              </p>
            </AnimatedContent>

            <AnimatedContent delay={350}>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.95] tracking-tight"
                style={{ fontWeight: 500 }}
              >
                <span className="text-white">Record.</span>
                <br />
                <span className="text-white/90">Analyze.</span>
                <br />
                <span className="text-white/80">Share.</span>
              </h1>
            </AnimatedContent>

            {/* Description */}
            <AnimatedContent delay={500}>
              <p className="text-lg text-white/50 mb-12 max-w-md mx-auto leading-relaxed">
                A simple tool to track your Riftbound tournament matches and performance.
              </p>
            </AnimatedContent>

            {/* CTA */}
            <AnimatedContent delay={650}>
              <Link
                href="/login"
                className="inline-block px-8 py-3.5 bg-white text-black text-sm tracking-wide rounded-full hover:bg-white/90 transition-colors duration-200"
                style={{ fontWeight: 500 }}
              >
                Get Started
              </Link>
            </AnimatedContent>

            {/* Features */}
            <AnimatedContent delay={850}>
              <div className="mt-24 pt-12 border-t border-white/10">
                <div className="grid md:grid-cols-3 gap-12 text-left">
                  <div>
                    <h3 className="text-white text-sm mb-3 tracking-wide" style={{ fontWeight: 500 }}>
                      Record
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Log matches round by round, from Swiss to Top Cut.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white text-sm mb-3 tracking-wide" style={{ fontWeight: 500 }}>
                      Analyze
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      View win rates, matchup statistics, and trends.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white text-sm mb-3 tracking-wide" style={{ fontWeight: 500 }}>
                      Share
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Export tournament results as images for social media.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8">
          <AnimatedContent delay={1000}>
            <div className="text-center space-y-2">
              <p
                className="text-white/30 text-xs tracking-wide"
                style={{ fontWeight: 300 }}
              >
                Built for the Riftbound community
              </p>
              <p
                className="text-white/20 text-[10px] leading-relaxed max-w-md mx-auto"
                style={{ fontWeight: 300 }}
              >
                RiftRecord is not affiliated with, endorsed, or sponsored by Riot Games, Inc.
                Riftbound and all related assets are trademarks of Riot Games, Inc.
              </p>
            </div>
          </AnimatedContent>
        </footer>
      </div>
    </div>
  );
}
