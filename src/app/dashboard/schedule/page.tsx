import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorSchedulePage } from '@/components/dashboard/doctor-schedule-page';
import { authOptions } from '@/lib/auth';

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Only doctors can access this page
  if (session.user.role !== UserRole.DOCTOR) {
    redirect('/dashboard');
  }

  return <DoctorSchedulePage />;
}
