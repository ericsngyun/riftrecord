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

// Loading Screen Component - Dimensional Portal Effect
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'warp' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(100, prev + increment);
      });
    }, 40);

    // Warp phase - speed lines intensify
    const warpTimer = setTimeout(() => {
      setPhase('warp');
    }, 2000);

    // Exit phase - zoom through portal
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 2600);

    // Complete
    const finalTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(warpTimer);
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
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      {/* Warp Speed Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {[...Array(60)].map((_, i) => {
          const angle = (i / 60) * 360;
          const distance = 50 + Math.random() * 50;
          const isAccent = i % 5 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: phase === 'warp' ? '300px' : '150px',
                height: isAccent ? '3px' : '2px',
                background: `linear-gradient(90deg, transparent, ${
                  i % 3 === 0 ? 'rgba(244, 63, 94, 0.8)' :
                  i % 3 === 1 ? 'rgba(6, 182, 212, 0.8)' :
                  'rgba(217, 70, 239, 0.8)'
                }, transparent)`,
                transform: `rotate(${angle}deg) translateX(${distance}px)`,
                transformOrigin: '0 50%',
                opacity: phase === 'enter' ? 0.3 : phase === 'warp' ? 0.9 : 0,
                transition: 'all 0.5s ease-out',
                animation: `warp-line ${1 + Math.random() * 0.5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          );
        })}
      </div>

      {/* Portal Rings */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
            borderRadius: '50%',
            border: `1px solid rgba(${i % 2 === 0 ? '244, 63, 94' : '6, 182, 212'}, ${0.4 - i * 0.06})`,
            animation: `portal-ring ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
            transform: phase === 'exit' ? `scale(${3 + i})` : 'scale(1)',
            opacity: phase === 'exit' ? 0 : 1,
            transition: 'transform 0.6s ease-in, opacity 0.4s ease-out',
          }}
        />
      ))}

      {/* Center Glass Card */}
      <div
        style={{
          position: 'relative',
          padding: '48px 64px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 0 60px rgba(244, 63, 94, 0.15),
            0 0 120px rgba(6, 182, 212, 0.1),
            inset 0 0 60px rgba(255, 255, 255, 0.02)
          `,
          transform: phase === 'exit' ? 'scale(2) translateZ(500px)' : 'scale(1) translateZ(0)',
          opacity: phase === 'exit' ? 0 : 1,
          transition: 'transform 0.6s ease-in, opacity 0.3s ease-out',
        }}
      >
        {/* Inner Glow */}
        <div
          style={{
            position: 'absolute',
            inset: '-1px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), transparent, rgba(6, 182, 212, 0.2))',
            opacity: 0.5,
            animation: 'inner-glow 2s ease-in-out infinite',
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: 'relative',
            fontSize: '3.5rem',
            fontWeight: 200,
            letterSpacing: '-0.02em',
            textShadow: '0 0 40px rgba(244, 63, 94, 0.5)',
          }}
        >
          <span style={{ color: '#f43f5e', fontWeight: 300 }}>Rift</span>
          <span style={{ color: '#ffffff', fontWeight: 500 }}>Record</span>
        </div>

        {/* Progress Ring */}
        <svg
          style={{
            position: 'absolute',
            inset: '-20px',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
          }}
        >
          <rect
            x="10"
            y="10"
            width="calc(100% - 20px)"
            height="calc(100% - 20px)"
            rx="30"
            ry="30"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
          <rect
            x="10"
            y="10"
            width="calc(100% - 20px)"
            height="calc(100% - 20px)"
            rx="30"
            ry="30"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset={1000 - (progress * 10)}
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 ? '#f43f5e' : i % 3 === 1 ? '#06b6d4' : '#d946ef',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
              animation: `float-to-center ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes warp-line {
          0%, 100% {
            transform: rotate(var(--angle)) translateX(var(--distance)) scaleX(1);
          }
          50% {
            transform: rotate(var(--angle)) translateX(calc(var(--distance) + 20px)) scaleX(1.5);
          }
        }

        @keyframes portal-ring {
          0%, 100% {
            transform: scale(1) rotateX(75deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05) rotateX(75deg);
            opacity: 1;
          }
        }

        @keyframes inner-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes float-to-center {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(
              calc((50vw - 50%) * 0.1),
              calc((50vh - 50%) * 0.1)
            ) scale(1.2);
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
