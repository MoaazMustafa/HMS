import { UserRole } from '@prisma/client';
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

    // Doctor: Get lab tests for their patients
    if (session.user.role === UserRole.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: session.user.id },
      });

      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 },
        );
      }

      const labTests = await prisma.labTest.findMany({
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
        },
        orderBy: {
          orderedAt: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        data: labTests,
        count: labTests.length,
      });
    }

    // Patient: Get their own lab tests
    if (session.user.role === UserRole.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id },
      });

      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 },
        );
      }

      const labTests = await prisma.labTest.findMany({
        where: {
          patientId: patient.id,
          status: 'REVIEWED', // Only show reviewed tests to patients
        },
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          orderedAt: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        data: labTests,
        count: labTests.length,
      });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching lab tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lab tests' },
      { status: 500 },
    );
  }
}
