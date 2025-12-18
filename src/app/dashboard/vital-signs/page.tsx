import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import DoctorVitalSignsPage from '@/components/dashboard/doctor-vital-signs-page';
import { authOptions } from '@/lib/auth';

export default async function VitalSignsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors and nurses can access vital signs management
  if (
    session.user.role !== UserRole.DOCTOR &&
    session.user.role !== UserRole.NURSE
  ) {
    redirect('/dashboard');
  }

  return <DoctorVitalSignsPage />;
}
