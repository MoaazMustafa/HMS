import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { ProfilePage } from '@/components/dashboard/profile-page';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PatientProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.PATIENT) {
    redirect('/login');
  }

  // Fetch user with patient data
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      patient: true,
    },
  });

  if (!userData?.patient) {
    redirect('/login');
  }

  return <ProfilePage userData={userData as any} />;
}
