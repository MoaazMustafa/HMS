import type { Metadata } from 'next';

import { AdminOverview } from '@/components/dashboard/admin-overview';

export const metadata: Metadata = {
  title: 'Admin Dashboard - HMS',
  description:
    'Comprehensive system management dashboard for HMS administrators',
};

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
