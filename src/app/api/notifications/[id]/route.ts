import type { NextRequest} from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/notifications/[id] - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 },
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 },
    );
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 },
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 },
    );
  }
}
