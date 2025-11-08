import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/doctor/stats - Get doctor dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Get today's date range
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // Fetch all statistics in parallel
    const [
      activePatients,
      todayAppointments,
      todaySessions,
      activePrescriptions,
      pendingLabTests,
      upcomingAppointments,
      totalAppointments,
      completedAppointments,
    ] = await Promise.all([
      // Active patients count
      prisma.patientDoctorAssignment.count({
        where: {
          doctorId: doctor.id,
          status: 'ACTIVE',
        },
      }),
      // Today's appointments
      prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          scheduledDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
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
        },
        orderBy: {
          startTime: 'asc',
        },
      }),
      // Today's sessions
      prisma.session.findMany({
        where: {
          doctorId: doctor.id,
          scheduledDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS'],
          },
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
        },
        orderBy: {
          startTime: 'asc',
        },
      }),
      // Active prescriptions count
      prisma.prescription.count({
        where: {
          doctorId: doctor.id,
          status: 'ACTIVE',
        },
      }),
      // Pending lab tests count
      prisma.labTest.count({
        where: {
          doctorId: doctor.id,
          status: {
            in: ['ORDERED', 'IN_PROGRESS'],
          },
        },
      }),
      // Upcoming appointments (next 7 days)
      prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          scheduledDate: {
            gt: endOfToday,
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
      }),
      // Total appointments (all time)
      prisma.appointment.count({
        where: {
          doctorId: doctor.id,
        },
      }),
      // Completed appointments (all time)
      prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          status: 'COMPLETED',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activePatients,
          todayAppointmentsCount: todayAppointments.length,
          todaySessionsCount: todaySessions.length,
          activePrescriptions,
          pendingLabTests,
          upcomingAppointments,
          totalAppointments,
          completedAppointments,
        },
        todaySchedule: {
          appointments: todayAppointments,
          sessions: todaySessions,
        },
      },
    });
  } catch (error) {
    // Log error for debugging
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching doctor stats:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
