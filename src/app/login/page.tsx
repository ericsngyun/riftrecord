import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
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
          background: 'linear-gradient(135deg, rgba(15, 10, 20, 0.75) 0%, rgba(20, 15, 25, 0.65) 50%, rgba(15, 20, 25, 0.75) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Header */}
        <header className="px-8 py-6">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-sm tracking-wide text-white/40 hover:text-white transition-colors duration-300"
              style={{ fontWeight: 300 }}
            >
              &larr; Back
            </Link>
            <span
              className="text-2xl tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.05em' }}
            >
              <span className="text-rose-400">Rift</span>
              <span className="text-white">Record</span>
            </span>
            <div className="w-12" />
          </nav>
        </header>

        {/* Login Form */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md text-center">
            {/* Headline */}
            <p
              className="text-xs tracking-[0.3em] uppercase text-cyan-400/80 mb-4"
              style={{ fontWeight: 500 }}
            >
              Welcome
            </p>
            <h1
              className="text-4xl md:text-5xl mb-4"
              style={{ fontWeight: 200, letterSpacing: '-0.02em' }}
            >
              <span className="text-white">Sign in to</span>
              <br />
              <span
                className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
                style={{ fontWeight: 300 }}
              >
                continue
              </span>
            </h1>
            <p
              className="text-white/40 text-sm mb-12"
              style={{ fontWeight: 300 }}
            >
              Track your tournament performance
            </p>

            {/* Login Card */}
            <div
              className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-500"
              style={{ background: 'rgba(15, 10, 20, 0.5)', backdropFilter: 'blur(16px)' }}
            >
              {/* Google Sign In */}
              <form
                action={async () => {
                  'use server';
                  await signIn('google', { redirectTo: '/dashboard' });
                }}
              >
                <button
                  type="submit"
                  className="btn-oauth group w-full flex items-center justify-center gap-3 px-6 py-4 text-sm tracking-wide rounded-xl transition-all duration-300"
                  style={{ fontWeight: 500 }}
                >
                  <span className="relative flex items-center justify-center w-6 h-6">
                    <span className="absolute inset-0 bg-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
                    <GoogleIcon />
                  </span>
                  <span>Continue with Google</span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                <span className="text-white/20 text-xs" style={{ fontWeight: 300 }}>secure login</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
              </div>

              {/* Info */}
              <p
                className="text-white/30 text-xs leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                We only access your basic profile information.
                <br />
                Your data stays private.
              </p>
            </div>

            {/* Terms */}
            <p
              className="text-white/20 text-xs mt-8"
              style={{ fontWeight: 300 }}
            >
              By signing in, you agree to our terms of service.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6">
          <p
            className="text-center text-white/20 text-[10px] leading-relaxed max-w-md mx-auto"
            style={{ fontWeight: 300 }}
          >
            RiftRecord is not affiliated with, endorsed, or sponsored by Riot Games, Inc.
            Riftbound and all related assets are trademarks of Riot Games, Inc.
          </p>
        </footer>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
