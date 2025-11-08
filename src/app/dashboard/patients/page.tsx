import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorPatientsPage } from '@/components/dashboard/doctor-patients-page';
import { authOptions } from '@/lib/auth';

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors can access this page
  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard');
  }

  return <DoctorPatientsPage />;
}
