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

    // Doctor: Get medical records for their patients
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

      const records = await prisma.medicalRecord.findMany({
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
          diagnoses: true,
        },
        orderBy: {
          visitDate: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        data: records,
        count: records.length,
      });
    }

    // Patient: Get their own medical records
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

      const records = await prisma.medicalRecord.findMany({
        where: {
          patientId: patient.id,
          isSigned: true, // Only show signed records to patients
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
          diagnoses: true,
        },
        orderBy: {
          visitDate: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        data: records,
        count: records.length,
      });
    }

    // Nurse: Get all medical records (read-only)
    if (session.user.role === UserRole.NURSE) {
      const records = await prisma.medicalRecord.findMany({
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
          diagnoses: true,
        },
        orderBy: {
          visitDate: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        data: records,
        count: records.length,
      });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medical records' },
      { status: 500 },
    );
  }
}
