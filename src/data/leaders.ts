import { Leader } from '@/types';

// Riftbound Leaders with their color identities
// Colors are designed to create appealing gradients
export const LEADERS: Leader[] = [
  {
    id: 'ahri',
    name: 'Ahri',
    title: 'The Nine-Tailed Fox',
    colors: ['#9333ea', '#3b82f6'], // Purple to Blue
    imageUrl: '/leaders/ahri.png',
  },
  {
    id: 'yasuo',
    name: 'Yasuo',
    title: 'The Unforgiven',
    colors: ['#3b82f6', '#f8fafc'], // Blue to White
    imageUrl: '/leaders/yasuo.png',
  },
  {
    id: 'jinx',
    name: 'Jinx',
    title: 'The Loose Cannon',
    colors: ['#ec4899', '#06b6d4'], // Pink to Cyan
    imageUrl: '/leaders/jinx.png',
  },
  {
    id: 'darius',
    name: 'Darius',
    title: 'The Hand of Noxus',
    colors: ['#dc2626', '#1f2937'], // Red to Dark Gray
    imageUrl: '/leaders/darius.png',
  },
  {
    id: 'lux',
    name: 'Lux',
    title: 'The Lady of Luminosity',
    colors: ['#fbbf24', '#f8fafc'], // Gold to White
    imageUrl: '/leaders/lux.png',
  },
  {
    id: 'thresh',
    name: 'Thresh',
    title: 'The Chain Warden',
    colors: ['#22c55e', '#064e3b'], // Green to Dark Green
    imageUrl: '/leaders/thresh.png',
  },
  {
    id: 'ekko',
    name: 'Ekko',
    title: 'The Boy Who Shattered Time',
    colors: ['#06b6d4', '#fbbf24'], // Cyan to Gold
    imageUrl: '/leaders/ekko.png',
  },
  {
    id: 'vi',
    name: 'Vi',
    title: 'The Piltover Enforcer',
    colors: ['#ec4899', '#7c3aed'], // Pink to Violet
    imageUrl: '/leaders/vi.png',
  },
  {
    id: 'garen',
    name: 'Garen',
    title: 'The Might of Demacia',
    colors: ['#3b82f6', '#fbbf24'], // Blue to Gold
    imageUrl: '/leaders/garen.png',
  },
  {
    id: 'katarina',
    name: 'Katarina',
    title: 'The Sinister Blade',
    colors: ['#dc2626', '#be123c'], // Red to Rose
    imageUrl: '/leaders/katarina.png',
  },
  {
    id: 'zed',
    name: 'Zed',
    title: 'The Master of Shadows',
    colors: ['#dc2626', '#18181b'], // Red to Black
    imageUrl: '/leaders/zed.png',
  },
  {
    id: 'shen',
    name: 'Shen',
    title: 'The Eye of Twilight',
    colors: ['#3b82f6', '#7c3aed'], // Blue to Violet
    imageUrl: '/leaders/shen.png',
  },
  {
    id: 'ashe',
    name: 'Ashe',
    title: 'The Frost Archer',
    colors: ['#06b6d4', '#f8fafc'], // Cyan to White
    imageUrl: '/leaders/ashe.png',
  },
  {
    id: 'braum',
    name: 'Braum',
    title: 'The Heart of the Freljord',
    colors: ['#06b6d4', '#fbbf24'], // Cyan to Gold
    imageUrl: '/leaders/braum.png',
  },
  {
    id: 'miss-fortune',
    name: 'Miss Fortune',
    title: 'The Bounty Hunter',
    colors: ['#dc2626', '#fbbf24'], // Red to Gold
    imageUrl: '/leaders/miss-fortune.png',
  },
  {
    id: 'twisted-fate',
    name: 'Twisted Fate',
    title: 'The Card Master',
    colors: ['#7c3aed', '#fbbf24'], // Violet to Gold
    imageUrl: '/leaders/twisted-fate.png',
  },
  {
    id: 'elise',
    name: 'Elise',
    title: 'The Spider Queen',
    colors: ['#dc2626', '#9333ea'], // Red to Purple
    imageUrl: '/leaders/elise.png',
  },
  {
    id: 'hecarim',
    name: 'Hecarim',
    title: 'The Shadow of War',
    colors: ['#22c55e', '#1f2937'], // Green to Dark
    imageUrl: '/leaders/hecarim.png',
  },
  {
    id: 'karma',
    name: 'Karma',
    title: 'The Enlightened One',
    colors: ['#22c55e', '#f8fafc'], // Green to White
    imageUrl: '/leaders/karma.png',
  },
  {
    id: 'lee-sin',
    name: 'Lee Sin',
    title: 'The Blind Monk',
    colors: ['#dc2626', '#fbbf24'], // Red to Gold
    imageUrl: '/leaders/lee-sin.png',
  },
];

// Helper to get a leader by ID
export function getLeaderById(id: string): Leader | undefined {
  return LEADERS.find((leader) => leader.id === id);
}

// Helper to get leader colors for gradient generation
export function getLeaderColors(id: string): [string, string] {
  const leader = getLeaderById(id);
  return leader?.colors ?? ['#6b7280', '#9ca3af']; // Default gray gradient
}
