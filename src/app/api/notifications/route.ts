import { NotificationType, UserRole } from '@prisma/client';
import type { NextRequest} from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId: session.user.id };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 },
    );
  }
}

// POST /api/notifications - Create notification (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientType, title, message, type, userIds } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 },
      );
    }

    // Validate notification type
    const validTypes = Object.values(NotificationType);
    const notificationType = type && validTypes.includes(type) ? type : NotificationType.GENERAL;

    let targetUserIds: string[] = [];

    // Determine recipients
    if (userIds && Array.isArray(userIds)) {
      targetUserIds = userIds;
    } else if (recipientType === 'ALL') {
      const users = await prisma.user.findMany({ select: { id: true } });
      targetUserIds = users.map((u) => u.id);
    } else if (recipientType && ['DOCTOR', 'NURSE', 'PATIENT', 'ADMIN'].includes(recipientType)) {
      const users = await prisma.user.findMany({
        where: { role: recipientType as UserRole },
        select: { id: true },
      });
      targetUserIds = users.map((u) => u.id);
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 },
      );
    }

    // Create notifications for all recipients
    const notifications = await prisma.notification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        type: notificationType,
        title,
        message,
        sentVia: ['PUSH'],
        sentAt: new Date(),
      })),
    });

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${notifications.count} users`,
      count: notifications.count,
    });
  } catch (error) {
    console.error('Notification creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 },
    );
  }
}
