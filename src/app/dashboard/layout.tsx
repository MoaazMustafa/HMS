import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ThemeProvider } from '@/components/theme-provider';
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

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-white">HMS Dashboard</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Welcome back,</p>
                  <p className="text-sm font-semibold text-white">{session.user.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                    {session.user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}
