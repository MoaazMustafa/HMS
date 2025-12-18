import { UserDetailPage } from '@/components/dashboard/user-detail-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nurse Profile - HMS Admin',
  description: 'View and manage nurse profile',
};

export default function NurseDetailPage() {
  return <UserDetailPage role="nurse" />;
}
