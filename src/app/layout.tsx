import type { Metadata } from 'next';
import { Geist, Geist_Mono, Rajdhani } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const rajdhani = Rajdhani({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'RiftRecord - Tournament Match Tracker',
  description: 'Track your Riftbound TCG tournament matches and share results on Twitter',
  keywords: ['Riftbound', 'TCG', 'tournament', 'match tracker', 'card game'],
  authors: [{ name: 'RiftRecord' }],
  openGraph: {
    title: 'RiftRecord - Tournament Match Tracker',
    description: 'Track your Riftbound TCG tournament matches and share results on Twitter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RiftRecord - Tournament Match Tracker',
    description: 'Track your Riftbound TCG tournament matches and share results on Twitter',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
