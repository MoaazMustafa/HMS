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
                  user: {
                    select: {
                      id: true,
                      email: true,
                    },
                  },
                },
              },
              billing: true,
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

  // Convert appointments with proper fee handling
  const appointments = user.patient.appointments.map((apt) => {
    // Get fee from billing, customFee, or doctor's defaultAppointmentFee
    const feeValue = apt.billing?.amount 
      ? apt.billing.amount 
      : apt.customFee 
      ? apt.customFee 
      : apt.doctor.defaultAppointmentFee;
    
    return {
      ...apt,
      fee: typeof feeValue === 'number' ? feeValue : feeValue.toNumber(),
      scheduledTime: apt.startTime, // Use startTime as scheduledTime for display
    };
  });

  return <AppointmentsPage appointments={appointments as any} patientId={user.patient.id} />;
}
