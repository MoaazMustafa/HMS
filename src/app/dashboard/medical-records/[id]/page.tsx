import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { MedicalRecordDetailPage } from '@/components/dashboard/medical-record-detail-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function MedicalRecordDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    redirect('/login');
  }

  // For doctors
  if (session.user.role === UserRole.DOCTOR) {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      redirect('/login');
    }

    const record = await prisma.medicalRecord.findUnique({
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
        diagnoses: true,
      },
    });

    if (!record) {
      redirect('/dashboard/medical-records');
    }

    // Check if doctor has access to this patient
    const hasAccess = record.doctorId === doctor.id;

    if (!hasAccess) {
      redirect('/dashboard/medical-records');
    }

    return <MedicalRecordDetailPage record={record} userRole="DOCTOR" />;
  }

  // For patients
  if (session.user.role === UserRole.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient) {
      redirect('/login');
    }

    const record = await prisma.medicalRecord.findUnique({
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
        diagnoses: true,
      },
    });

    if (!record) {
      redirect('/dashboard/medical-records');
    }

    // Check if this is the patient's record and it's signed
    if (record.patientId !== patient.id || !record.isSigned) {
      redirect('/dashboard/medical-records');
    }

    return <MedicalRecordDetailPage record={record} userRole="PATIENT" />;
  }

  redirect('/dashboard');
}
