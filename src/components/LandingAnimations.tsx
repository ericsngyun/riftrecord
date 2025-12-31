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
      {/* Floating Orbs - Bigger, brighter, less blur */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Rose Orb - Top Left */}
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.6) 0%, rgba(244, 63, 94, 0.3) 40%, transparent 70%)',
            filter: 'blur(40px)',
            top: '-200px',
            left: '-150px',
            animation: 'orb1 15s ease-in-out infinite',
          }}
        />
        {/* Cyan Orb - Right */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(6, 182, 212, 0.25) 40%, transparent 70%)',
            filter: 'blur(40px)',
            top: '30%',
            right: '-150px',
            animation: 'orb2 18s ease-in-out infinite',
          }}
        />
        {/* Fuchsia Orb - Bottom */}
        <div
          style={{
            position: 'absolute',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.5) 0%, rgba(217, 70, 239, 0.2) 40%, transparent 70%)',
            filter: 'blur(40px)',
            bottom: '-150px',
            left: '25%',
            animation: 'orb3 16s ease-in-out infinite',
          }}
        />
        {/* Extra Rose Orb - Center Right */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, transparent 60%)',
            filter: 'blur(30px)',
            top: '60%',
            right: '20%',
            animation: 'orb4 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating Particles - Bigger, more visible, with glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {[...Array(20)].map((_, i) => {
          const size = 4 + (i % 4) * 2;
          const colors = [
            'rgba(244, 63, 94, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(217, 70, 239, 1)',
            'rgba(255, 255, 255, 0.9)',
          ];
          const color = colors[i % 4];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                left: `${3 + i * 4.8}%`,
                bottom: '-20px',
                boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
                animation: `particle-rise ${12 + (i % 5) * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          );
        })}
      </div>

      {/* Extra ambient glow spots */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, transparent 60%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '20%',
          right: '15%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 60%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulse-glow 5s ease-in-out infinite 1s',
        }}
      />

      <style jsx global>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(120px, 60px) scale(1.15); }
          50% { transform: translate(60px, 120px) scale(0.9); }
          75% { transform: translate(-40px, 60px) scale(1.1); }
        }

        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-100px, -60px) scale(1.1); }
          50% { transform: translate(-150px, 50px) scale(1.15); }
          75% { transform: translate(-50px, 100px) scale(0.9); }
        }

        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -100px) scale(1.12); }
          66% { transform: translate(-50px, -50px) scale(0.88); }
        }

        @keyframes orb4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-100px, -80px) scale(1.2); }
        }

        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateY(-5vh) scale(1);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}

// Loading screen components (kept for potential future use)
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return null;
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

export function LandingWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
