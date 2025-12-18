import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/patients/[id]/assign-doctor - Add a doctor to patient's care team
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: patientId } = await params;
    const body = await request.json();
    const { doctorId, notes } = body;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 },
      );
    }

    // Get current doctor (who is making the request)
    const currentDoctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!currentDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if current doctor has access to this patient
    const currentAssignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId: patientId,
        doctorId: currentDoctor.id,
        status: 'ACTIVE',
      },
    });

    if (!currentAssignment) {
      return NextResponse.json(
        { error: 'You do not have access to this patient' },
        { status: 403 },
      );
    }

    // Verify new doctor exists
    const newDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!newDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (!newDoctor.isActive) {
      return NextResponse.json(
        { error: 'Cannot assign inactive doctor' },
        { status: 400 },
      );
    }

    // Check if this doctor is already assigned
    const existingAssignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId: patientId,
        doctorId: doctorId,
        status: 'ACTIVE',
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'This doctor is already assigned to this patient' },
        { status: 400 },
      );
    }

    // Create new assignment (without deactivating existing ones)
    const assignment = await prisma.patientDoctorAssignment.create({
      data: {
        patientId: patientId,
        doctorId: doctorId,
        status: 'ACTIVE',
        notes:
          notes ||
          `Added to care team by Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Dr. ${newDoctor.user.name} added to ${patient.user.name}'s care team`,
      data: assignment,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding doctor assignment:', error);
    return NextResponse.json(
      { error: 'Failed to add doctor assignment' },
      { status: 500 },
    );
  }
}

// DELETE /api/patients/[id]/assign-doctor - Remove a doctor from patient's care team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: patientId } = await params;
    const { searchParams } = new URL(request.url);
    const doctorIdToRemove = searchParams.get('doctorId');

    if (!doctorIdToRemove) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
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

    // Check if current doctor has access to this patient
    const currentAssignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId: patientId,
        doctorId: currentDoctor.id,
        status: 'ACTIVE',
      },
    });

    if (!currentAssignment) {
      return NextResponse.json(
        { error: 'You do not have access to this patient' },
        { status: 403 },
      );
    }

    // Count active assignments
    const activeAssignments = await prisma.patientDoctorAssignment.count({
      where: {
        patientId: patientId,
        status: 'ACTIVE',
      },
    });

    // Ensure at least one doctor remains assigned
    if (activeAssignments <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last doctor assigned to this patient' },
        { status: 400 },
      );
    }

    // Deactivate the assignment
    await prisma.patientDoctorAssignment.updateMany({
      where: {
        patientId: patientId,
        doctorId: doctorIdToRemove,
        status: 'ACTIVE',
      },
      data: {
        status: 'INACTIVE',
        deactivatedAt: new Date(),
        notes: `Removed from care team by Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Doctor removed from care team',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error removing doctor assignment:', error);
    return NextResponse.json(
      { error: 'Failed to remove doctor assignment' },
      { status: 500 },
    );
  }
}
