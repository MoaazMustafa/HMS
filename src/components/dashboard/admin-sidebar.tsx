'use client';

import {
  Home,
  Users,
  Shield,
  Settings,
  Activity,
  FileText,
  Menu,
  X,
  LogOut,
  UserCog,
  BarChart3,
  Database,
  Bell,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const adminMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
  { name: 'Doctors', href: '/dashboard/admin/doctors', icon: UserCog },
  { name: 'Nurses', href: '/dashboard/admin/nurses', icon: Shield },
  { name: 'Patients', href: '/dashboard/admin/patients', icon: Activity },
  { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: FileText },
  {
    name: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
  },
  { name: 'Database', href: '/dashboard/admin/database', icon: Database },
  { name: 'Notifications', href: '/dashboard/admin/notifications', icon: Bell },
  { name: 'Security', href: '/dashboard/admin/security', icon: Lock },
];

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="bg-background-900 border-background-800 text-foreground fixed top-4 left-4 z-50 rounded-lg border p-2 lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-card border-border fixed top-0 left-0 z-40 h-screen w-64 border-r transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <Link href={'/'}>
            <div className="border-border flex items-center gap-2.5 border-b px-4 py-3">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <h1 className="text-foreground text-sm font-semibold">HMS</h1>
                <p className="text-muted-foreground text-[10px]">
                  Admin Portal
                </p>
              </div>
            </div>
          </Link>

          {/* User Info */}
          <div className="border-border border-b px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                <Shield className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-medium">
                  {session?.user?.name || 'Administrator'}
                </p>
                <p className="text-muted-foreground truncate text-[10px]">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border border-red-500/20 bg-red-500/10 text-red-500'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-border border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2.5 text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
