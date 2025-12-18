import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/stats - Get system statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts for different entities
    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalNurses,
      totalAppointments,
      todayAppointments,
      activePrescriptions,
      pendingLabTests,
      recentUsers,
      appointmentsByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.PATIENT } }),
      prisma.user.count({ where: { role: UserRole.DOCTOR } }),
      prisma.user.count({ where: { role: UserRole.NURSE } }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          scheduledDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.prescription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.labTest.count({
        where: { status: 'ORDERED' },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.appointment.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Calculate growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [usersLast30Days, usersPrevious30Days] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    const userGrowth =
      usersPrevious30Days > 0
        ? ((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100
        : 100;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalNurses,
        totalAppointments,
        todayAppointments,
        activePrescriptions,
        pendingLabTests,
      },
      growth: {
        users: userGrowth.toFixed(1),
      },
      recentUsers,
      appointmentsByStatus: appointmentsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 },
    );
  }
}
