import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DoctorPatientsPage } from '@/components/dashboard/doctor-patients-page';
import NursePatientsPage from '@/components/dashboard/nurse-patients-page';
import { authOptions } from '@/lib/auth';

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Nurses can view patients (read-only)
  if (session.user.role === UserRole.NURSE) {
    return <NursePatientsPage />;
  }

  // Doctors can manage patients
  if (session.user.role === UserRole.DOCTOR) {
    return <DoctorPatientsPage />;
  }

  // Other roles not allowed
  redirect('/dashboard');
}
