'use client';

import { useEffect, useState } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export function VideoBackground({ className = '' }: VideoBackgroundProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setVideoError(false);
  }, [isMobile]);

  const posterSrc = '/background.jpg';
  const videoSrc = isMobile ? '/bg-mobile.mp4' : '/bg.mp4';

  // Show poster image while detecting device or on error
  if (isMobile === null || videoError) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `url('${posterSrc}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        key={isMobile ? 'mobile' : 'desktop'}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        onError={() => setVideoError(true)}
        className="absolute min-w-full min-h-full object-cover"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
