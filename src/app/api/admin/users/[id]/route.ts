import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting yourself
    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 },
      );
    }

    // Prevent non-main admins from deleting other admins
    if (
      session.user.role === UserRole.ADMIN &&
      (user.role === UserRole.ADMIN || user.role === UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete admin users' },
        { status: 403 },
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    );
  }
}

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: {
          include: {
            appointments: {
              take: 5,
              orderBy: { scheduledDate: 'desc' },
              include: {
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
            },
            prescriptions: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
            medicalRecords: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        doctor: {
          include: {
            appointments: {
              take: 5,
              orderBy: { scheduledDate: 'desc' },
            },
            prescriptions: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
            sessions: {
              take: 5,
              orderBy: { scheduledDate: 'desc' },
            },
          },
        },
        nurse: {
          include: {
            vitalSigns: {
              take: 10,
              orderBy: { recordedAt: 'desc' },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 },
    );
  }
}
