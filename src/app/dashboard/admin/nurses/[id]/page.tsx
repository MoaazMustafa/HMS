import type { Metadata } from 'next';

import { UserDetailPage } from '@/components/dashboard/user-detail-page';

export const metadata: Metadata = {
  title: 'Nurse Profile - HMS Admin',
  description: 'View and manage nurse profile',
};

export default function NurseDetailPage() {
  return <UserDetailPage role="nurse" />;
}
