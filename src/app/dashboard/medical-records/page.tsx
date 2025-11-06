import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { MedicalRecordsPage } from '@/components/dashboard/medical-records-page';
import * as auth from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PatientMedicalRecordsPage() {
  const session = await getServerSession(auth.authOptions);

  if (!session || session.user.role !== UserRole.PATIENT) {
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
      medicalRecords={user.patient.medicalRecords as any}
      allergies={user.patient.allergies as any}
      immunizations={user.patient.immunizations as any}
    />
  );
}
