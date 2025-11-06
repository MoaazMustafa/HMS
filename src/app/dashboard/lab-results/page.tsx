import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { LabResultsPage } from '@/components/dashboard/lab-results-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PatientLabResultsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.PATIENT) {
    redirect('/login');
  }

  // Fetch patient with lab tests
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: {
        include: {
          labTests: {
            where: {
              reviewedAt: {
                not: null,
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
              orderedAt: 'desc',
            },
          },
        },
      },
    },
  });

  if (!user?.patient) {
    redirect('/login');
  }

  return <LabResultsPage labTests={user.patient.labTests as any} />;
}
