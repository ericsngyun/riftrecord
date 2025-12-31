// Riftbound TCG Leaders/Champions with their Domain color pairs
// Domain Colors:
// r = Fury (Red)
// g = Calm (Green)
// b = Mind (Blue)
// o = Body (Orange)
// y = Order (Yellow)
// p = Chaos (Purple)

export type DomainCode = 'r' | 'g' | 'b' | 'o' | 'y' | 'p';

export interface Domain {
  code: DomainCode;
  name: string;
  color: string;
}

export interface Leader {
  id: string;
  name: string;
  displayName: string;
  domains: [DomainCode, DomainCode];
  imageUrl: string;
}

// Domain definitions with hex colors
export const DOMAINS: Record<DomainCode, Domain> = {
  r: { code: 'r', name: 'Fury', color: '#dc2626' },
  g: { code: 'g', name: 'Calm', color: '#22c55e' },
  b: { code: 'b', name: 'Mind', color: '#3b82f6' },
  o: { code: 'o', name: 'Body', color: '#f97316' },
  y: { code: 'y', name: 'Order', color: '#eab308' },
  p: { code: 'p', name: 'Chaos', color: '#a855f7' },
};

// All Leaders from Origins and Spiritforged sets
export const LEADERS: Leader[] = [
  // Origins Set
  {
    id: 'ahri',
    name: 'ahri',
    displayName: 'Ahri',
    domains: ['g', 'b'],
    imageUrl: '/leaders/ahri-gb.png',
  },
  {
    id: 'darius',
    name: 'darius',
    displayName: 'Darius',
    domains: ['r', 'y'],
    imageUrl: '/leaders/darius-ry.png',
  },
  {
    id: 'jinx',
    name: 'jinx',
    displayName: 'Jinx',
    domains: ['r', 'p'],
    imageUrl: '/leaders/jinx-rp.png',
  },
  {
    id: 'kaisa',
    name: 'kaisa',
    displayName: "Kai'Sa",
    domains: ['r', 'b'],
    imageUrl: '/leaders/kaisa-rb.png',
  },
  {
    id: 'leesin',
    name: 'leesin',
    displayName: 'Lee Sin',
    domains: ['g', 'o'],
    imageUrl: '/leaders/leesin-go.png',
  },
  {
    id: 'leona',
    name: 'leona',
    displayName: 'Leona',
    domains: ['g', 'y'],
    imageUrl: '/leaders/leona-gy.png',
  },
  {
    id: 'missfortune',
    name: 'missfortune',
    displayName: 'Miss Fortune',
    domains: ['o', 'p'],
    imageUrl: '/leaders/missfortune-op.png',
  },
  {
    id: 'sett',
    name: 'sett',
    displayName: 'Sett',
    domains: ['o', 'y'],
    imageUrl: '/leaders/sett-oy.png',
  },
  {
    id: 'teemo',
    name: 'teemo',
    displayName: 'Teemo',
    domains: ['b', 'p'],
    imageUrl: '/leaders/teemo-bp.png',
  },
  {
    id: 'viktor',
    name: 'viktor',
    displayName: 'Viktor',
    domains: ['b', 'y'],
    imageUrl: '/leaders/viktor-by.png',
  },
  {
    id: 'volibear',
    name: 'volibear',
    displayName: 'Volibear',
    domains: ['r', 'o'],
    imageUrl: '/leaders/volibear-ro.png',
  },
  {
    id: 'yasuo',
    name: 'yasuo',
    displayName: 'Yasuo',
    domains: ['g', 'p'],
    imageUrl: '/leaders/yasuo-gp.png',
  },
  // Spiritforged Set
  {
    id: 'azir',
    name: 'azir',
    displayName: 'Azir',
    domains: ['g', 'y'],
    imageUrl: '/leaders/azir-gy.png',
  },
  {
    id: 'draven',
    name: 'draven',
    displayName: 'Draven',
    domains: ['r', 'p'],
    imageUrl: '/leaders/draven-rp.png',
  },
  {
    id: 'ezreal',
    name: 'ezreal',
    displayName: 'Ezreal',
    domains: ['b', 'p'],
    imageUrl: '/leaders/ezreal-bp.png',
  },
  {
    id: 'fiora',
    name: 'fiora',
    displayName: 'Fiora',
    domains: ['o', 'y'],
    imageUrl: '/leaders/fiora-oy.png',
  },
  {
    id: 'irelia',
    name: 'irelia',
    displayName: 'Irelia',
    domains: ['g', 'p'],
    imageUrl: '/leaders/irelia-gp.png',
  },
  {
    id: 'jax',
    name: 'jax',
    displayName: 'Jax',
    domains: ['g', 'o'],
    imageUrl: '/leaders/jax-go.png',
  },
  {
    id: 'lucian',
    name: 'lucian',
    displayName: 'Lucian',
    domains: ['r', 'o'],
    imageUrl: '/leaders/lucian-ro.png',
  },
  {
    id: 'ornn',
    name: 'ornn',
    displayName: 'Ornn',
    domains: ['g', 'b'],
    imageUrl: '/leaders/ornn-gb.png',
  },
  {
    id: 'reksai',
    name: 'reksai',
    displayName: "Rek'Sai",
    domains: ['r', 'y'],
    imageUrl: '/leaders/reksai-ry.png',
  },
  {
    id: 'renata',
    name: 'renata',
    displayName: 'Renata Glasc',
    domains: ['b', 'y'],
    imageUrl: '/leaders/renata-by.png',
  },
  {
    id: 'rumble',
    name: 'rumble',
    displayName: 'Rumble',
    domains: ['r', 'b'],
    imageUrl: '/leaders/rumble-rb.png',
  },
  {
    id: 'sivir',
    name: 'sivir',
    displayName: 'Sivir',
    domains: ['o', 'p'],
    imageUrl: '/leaders/sivir-op.png',
  },
];

// Helper functions
export function getLeaderById(id: string): Leader | undefined {
  return LEADERS.find((leader) => leader.id === id);
}

export function getLeaderByName(name: string): Leader | undefined {
  const normalized = name.toLowerCase().replace(/['\s-]/g, '');
  return LEADERS.find((leader) => leader.name === normalized || leader.id === normalized);
}

export function getLeaderColors(leader: Leader): [string, string] {
  return [DOMAINS[leader.domains[0]].color, DOMAINS[leader.domains[1]].color];
}

export function getLeaderGradient(leader: Leader, direction: string = '135deg'): string {
  const [color1, color2] = getLeaderColors(leader);
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

export function getLeaderDomainNames(leader: Leader): [string, string] {
  return [DOMAINS[leader.domains[0]].name, DOMAINS[leader.domains[1]].name];
}

// Search leaders by partial name
export function searchLeaders(query: string): Leader[] {
  const normalized = query.toLowerCase();
  return LEADERS.filter(
    (leader) =>
      leader.displayName.toLowerCase().includes(normalized) ||
      leader.name.includes(normalized)
  );
}
