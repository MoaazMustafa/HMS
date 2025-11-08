import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import LabTestDetailPage from '@/components/dashboard/lab-test-detail-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function LabResultDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  // For patients viewing lab results
  if (session.user.role === UserRole.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient) {
      redirect('/login');
    }

    const labTest = await prisma.labTest.findUnique({
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
      },
    });

    if (!labTest) {
      redirect('/dashboard/lab-results');
    }

    // Check if this is the patient's lab test
    if (labTest.patientId !== patient.id) {
      redirect('/dashboard/lab-results');
    }

    return <LabTestDetailPage labTest={labTest} userRole="PATIENT" />;
  }

  redirect('/login');
}
