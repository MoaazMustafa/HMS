import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { PatientDetailPage } from '@/components/dashboard/patient-detail-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors can view patient details
  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard');
  }

  const { id: patientId } = await params;

  // Fetch patient with full details
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
        },
      },
      activeAssignments: {
        where: {
          status: 'ACTIVE',
        },
        include: {
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
      },
      allergies: {
        orderBy: {
          diagnosedAt: 'desc',
        },
      },
      appointments: {
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
        },
        orderBy: {
          scheduledDate: 'desc',
        },
        take: 10,
      },
      prescriptions: {
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          issuedAt: 'desc',
        },
        take: 5,
      },
      medicalRecords: {
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          visitDate: 'desc',
        },
        take: 5,
      },
      labTests: {
        orderBy: {
          orderedAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!patient) {
    redirect('/dashboard/patients');
  }

  // Verify doctor has access to this patient
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
  });

  if (!doctor) {
    redirect('/dashboard');
  }

  // Check if patient is assigned to this doctor OR has appointments with them
  const assignment = await prisma.patientDoctorAssignment.findFirst({
    where: {
      patientId: patient.id,
      doctorId: doctor.id,
      status: 'ACTIVE',
    },
  });

  // Also check if doctor has any appointments with this patient
  const hasAppointments = await prisma.appointment.findFirst({
    where: {
      patientId: patient.id,
      doctorId: doctor.id,
    },
  });

  // Allow access if either condition is met
  if (!assignment && !hasAppointments) {
    redirect('/dashboard/patients');
  }

  return <PatientDetailPage patient={patient} />;
}
