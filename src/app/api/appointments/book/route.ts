import { UserRole } from '@prisma/client';
import type { NextRequest} from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.PATIENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, scheduledDate, scheduledTime, reason, duration, type } = body;

    // Validate required fields
    if (!doctorId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, scheduledDate, scheduledTime' },
        { status: 400 }
      );
    }

    // Get patient ID from session
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    });

    if (!user?.patient) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Get doctor and consultation fee
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Generate unique appointment ID
    const appointmentCount = await prisma.appointment.count();
    const appointmentId = `APT${String(appointmentCount + 1).padStart(6, '0')}`;

    // Parse date and time
    const appointmentDate = new Date(scheduledDate);
    const [hours, minutes] = scheduledTime.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // **VALIDATION 1: Prevent booking in the past**
    const now = new Date();
    if (appointmentDate <= now) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past. Please select a future date and time.' },
        { status: 400 }
      );
    }

    // Calculate appointment duration (default 30 minutes) and end time
    const appointmentDuration = duration || 30;
    const endTime = new Date(appointmentDate.getTime() + appointmentDuration * 60000);
    const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;

    // **VALIDATION 2: Prevent double-booking (check for overlapping time slots)**
    // Get all appointments for this doctor on this date with active statuses
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledDate: appointmentDate,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        duration: true,
      },
    });

    // Check for time slot conflicts
    for (const existing of existingAppointments) {
      const existingStart = existing.startTime;
      const existingEnd = existing.endTime;

      // Check if the new appointment overlaps with any existing appointment
      // Overlap conditions:
      // 1. New appointment starts during an existing appointment
      // 2. New appointment ends during an existing appointment
      // 3. New appointment completely encompasses an existing appointment
      const hasOverlap =
        (scheduledTime >= existingStart && scheduledTime < existingEnd) || // New starts during existing
        (endTimeStr > existingStart && endTimeStr <= existingEnd) || // New ends during existing
        (scheduledTime <= existingStart && endTimeStr >= existingEnd); // New encompasses existing

      if (hasOverlap) {
        return NextResponse.json(
          {
            error: `This time slot conflicts with an existing appointment (${existingStart} - ${existingEnd}). Please choose a different time.`,
          },
          { status: 409 }
        );
      }
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentId,
        patientId: user.patient.id,
        doctorId,
        scheduledDate: appointmentDate,
        startTime: scheduledTime,
        endTime: endTimeStr,
        duration: appointmentDuration,
        type: type || 'Consultation',
        reason: reason || undefined,
        status: 'SCHEDULED',
        customFee: doctor.defaultAppointmentFee,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    // Add doctor's full name to response
    const appointmentWithName = {
      ...appointment,
      doctor: {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      },
    };

    // TODO: Send confirmation email/SMS
    // TODO: Create calendar event
    // TODO: Schedule reminders (24h and 2h before)

    return NextResponse.json(
      {
        message: 'Appointment booked successfully',
        appointment: appointmentWithName,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
