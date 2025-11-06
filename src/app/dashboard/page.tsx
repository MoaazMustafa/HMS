import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import ComingSoon  from '@/components/sections/coming-soon';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background-900 via-muted-foreground to-background-900">
      <ComingSoon />
    </div>
  );
}
