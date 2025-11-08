import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorProfilePage } from '@/components/dashboard/doctor-profile-page';
import { ProfilePage } from '@/components/dashboard/profile-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Patient Profile
  if (session.user.role === UserRole.PATIENT) {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        patient: true,
      },
    });

    if (!userData?.patient) {
      redirect('/login');
    }

    return (
      <ProfilePage
        userData={{
          id: userData.id,
          email: userData.email,
          createdAt: userData.createdAt,
          patient: userData.patient,
        }}
      />
    );
  }

  // Doctor Profile
  if (session.user.role === UserRole.DOCTOR) {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!doctor) {
      redirect('/login');
    }

    return <DoctorProfilePage />;
  }

  // Other roles - redirect for now
  redirect('/dashboard');
}
