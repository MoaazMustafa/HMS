import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorSessionsPage } from '@/components/dashboard/doctor-sessions-page';
import { authOptions } from '@/lib/auth';

export default async function SessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors can view sessions
  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard');
  }

  return <DoctorSessionsPage />;
}
