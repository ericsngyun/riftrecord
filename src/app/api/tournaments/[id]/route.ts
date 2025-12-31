import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET single tournament
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const tournament = await prisma.tournament.findFirst({
    where: { id, userId: session.user.id },
    include: { rounds: { orderBy: { roundNumber: 'asc' } } },
  });

  if (!tournament) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(tournament);
}

// PUT update tournament
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, format, leaderId, rounds } = body;

  // Verify ownership
  const existing = await prisma.tournament.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete existing rounds and recreate
  await prisma.round.deleteMany({ where: { tournamentId: id } });

  const tournament = await prisma.tournament.update({
    where: { id },
    data: {
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

// DELETE tournament
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.tournament.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.tournament.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
