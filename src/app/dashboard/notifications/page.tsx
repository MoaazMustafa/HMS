import type { Metadata } from 'next';

import { NotificationsPage } from '@/components/dashboard/notifications-page';

export const metadata: Metadata = {
  title: 'Notifications - HMS',
  description: 'View and manage your notifications',
};

export default function NotificationsRoute() {
  return <NotificationsPage />;
}
