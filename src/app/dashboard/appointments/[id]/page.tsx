import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { AppointmentDetailPage } from '@/components/dashboard/appointment-detail-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { id: appointmentId } = await params;

  // Fetch appointment with full details
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      doctor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      billing: true,
    },
  });

  if (!appointment) {
    redirect('/dashboard/appointments');
  }

  // Check authorization - patient can only see their own appointments
  if (session.user.role === UserRole.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient || appointment.patientId !== patient.id) {
      redirect('/dashboard/appointments');
    }
  }

  // Check authorization - doctor can only see their own appointments
  if (session.user.role === UserRole.DOCTOR) {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor || appointment.doctorId !== doctor.id) {
      redirect('/dashboard/appointments');
    }
  }

  // Convert Decimal fields to numbers for client component
  const serializedAppointment = {
    ...appointment,
    customFee: appointment.customFee ? appointment.customFee.toNumber() : null,
    doctor: {
      ...appointment.doctor,
      defaultAppointmentFee: appointment.doctor.defaultAppointmentFee.toNumber(),
      defaultSessionFee: appointment.doctor.defaultSessionFee.toNumber(),
    },
    billing: appointment.billing
      ? {
          ...appointment.billing,
          amount: appointment.billing.amount.toNumber(),
        }
      : null,
  };

  return (
    <AppointmentDetailPage
      appointment={serializedAppointment}
      userRole={session.user.role}
      userId={session.user.id}
    />
  );
}
