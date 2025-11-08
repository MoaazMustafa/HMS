import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import DoctorLabTestsPage from '@/components/dashboard/doctor-lab-tests-page';
import { authOptions } from '@/lib/auth';

export default async function LabOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors can access lab orders management
  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard');
  }

  return <DoctorLabTestsPage />;
}
