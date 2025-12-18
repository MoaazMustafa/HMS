import type { Metadata } from 'next';

import { UserDetailPage } from '@/components/dashboard/user-detail-page';

export const metadata: Metadata = {
  title: 'Patient Profile - HMS Admin',
  description: 'View and manage patient profile',
};

export default function PatientDetailPage() {
  return <UserDetailPage role="patient" />;
}
