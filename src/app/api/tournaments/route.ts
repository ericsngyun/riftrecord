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
  const { title, format, leaderId, rounds } = body;

  const tournament = await prisma.tournament.create({
    data: {
      userId: session.user.id,
      title,
      format,
      leaderId,
      rounds: {
        create: rounds?.map((r: any, index: number) => ({
          roundNumber: index + 1,
          type: r.type,
          topcutLevel: r.topcutLevel,
          opponentName: r.opponentName,
          opponentLeader: r.opponentLeader,
          result: r.result,
          notes: r.notes,
        })) || [],
      },
    },
    include: { rounds: true },
  });

  return NextResponse.json(tournament);
}
