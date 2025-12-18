import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/doctor/profile - Get doctor profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        workingHours: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching doctor profile:', error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PUT /api/doctor/profile - Update doctor profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      specialization,
      phone,
      email,
      phoneNumber,
      defaultAppointmentFee,
      defaultSessionFee,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 },
        );
      }
    }

    // Update doctor profile in a transaction
    const updatedDoctor = await prisma.$transaction(async (tx) => {
      // Update user data
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: `${firstName} ${lastName}`,
          email: email || session.user.email,
          phoneNumber: phoneNumber || phone,
        },
      });

      // Update doctor data
      const doctor = await tx.doctor.update({
        where: { userId: session.user.id },
        data: {
          firstName,
          lastName,
          specialization,
          phone,
          defaultAppointmentFee: defaultAppointmentFee
            ? parseFloat(defaultAppointmentFee)
            : undefined,
          defaultSessionFee: defaultSessionFee
            ? parseFloat(defaultSessionFee)
            : undefined,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          workingHours: {
            where: { isActive: true },
            orderBy: { dayOfWeek: 'asc' },
          },
        },
      });

      return doctor;
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedDoctor,
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error updating doctor profile:', error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
