import { UserRole, type AppointmentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/appointments/[id]/status - Update appointment status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: appointmentId } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses: AppointmentStatus[] = [
      'SCHEDULED',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'NO_SHOW',
      'DECLINED',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        patient: {
          include: {
            activeAssignments: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Authorization check - only doctor can update status
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json(
        { error: 'Only doctors can update appointment status' },
        { status: 403 }
      );
    }

    // Verify the doctor owns this appointment
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor || appointment.doctorId !== doctor.id) {
      return NextResponse.json(
        { error: 'You can only update your own appointments' },
        { status: 403 }
      );
    }

    // Check if update is allowed
    if (!appointment.canUpdateStatus) {
      return NextResponse.json(
        { error: 'This appointment status cannot be updated' },
        { status: 400 }
      );
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        statusUpdatedAt: new Date(),
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        billing: true,
      },
    });

    // Auto-assign patient to doctor when appointment is completed
    // Check if patient already has an active assignment with this doctor
    const hasActiveAssignment = appointment.patient.activeAssignments.some(
      (assignment) => assignment.doctorId === appointment.doctorId
    );

    if (status === 'COMPLETED' && !hasActiveAssignment) {
      // Create patient-doctor assignment record
      await prisma.patientDoctorAssignment.create({
        data: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          status: 'ACTIVE',
          notes: 'Auto-assigned after completed appointment',
        },
      });
    }

    // TODO: Send notification to patient about status change
    // You can implement email/SMS notification here

    return NextResponse.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error updating appointment status:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
