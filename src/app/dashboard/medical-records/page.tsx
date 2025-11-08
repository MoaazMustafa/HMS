import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import DoctorMedicalRecordsPage from '@/components/dashboard/doctor-medical-records-page';
import { MedicalRecordsPage } from '@/components/dashboard/medical-records-page';
import * as auth from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function MedicalRecordsPageRoute() {
  const session = await getServerSession(auth.authOptions);

  if (!session) {
    redirect('/login');
  }

  // Doctor View
  if (session.user.role === UserRole.DOCTOR) {
    return <DoctorMedicalRecordsPage />;
  }

  // Patient View
  if (session.user.role !== UserRole.PATIENT) {
    redirect('/login');
  }

  // Fetch patient with medical records
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: {
        include: {
          medicalRecords: {
            include: {
              doctor: {
                include: {
                  user: true,
                },
              },
              diagnoses: true,
            },
            orderBy: {
              visitDate: 'desc',
            },
          },
          allergies: {
            orderBy: {
              diagnosedAt: 'desc',
            },
          },
          immunizations: {
            orderBy: {
              dateAdministered: 'desc',
            },
          },
        },
      },
    },
  });

  if (!user?.patient) {
    redirect('/login');
  }

  return (
    <MedicalRecordsPage
      medicalRecords={user.patient.medicalRecords as never}
      allergies={user.patient.allergies as never}
      immunizations={user.patient.immunizations as never}
    />
  );
}
