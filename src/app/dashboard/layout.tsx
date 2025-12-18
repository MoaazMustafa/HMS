import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { DoctorSidebar } from '@/components/dashboard/doctor-sidebar';
import { NurseSidebar } from '@/components/dashboard/nurse-sidebar';
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
      <div className="bg-background min-h-screen">
        <div className="flex min-h-screen">
          <PatientSidebar />
          <main className="min-h-screen flex-1">
            {/* Top Bar */}
            <div className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-xl">
              <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                  <div className="ml-12 flex items-center gap-3 lg:ml-0">
                    <div>
                      <h2 className="text-foreground text-sm font-semibold">
                        Welcome back, {session.user.name?.split(' ')[0]}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        Manage your health records and appointments
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="bg-muted text-muted-foreground border-border rounded border px-2 py-0.5 text-[10px] font-medium">
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

  // Doctor-specific layout
  if (session.user.role === UserRole.DOCTOR) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex min-h-screen">
          <DoctorSidebar />
          <main className="min-h-screen flex-1">
            {/* Top Bar */}
            <div className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-xl">
              <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                  <div className="ml-12 flex items-center gap-3 lg:ml-0">
                    <div>
                      <h2 className="text-foreground text-sm font-semibold">
                        Dr.{' '}
                        {session.user.name?.split(' ')[1] || session.user.name}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        Manage patients, appointments, and medical records
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="bg-primary/10 text-primary border-primary/20 rounded border px-2 py-0.5 text-[10px] font-medium">
                      Doctor
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

  // Nurse-specific layout
  if (session.user.role === UserRole.NURSE) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex min-h-screen">
          <NurseSidebar />
          <main className="min-h-screen flex-1">
            {/* Top Bar */}
            <div className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-xl">
              <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                  <div className="ml-12 flex items-center gap-3 lg:ml-0">
                    <div>
                      <h2 className="text-foreground text-sm font-semibold">
                        {session.user.name}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        Record vital signs and support patient care
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500">
                      Nurse
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

  // Admin-specific layout
  if (
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.MAIN_ADMIN
  ) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="min-h-screen flex-1">
            {/* Top Bar */}
            <div className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-xl">
              <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                  <div className="ml-12 flex items-center gap-3 lg:ml-0">
                    <div>
                      <h2 className="text-foreground text-sm font-semibold">
                        {session.user.name}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        System administrator with full access
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">
                      {session.user.role === UserRole.MAIN_ADMIN
                        ? 'Main Admin'
                        : 'Admin'}
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
    <div className="from-background-900 to-background-900 min-h-screen bg-linear-to-br via-black">
      <header className="border-background-800 bg-background-900/50 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">HMS Dashboard</h2>
            <div className="flex items-center gap-4">
              <p className="text-background-400 text-sm">
                Welcome, {session.user.name}
              </p>
              <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-semibold">
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
