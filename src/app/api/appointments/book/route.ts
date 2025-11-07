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

    // Calculate appointment duration (default 30 minutes) and end time
    const appointmentDuration = duration || 30;
    const endTime = new Date(appointmentDate.getTime() + appointmentDuration * 60000);
    const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;

    // Check for conflicting appointments
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        scheduledDate: appointmentDate,
        startTime: scheduledTime,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
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
