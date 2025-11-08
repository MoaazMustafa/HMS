import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId: user.id },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
    }

    // Fetch sessions with related data
    const sessions = await prisma.session.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        billing: {
          select: {
            amount: true,
            status: true,
            paidAt: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });

    // Serialize Decimal fields
    const serializedSessions = sessions.map((session) => ({
      ...session,
      customFee: session.customFee ? Number(session.customFee) : null,
      billing: session.billing
        ? {
            amount: Number(session.billing.amount),
            status: session.billing.status,
            paidAt: session.billing.paidAt,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: serializedSessions,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
