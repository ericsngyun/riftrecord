'use client';

import { SessionProvider } from 'next-auth/react';
import { TournamentProvider } from '@/context/TournamentContext';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TournamentProvider>{children}</TournamentProvider>
    </SessionProvider>
  );
}
