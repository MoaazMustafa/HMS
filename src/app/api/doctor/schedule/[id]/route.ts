import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/doctor/schedule/[id] - Update a working hours schedule
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: scheduleId } = await params;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, isAvailable } = body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate day of week
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: 'Day of week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM format' },
        { status: 400 }
      );
    }

    // Validate time range
    if (startTime >= endTime) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    // Get doctor
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify schedule belongs to this doctor
    const existingSchedule = await prisma.workingHours.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (existingSchedule.doctorId !== doctor.id) {
      return NextResponse.json(
        { error: 'You can only update your own schedules' },
        { status: 403 }
      );
    }

    // Check for overlapping schedules (only if day changed or times changed)
    if (
      existingSchedule.dayOfWeek !== dayOfWeek ||
      existingSchedule.startTime !== startTime ||
      existingSchedule.endTime !== endTime
    ) {
      const overlapping = await prisma.workingHours.findFirst({
        where: {
          doctorId: doctor.id,
          dayOfWeek,
          isActive: true,
          id: { not: scheduleId },
          OR: [
            {
              AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
            },
            {
              AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
            },
            {
              AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
            },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          {
            error: 'This schedule overlaps with an existing schedule for the same day',
          },
          { status: 400 }
        );
      }
    }

    // Update schedule
    const updatedSchedule = await prisma.workingHours.update({
      where: { id: scheduleId },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error updating schedule:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/doctor/schedule/[id] - Delete a working hours schedule (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: scheduleId } = await params;

    // Get doctor
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify schedule belongs to this doctor
    const existingSchedule = await prisma.workingHours.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (existingSchedule.doctorId !== doctor.id) {
      return NextResponse.json(
        { error: 'You can only delete your own schedules' },
        { status: 403 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.workingHours.update({
      where: { id: scheduleId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting schedule:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
