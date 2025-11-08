'use client';

import {
  Home,
  Calendar,
  Users,
  FileText,
  Pill,
  FlaskConical,
  User,
  Menu,
  X,
  LogOut,
  Activity,
  Clock,
  Settings,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const doctorMenuItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'My Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Sessions', href: '/dashboard/sessions', icon: Clock },
  { name: 'Medical Records', href: '/dashboard/medical-records', icon: FileText },
  { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
  { name: 'Lab Orders', href: '/dashboard/lab-orders', icon: FlaskConical },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Settings },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function DoctorSidebar() {
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
        className="fixed top-4 left-4 z-50 lg:hidden bg-background-900 border border-background-800 rounded-lg p-2 text-foreground"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border
          lg:sticky lg:top-0 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-sm font-semibold text-foreground">HMS</h1>
              <p className="text-[10px] text-muted-foreground">Doctor Portal</p>
            </div>
          </div>

          {/* User Info */}
          <div className="px-3 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                {session?.user?.name || 'Doctor'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {doctorMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium
                    ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-3 py-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start h-7"
            >
              <LogOut className="w-4 h-4 mr-2.5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
