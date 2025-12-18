import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/patients/[id]/reassign - Reassign patient to another doctor
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can reassign patients
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json(
        { error: 'Only doctors can reassign patients' },
        { status: 403 },
      );
    }

    const { id: patientId } = await params;
    const body = await request.json();
    const { newDoctorId, notes } = body;

    if (!newDoctorId) {
      return NextResponse.json(
        { error: 'New doctor ID is required' },
        { status: 400 },
      );
    }

    // Get current doctor
    const currentDoctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!currentDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify patient is currently assigned to this doctor
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        activeAssignments: {
          where: {
            status: 'ACTIVE',
          },
          include: {
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if patient is assigned to this doctor
    const currentAssignment = patient.activeAssignments.find(
      (assignment) => assignment.doctorId === currentDoctor.id,
    );

    if (!currentAssignment) {
      return NextResponse.json(
        { error: 'You can only reassign your own patients' },
        { status: 403 },
      );
    }

    // Verify new doctor exists
    const newDoctor = await prisma.doctor.findUnique({
      where: { id: newDoctorId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!newDoctor) {
      return NextResponse.json(
        { error: 'New doctor not found' },
        { status: 404 },
      );
    }

    if (!newDoctor.isActive) {
      return NextResponse.json(
        { error: 'Cannot assign to inactive doctor' },
        { status: 400 },
      );
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Deactivate old assignment
      await tx.patientDoctorAssignment.updateMany({
        where: {
          patientId: patientId,
          doctorId: currentDoctor.id,
          status: 'ACTIVE',
        },
        data: {
          status: 'INACTIVE',
          deactivatedAt: new Date(),
          notes: notes || `Reassigned to Dr. ${newDoctor.user.name}`,
        },
      });

      // Create new assignment
      await tx.patientDoctorAssignment.create({
        data: {
          patientId: patientId,
          doctorId: newDoctorId,
          status: 'ACTIVE',
          notes:
            notes ||
            `Assigned from Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Patient successfully reassigned to Dr. ${newDoctor.user.name}`,
      data: {
        patientId: patient.id,
        patientName: patient.user.name,
        fromDoctor: `${currentDoctor.firstName} ${currentDoctor.lastName}`,
        toDoctor: newDoctor.user.name,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reassigning patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
