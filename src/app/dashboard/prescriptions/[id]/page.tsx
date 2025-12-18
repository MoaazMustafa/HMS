import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import PrescriptionDetailPage from '@/components/dashboard/prescription-detail-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PrescriptionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  // For doctors
  if (session.user.role === UserRole.DOCTOR) {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      redirect('/login');
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
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
        diagnosis: {
          select: {
            icd10Code: true,
            description: true,
          },
        },
        interactions: true,
      },
    });

    if (!prescription) {
      redirect('/dashboard/prescriptions');
    }

    // Check if this doctor prescribed it
    if (prescription.doctorId !== doctor.id) {
      redirect('/dashboard/prescriptions');
    }

    return (
      <PrescriptionDetailPage prescription={prescription} userRole="DOCTOR" />
    );
  }

  // For patients
  if (session.user.role === UserRole.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient) {
      redirect('/login');
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
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
        diagnosis: {
          select: {
            icd10Code: true,
            description: true,
          },
        },
        interactions: true,
      },
    });

    if (!prescription) {
      redirect('/dashboard/prescriptions');
    }

    // Check if this is the patient's prescription
    if (prescription.patientId !== patient.id) {
      redirect('/dashboard/prescriptions');
    }

    return (
      <PrescriptionDetailPage prescription={prescription} userRole="PATIENT" />
    );
  }

  redirect('/login');
}
