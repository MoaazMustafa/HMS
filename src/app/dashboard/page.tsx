import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorOverview } from '@/components/dashboard/doctor-overview';
import NurseOverview from '@/components/dashboard/nurse-overview';
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

  // Nurse Dashboard
  if (session.user.role === UserRole.NURSE) {
    // Fetch vital signs recorded today by this nurse
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const vitalSignsRecordedToday = await prisma.vitalSign.count({
      where: {
        recordedBy: session.user.id,
        recordedAt: {
          gte: todayStart,
        },
      },
    });

    // Get recent vital signs
    const recentVitalSigns = await prisma.vitalSign.findMany({
      where: {
        recordedBy: session.user.id,
        recordedAt: {
          gte: todayStart,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
      take: 5,
    });

    // Get unique patients count
    const patientsToday = new Set(recentVitalSigns.map((vs) => vs.patientId))
      .size;

    // Get upcoming appointments for today
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: new Date(),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
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
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: 'asc',
      },
      take: 5,
    });

    return (
      <NurseOverview
        stats={{
          patientsToday,
          vitalSignsRecorded: vitalSignsRecordedToday,
          upcomingAppointments: upcomingAppointments.length,
        }}
        recentVitalSigns={recentVitalSigns as never}
        upcomingAppointments={upcomingAppointments as never}
      />
    );
  }

  // Admin Dashboard - Coming Soon
  if (
    session.user.role === UserRole.ADMIN ){
    redirect('/dashboard/admin');
  }

  // Other roles - Coming Soon
  return <ComingSoon />;
}
