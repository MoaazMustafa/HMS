import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/patients - Get all patients (for nurses and admins)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only nurses, doctors, and admins can view all patients
    if (
      session.user.role !== UserRole.NURSE &&
      session.user.role !== UserRole.DOCTOR &&
      session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.MAIN_ADMIN
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    const whereClause = search
      ? {
          OR: [
            { patientId: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            {
              user: {
                email: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        _count: {
          select: {
            vitalSigns: true,
            appointments: true,
            medicalRecords: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch patients',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
