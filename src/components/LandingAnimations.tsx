'use client';

import { useEffect, useState } from 'react';

export function LandingAnimations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Aurora Effect */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70vh',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.5,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: `conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              rgba(244, 63, 94, 0.2) 60deg,
              transparent 120deg,
              rgba(6, 182, 212, 0.2) 180deg,
              transparent 240deg,
              rgba(217, 70, 239, 0.2) 300deg,
              transparent 360deg
            )`,
            animation: 'aurora-spin 25s linear infinite',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '-150px',
            left: '-100px',
            animation: 'orb1 20s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '40%',
            right: '-100px',
            animation: 'orb2 25s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            bottom: '-100px',
            left: '30%',
            animation: 'orb3 22s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating Particles */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              background: i % 3 === 0 ? 'rgba(244, 63, 94, 0.8)' : i % 3 === 1 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              left: `${5 + i * 8}%`,
              bottom: '-20px',
              animation: `particle-rise ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Glow Lines */}
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.6), rgba(217, 70, 239, 0.6), rgba(6, 182, 212, 0.6), transparent)',
          animation: 'glow-sweep 8s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '35%',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), rgba(217, 70, 239, 0.5), rgba(244, 63, 94, 0.5), transparent)',
          animation: 'glow-sweep-reverse 10s ease-in-out infinite',
          animationDelay: '4s',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
      />

      <style jsx global>{`
        @keyframes aurora-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 40px) scale(1.1); }
          50% { transform: translate(40px, 80px) scale(0.95); }
          75% { transform: translate(-20px, 40px) scale(1.05); }
        }

        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, -40px) scale(1.05); }
          50% { transform: translate(-100px, 30px) scale(1.1); }
          75% { transform: translate(-30px, 60px) scale(0.95); }
        }

        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -60px) scale(1.08); }
          66% { transform: translate(-30px, -30px) scale(0.92); }
        }

        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-10vh) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes glow-sweep {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 0.7; }
          50% { transform: translateX(100%); opacity: 0.7; }
          60%, 100% { opacity: 0; }
        }

        @keyframes glow-sweep-reverse {
          0%, 100% { transform: translateX(100%); opacity: 0; }
          10% { opacity: 0.5; }
          50% { transform: translateX(-100%); opacity: 0.5; }
          60%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

// Loading Screen Component
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Ease out effect - slower as it approaches 100
        const increment = Math.max(1, (100 - prev) / 10);
        return Math.min(100, prev + increment);
      });
    }, 50);

    // Complete phase after progress done
    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, 1800);

    // Exit phase
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 2400);

    // Call onComplete
    const finalTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
      clearTimeout(exitTimer);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0e',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.1)' : 'scale(1)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse-glow 2s ease-in-out infinite 0.5s',
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: 'relative',
          marginBottom: '48px',
          opacity: phase === 'complete' ? 1 : 0.9,
          transform: phase === 'complete' ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.5s ease-out',
        }}
      >
        {/* Logo Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            animation: 'spin-slow 8s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-35px',
            borderRadius: '50%',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            animation: 'spin-slow 12s linear infinite reverse',
          }}
        />

        {/* Logo Text */}
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            animation: 'text-glow 2s ease-in-out infinite',
          }}
        >
          <span style={{ color: '#f43f5e' }}>Rift</span>
          <span style={{ color: '#ffffff', fontWeight: 500 }}>Record</span>
        </div>
      </div>

      {/* Progress Container */}
      <div
        style={{
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f43f5e, #d946ef, #06b6d4)',
              borderRadius: '1px',
              transition: 'width 0.1s ease-out',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)',
            }}
          />
        </div>

        {/* Loading Text */}
        <div
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {phase === 'complete' ? 'Welcome' : 'Loading'}
        </div>
      </div>

      {/* Animated Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: i % 2 === 0 ? 'rgba(244, 63, 94, 0.6)' : 'rgba(6, 182, 212, 0.6)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(244, 63, 94, 0.3), 0 0 40px rgba(244, 63, 94, 0.1);
          }
          50% {
            text-shadow: 0 0 30px rgba(244, 63, 94, 0.5), 0 0 60px rgba(244, 63, 94, 0.2);
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px, ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px) scale(1.5);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

interface AnimatedContentProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedContent({ children, delay = 0, className = '' }: AnimatedContentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// Main wrapper that handles loading -> content transition
export function LandingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay before showing content animations
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        {children}
      </div>
    </>
  );
}
