import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/doctor/patients - Get doctor's assigned patients
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Fetch all patients assigned to this doctor with their stats
    const assignments = await prisma.patientDoctorAssignment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
            _count: {
              select: {
                appointments: true,
                prescriptions: true,
                medicalRecords: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    // Transform the data for the frontend
    const patients = assignments.map((assignment) => ({
      id: assignment.patient.id,
      patientId: assignment.patient.patientId,
      dateOfBirth: assignment.patient.dateOfBirth,
      gender: assignment.patient.gender,
      bloodType: assignment.patient.bloodGroup,
      user: assignment.patient.user,
      assignment: {
        id: assignment.id,
        status: assignment.status,
        assignedAt: assignment.assignedAt,
      },
      _count: assignment.patient._count,
    }));

    return NextResponse.json({
      success: true,
      data: patients,
      count: patients.length,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching doctor patients:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
