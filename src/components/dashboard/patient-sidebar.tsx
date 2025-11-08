'use client';

import {
  Home,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  User,
  Menu,
  X,
  LogOut,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const patientMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  {
    name: 'Medical Records',
    href: '/dashboard/medical-records',
    icon: FileText,
  },
  { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
  { name: 'Lab Results', href: '/dashboard/lab-results', icon: FlaskConical },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function PatientSidebar() {
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
              <Activity className="text-primary h-5 w-5" />
              <div>
                <h1 className="text-foreground text-sm font-semibold">HMS</h1>
                <p className="text-muted-foreground text-[10px]">
                  Patient Portal
                </p>
              </div>
            </div>
          </Link>

          {/* User Info */}
          <div className="border-border border-b px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-muted border-border flex h-7 w-7 items-center justify-center rounded-full border">
                <User className="text-muted-foreground h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-medium">
                  {session?.user?.name || 'Patient'}
                </p>
                <p className="text-muted-foreground truncate text-[10px]">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
            {patientMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  } `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-border border-t px-3 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-7 w-full justify-start"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
