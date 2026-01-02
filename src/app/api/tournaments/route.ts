import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET all tournaments for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tournaments = await prisma.tournament.findMany({
    where: { userId: session.user.id },
    include: { rounds: { orderBy: { roundNumber: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tournaments);
}

// POST create new tournament
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, format, leaderId, date, playerCount, placing, rounds } = body;

  const tournament = await prisma.tournament.create({
    data: {
      userId: session.user.id,
      title,
      format,
      leaderId,
      date: date ? new Date(date) : new Date(),
      playerCount: playerCount || null,
      placing: placing || null,
      rounds: {
        create: rounds?.map((r: any, index: number) => ({
          roundNumber: r.roundNumber || index + 1,
          type: r.roundType || r.type,
          topcutLevel: r.topcutLevel || null,
          opponentName: r.opponentName || null,
          opponentLeader: r.opponentLeaderId || r.opponentLeader,
          result: r.result,
          diceWon: r.diceWon ?? null,
          notes: r.notes || null,
        })) || [],
      },
    },
    include: { rounds: true },
  });

  return NextResponse.json(tournament);
}
