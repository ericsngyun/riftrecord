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
        {/* Orb 1 - Rose */}
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
        {/* Orb 2 - Cyan */}
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
        {/* Orb 3 - Fuchsia */}
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

      {/* Keyframes */}
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </>
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
