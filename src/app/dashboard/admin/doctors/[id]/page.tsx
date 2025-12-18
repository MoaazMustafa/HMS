import { UserDetailPage } from '@/components/dashboard/user-detail-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doctor Profile - HMS Admin',
  description: 'View and manage doctor profile',
};

export default function DoctorDetailPage() {
  return <UserDetailPage role="doctor" />;
}
