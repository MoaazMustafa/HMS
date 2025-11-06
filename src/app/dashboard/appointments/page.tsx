import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { AppointmentsPage } from '@/components/dashboard/appointments-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PatientAppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.PATIENT) {
    redirect('/login');
  }

  // Fetch patient with all appointments
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: {
        include: {
          appointments: {
            include: {
              doctor: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              scheduledDate: 'desc',
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
    <AppointmentsPage
      appointments={user.patient.appointments as any}
      patientId={user.patient.id}
    />
  );
}
