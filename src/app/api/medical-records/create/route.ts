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
    const { patientId, visitDate, chiefComplaint, physicalExam, assessment, plan } = body;

    // Validate required fields
    if (!patientId || !visitDate) {
      return NextResponse.json({ error: 'Patient and visit date are required' }, { status: 400 });
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
        { status: 403 }
      );
    }

    // Generate unique record ID
    const year = new Date().getFullYear();
    const lastRecord = await prisma.medicalRecord.findFirst({
      where: {
        recordId: {
          startsWith: `MR-${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastRecord) {
      const lastNumber = parseInt(lastRecord.recordId.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    const recordId = `MR-${year}-${nextNumber.toString().padStart(5, '0')}`;

    // Create medical record
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        recordId,
        patientId,
        doctorId: doctor.id,
        visitDate: new Date(visitDate),
        chiefComplaint: chiefComplaint || null,
        physicalExam: physicalExam || null,
        assessment: assessment || null,
        plan: plan || null,
        isSigned: false,
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
        diagnoses: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: medicalRecord,
      message: 'Medical record created successfully',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating medical record:', error);
    return NextResponse.json({ success: false, error: 'Failed to create medical record' }, { status: 500 });
  }
}
