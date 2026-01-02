'use client';

import { useEffect, useState } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export function VideoBackground({ className = '' }: VideoBackgroundProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use mobile-bg.jpg for mobile, background.jpg for desktop
  const backgroundImage = isMobile === null
    ? '/background.jpg'
    : isMobile
      ? '/mobile-bg.jpg'
      : '/background.jpg';

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.3s ease-in-out',
      }}
    />
  );
}
