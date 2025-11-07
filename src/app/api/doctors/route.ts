import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all doctors with their user info and working hours
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        workingHours: {
          where: {
            isActive: true,
          },
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add full name to each doctor
    const doctorsWithName = doctors.map((doctor) => ({
      ...doctor,
      name: `${doctor.firstName} ${doctor.lastName}`,
    }));

    return NextResponse.json({ doctors: doctorsWithName }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
