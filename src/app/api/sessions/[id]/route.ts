import type { SessionStatus } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/sessions/[id] - Get session details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Fetch session with all related data
    const sessionData = await prisma.session.findUnique({
      where: { id },
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
              },
            },
          },
        },
        billing: true,
      },
    });

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 },
      );
    }

    // Verify the doctor owns this session
    if (sessionData.doctorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 },
      );
    }

    // Serialize Decimal fields
    const serializedSession = {
      ...sessionData,
      billing: sessionData.billing
        ? {
            ...sessionData.billing,
            amount: sessionData.billing.amount.toNumber(),
          }
        : null,
    };

    return NextResponse.json({ success: true, data: serializedSession });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 },
    );
  }
}

// PATCH /api/sessions/[id] - Update session status or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { status, notes } = body;

    // Fetch existing session
    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 },
      );
    }

    // Verify ownership
    if (existingSession.doctorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 },
      );
    }

    // Validate status change
    if (status) {
      const validStatuses = [
        'SCHEDULED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW',
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 },
        );
      }

      // Check if session time has passed
      const now = new Date();
      const sessionDateTime = new Date(existingSession.scheduledDate);
      const [hours, minutes] = existingSession.endTime.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      // Can only update to COMPLETED, CANCELLED, or NO_SHOW after session time
      if (
        now > sessionDateTime &&
        status !== 'COMPLETED' &&
        status !== 'CANCELLED' &&
        status !== 'NO_SHOW'
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Session time has passed. Can only mark as completed, cancelled, or no show.',
          },
          { status: 400 },
        );
      }

      // Can't change status if already completed
      if (existingSession.status === 'COMPLETED') {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot change status of completed session',
          },
          { status: 400 },
        );
      }
    }

    // Update session
    const updateData: {
      status?: SessionStatus;
      notes?: string;
    } = {};

    if (status) {
      updateData.status = status as SessionStatus;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData,
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
              },
            },
          },
        },
        billing: true,
      },
    });

    // Update billing status separately if needed
    if (status && updatedSession.billing) {
      let billingStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | null = null;
      if (status === 'COMPLETED') {
        billingStatus = 'PENDING';
      } else if (status === 'CANCELLED' || status === 'NO_SHOW') {
        billingStatus = 'FAILED';
      }

      if (billingStatus) {
        await prisma.billing.update({
          where: { id: updatedSession.billing.id },
          data: { status: billingStatus },
        });
      }
    }

    // Refetch the session with updated billing
    const finalSession = await prisma.session.findUnique({
      where: { id },
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
              },
            },
          },
        },
        billing: true,
      },
    });

    if (!finalSession) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 },
      );
    }

    // Serialize Decimal fields
    const serializedSession = {
      ...finalSession,
      billing: finalSession.billing
        ? {
            ...finalSession.billing,
            amount: finalSession.billing.amount.toNumber(),
          }
        : null,
    };

    return NextResponse.json({ success: true, data: serializedSession });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session' },
      { status: 500 },
    );
  }
}
