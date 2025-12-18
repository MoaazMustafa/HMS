import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const body = await request.json();
    const { patientId, testName, testType, notes } = body;

    // Validate required fields
    if (!patientId || !testName || !testType) {
      return NextResponse.json(
        { error: 'Patient, test name, and test type are required' },
        { status: 400 },
      );
    }

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if doctor has access to this patient
    const assignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId: patientId,
        doctorId: doctor.id,
        status: 'ACTIVE',
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'You do not have access to this patient' },
        { status: 403 },
      );
    }

    // Generate unique test ID
    const year = new Date().getFullYear();
    const lastTest = await prisma.labTest.findFirst({
      where: {
        testId: {
          startsWith: `LAB-${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastTest) {
      const lastNumber = parseInt(lastTest.testId.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    const testId = `LAB-${year}-${nextNumber.toString().padStart(5, '0')}`;

    // Create lab test order
    const labTest = await prisma.labTest.create({
      data: {
        testId,
        patientId,
        doctorId: doctor.id,
        testName,
        testType,
        status: 'ORDERED',
        orderedAt: new Date(),
        notes: notes || null,
        isCritical: false,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: labTest,
      message: 'Lab test ordered successfully',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating lab test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to order lab test' },
      { status: 500 },
    );
  }
}
