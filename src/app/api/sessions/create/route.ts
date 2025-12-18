import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/sessions/create - Create a new therapy session
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can create sessions
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json(
        { error: 'Only doctors can create sessions' },
        { status: 403 },
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      patientId,
      scheduledDate,
      startTime,
      endTime,
      duration,
      customFee,
      notes,
    } = body;

    // Validation
    if (!patientId || !scheduledDate || !startTime || !endTime || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Verify patient is assigned to this doctor
    const assignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId: patientId,
        doctorId: doctor.id,
        status: 'ACTIVE',
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient is not assigned to you' },
        { status: 403 },
      );
    }

    // Check for scheduling conflicts
    const conflictingSession = await prisma.session.findFirst({
      where: {
        doctorId: doctor.id,
        scheduledDate: new Date(scheduledDate),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
      },
    });

    if (conflictingSession) {
      return NextResponse.json(
        { error: 'Time slot conflicts with existing session' },
        { status: 400 },
      );
    }

    // Generate unique session ID
    const sessionCount = await prisma.session.count();
    const sessionId = `SES-${new Date().getFullYear()}-${String(sessionCount + 1).padStart(5, '0')}`;

    // Create the session
    const newSession = await prisma.session.create({
      data: {
        sessionId,
        patientId,
        doctorId: doctor.id,
        scheduledDate: new Date(scheduledDate),
        startTime,
        endTime,
        duration,
        customFee: customFee ? parseFloat(customFee) : null,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
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
              },
            },
          },
        },
      },
    });

    // Create billing record if there's a fee
    const fee = customFee || doctor.defaultSessionFee;
    if (fee) {
      const billingCount = await prisma.billing.count();
      const billId = `BILL-${new Date().getFullYear()}-${String(billingCount + 1).padStart(5, '0')}`;

      await prisma.billing.create({
        data: {
          billId,
          patientId,
          sessionId: newSession.id,
          amount: fee,
          description: `Therapy Session - ${sessionId}`,
          status: 'PENDING',
        },
      });
    }

    // Serialize Decimal fields
    const serializedSession = {
      ...newSession,
      customFee: newSession.customFee ? newSession.customFee.toNumber() : null,
    };

    return NextResponse.json({
      success: true,
      message: 'Session created successfully',
      data: serializedSession,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
