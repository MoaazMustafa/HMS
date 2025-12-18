import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import PatientHealthRecordsPage from '@/components/dashboard/patient-health-records-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function HealthRecordsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only patients can access this page
  if (session.user.role !== UserRole.PATIENT) {
    redirect('/dashboard');
  }

  // Fetch patient's health data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: {
        include: {
          vitalSigns: {
            orderBy: { recordedAt: 'desc' },
            take: 20,
          },
          allergies: {
            orderBy: { diagnosedAt: 'desc' },
          },
          immunizations: {
            orderBy: { dateAdministered: 'desc' },
          },
        },
      },
    },
  });

  if (!user || !user.patient) {
    redirect('/dashboard');
  }

  return (
    <PatientHealthRecordsPage
      vitalSigns={user.patient.vitalSigns as never}
      allergies={user.patient.allergies as never}
      immunizations={user.patient.immunizations as never}
    />
  );
}
