import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorOverview } from '@/components/dashboard/doctor-overview';
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

  // Doctor Dashboard
  if (session.user.role === UserRole.DOCTOR) {
    const doctorUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        doctor: {
          include: {
            appointments: {
              where: {
                scheduledDate: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)), // From start of today
                },
                status: {
                  in: ['SCHEDULED', 'CONFIRMED'],
                },
              },
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
              },
              orderBy: {
                scheduledDate: 'asc',
              },
            },
            sessions: {
              where: {
                scheduledDate: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)), // From start of today
                },
                status: {
                  in: ['SCHEDULED', 'IN_PROGRESS'],
                },
              },
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
              },
              orderBy: {
                scheduledDate: 'asc',
              },
            },
            patientAssignments: {
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            prescriptions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
            labTests: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
          },
        },
      },
    });

    if (!doctorUser?.doctor) {
      redirect('/login');
    }

    return <DoctorOverview doctor={doctorUser.doctor} />;
  }

  // Other roles - Coming Soon
  return <ComingSoon />;
}
