import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { PatientOverview } from '@/components/dashboard/patient-overview';
import ComingSoon from '@/components/sections/coming-soon';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Patient Dashboard
  if (session.user.role === UserRole.PATIENT) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        patient: {
          include: {
            appointments: {
              where: {
                scheduledDate: {
                  gte: new Date(),
                },
                status: {
                  in: ['SCHEDULED', 'CONFIRMED'],
                },
              },
              include: {
                doctor: {
                  include: {
                    user: true,
                  },
                },
              },
              orderBy: {
                scheduledDate: 'asc',
              },
              take: 5,
            },
            prescriptions: {
              where: {
                status: 'ACTIVE',
              },
              include: {
                doctor: {
                  include: {
                    user: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 5,
            },
            labTests: {
              where: {
                status: 'COMPLETED',
                reviewedAt: {
                  not: null,
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 3,
            },
            allergies: true,
          },
        },
      },
    });

    if (!user?.patient) {
      redirect('/login');
    }

    return <PatientOverview patient={user.patient} />;
  }

  // Other roles - Coming Soon
  return <ComingSoon />;
}
