import { UserDetailPage } from '@/components/dashboard/user-detail-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Profile - HMS Admin',
  description: 'View and manage patient profile',
};

export default function PatientDetailPage() {
  return <UserDetailPage role="patient" />;
}
