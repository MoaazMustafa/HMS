import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can view prescriptions
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor profile not found' }, { status: 404 });
    }

    const prescriptions = await prisma.prescription.findMany({
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
        interactions: {
          orderBy: {
            acknowledgedAt: 'desc',
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

