import type { Metadata } from 'next';

import { UserDetailPage } from '@/components/dashboard/user-detail-page';

export const metadata: Metadata = {
  title: 'Doctor Profile - HMS Admin',
  description: 'View and manage doctor profile',
};

export default function DoctorDetailPage() {
  return <UserDetailPage role="doctor" />;
}
