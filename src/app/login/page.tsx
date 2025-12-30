import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Swords, ArrowLeft } from 'lucide-react';

export default async function LoginPage() {
  const session = await auth();

  // If already logged in, redirect to dashboard
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
          background: 'linear-gradient(180deg, rgba(15, 15, 19, 0.85) 0%, rgba(15, 15, 19, 0.95) 100%)',
        }}
      >
        {/* Back to Home */}
        <header className="px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </header>

        {/* Login Card */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="card-glass p-8 animate-fadeIn">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Swords className="w-10 h-10 text-accent-primary" />
                <span className="text-2xl font-bold text-foreground">RiftRecord</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-foreground-muted text-center mb-8">
                Sign in to track your tournament matches
              </p>

              {/* Google Sign In */}
              <form
                action={async () => {
                  'use server';
                  await signIn('google', { redirectTo: '/dashboard' });
                }}
              >
                <button type="submit" className="btn btn-google w-full py-3 text-base">
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-foreground-muted text-sm">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Info */}
              <p className="text-foreground-muted text-sm text-center">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
