import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { PatientSidebar } from '@/components/dashboard/patient-sidebar';
import { authOptions } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Patient-specific layout
  if (session.user.role === UserRole.PATIENT) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          <PatientSidebar />
          <main className="flex-1 min-h-screen">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
              <div className="px-4 lg:px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 ml-12 lg:ml-0">
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        Welcome back, {session.user.name?.split(' ')[0]}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Manage your health records and appointments
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded border border-border">
                      Patient
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Default layout for other roles (coming soon)
  return (
    <div className="min-h-screen bg-linear-to-br from-background-900 via-black to-background-900">
      <header className="sticky top-0 z-50 w-full border-b border-background-800 bg-background-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">HMS Dashboard</h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-background-400">Welcome, {session.user.name}</p>
              <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                {session.user.role}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
