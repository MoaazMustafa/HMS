import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { PrescriptionsPage } from '@/components/dashboard/prescriptions-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PatientPrescriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.PATIENT) {
    redirect('/login');
  }

  // Fetch patient with prescriptions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: {
        include: {
          prescriptions: {
            include: {
              doctor: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              issuedAt: 'desc',
            },
          },
        },
      },
    },
  });

  if (!user?.patient) {
    redirect('/login');
  }

  return <PrescriptionsPage prescriptions={user.patient.prescriptions as any} />;
}
