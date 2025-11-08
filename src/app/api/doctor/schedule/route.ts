import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/doctor/schedule - Get doctor's working hours and schedule
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
      include: {
        workingHours: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        timeOffRequests: {
          where: {
            endDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        workingHours: doctor.workingHours,
        timeOffRequests: doctor.timeOffRequests,
        defaultAppointmentFee: doctor.defaultAppointmentFee,
        defaultSessionFee: doctor.defaultSessionFee,
      },
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching doctor schedule:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/doctor/schedule - Add working hours
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dayOfWeek, startTime, endTime, isAvailable } = body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate day of week (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: 'Invalid day of week' }, { status: 400 });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ error: 'Invalid time format. Use HH:MM' }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check for overlapping working hours
    const existingHours = await prisma.workingHours.findFirst({
      where: {
        doctorId: doctor.id,
        dayOfWeek,
        isActive: true,
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

    if (existingHours) {
      return NextResponse.json(
        { error: 'Working hours overlap with existing schedule' },
        { status: 400 }
      );
    }

    const workingHours = await prisma.workingHours.create({
      data: {
        doctorId: doctor.id,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: isAvailable !== false, // Default to true
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Working hours added successfully',
      data: workingHours,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error adding working hours:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/doctor/schedule - Update working hours
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, startTime, endTime, isAvailable } = body;

    if (!id) {
      return NextResponse.json({ error: 'Working hours ID is required' }, { status: 400 });
    }

    // Validate time format if provided
    if (startTime || endTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if ((startTime && !timeRegex.test(startTime)) || (endTime && !timeRegex.test(endTime))) {
        return NextResponse.json({ error: 'Invalid time format. Use HH:MM' }, { status: 400 });
      }
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify the working hours belong to this doctor
    const existingHours = await prisma.workingHours.findUnique({
      where: { id },
    });

    if (!existingHours || existingHours.doctorId !== doctor.id) {
      return NextResponse.json({ error: 'Working hours not found' }, { status: 404 });
    }

    const updatedHours = await prisma.workingHours.update({
      where: { id },
      data: {
        startTime: startTime || existingHours.startTime,
        endTime: endTime || existingHours.endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : existingHours.isAvailable,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Working hours updated successfully',
      data: updatedHours,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error updating working hours:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/doctor/schedule - Delete/deactivate working hours
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Working hours ID is required' }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Verify the working hours belong to this doctor
    const existingHours = await prisma.workingHours.findUnique({
      where: { id },
    });

    if (!existingHours || existingHours.doctorId !== doctor.id) {
      return NextResponse.json({ error: 'Working hours not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    await prisma.workingHours.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Working hours removed successfully',
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting working hours:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
