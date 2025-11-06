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
  { name: 'Medical Records', href: '/dashboard/medical-records', icon: FileText },
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
        className="fixed top-4 left-4 z-50 lg:hidden bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white"
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
          fixed top-0 left-0 z-40 w-72 h-screen bg-zinc-950 border-r border-zinc-800
          lg:sticky lg:top-0 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
            <Activity className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">HMS</h1>
              <p className="text-xs text-zinc-500">Patient Portal</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name || 'Patient'}
                </p>
                <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {patientMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-zinc-800">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
