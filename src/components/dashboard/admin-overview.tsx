'use client';

import {
  Users,
  Activity,
  Calendar,
  Pill,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  Shield,
  UserCog,
  ArrowRight,
  Database,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Lock,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalPatients: number;
    totalDoctors: number;
    totalNurses: number;
    totalAppointments: number;
    todayAppointments: number;
    activePrescriptions: number;
    pendingLabTests: number;
  };
  growth: {
    users: string;
  };
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
  }>;
  appointmentsByStatus: Record<string, number>;
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {
      // Error handled in UI
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      color: 'blue',
      trend: stats.growth.users,
    },
    {
      title: 'Patients',
      value: stats.overview.totalPatients,
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Doctors',
      value: stats.overview.totalDoctors,
      icon: UserCog,
      color: 'purple',
    },
    {
      title: 'Nurses',
      value: stats.overview.totalNurses,
      icon: Shield,
      color: 'teal',
    },
    {
      title: 'Appointments',
      value: stats.overview.totalAppointments,
      icon: Calendar,
      color: 'orange',
    },
    {
      title: 'Today Appointments',
      value: stats.overview.todayAppointments,
      icon: Clock,
      color: 'red',
    },
    {
      title: 'Active Prescriptions',
      value: stats.overview.activePrescriptions,
      icon: Pill,
      color: 'indigo',
    },
    {
      title: 'Pending Lab Tests',
      value: stats.overview.pendingLabTests,
      icon: AlertCircle,
      color: 'yellow',
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage all system users',
      icon: Users,
      href: '/dashboard/admin/users',
      color: 'blue',
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
      color: 'purple',
    },
    {
      title: 'Audit Logs',
      description: 'Review system activity',
      icon: FileText,
      href: '/dashboard/admin/audit-logs',
      color: 'orange',
    },
    {
      title: 'Database',
      description: 'Database management',
      icon: Database,
      href: '/dashboard/admin/database',
      color: 'green',
    },
    {
      title: 'Security',
      description: 'Security settings',
      icon: Lock,
      href: '/dashboard/admin/security',
      color: 'red',
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      href: '/dashboard/admin/settings',
      color: 'gray',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            System overview and management
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-lg p-2 bg-${stat.color}-500/10`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-500`} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1">
                    {parseFloat(stat.trend) > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-medium text-green-500">
                          {stat.trend}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-medium text-red-500">
                          {stat.trend}%
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-card border-border rounded-lg border p-4">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Recent Users
          </h2>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="border-border flex items-center justify-between border-b py-2 last:border-0"
              >
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {user.name || user.email}
                  </p>
                  <p className="text-muted-foreground text-xs">{user.role}</p>
                </div>
                <p className="text-muted-foreground text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Status */}
        <div className="bg-card border-border rounded-lg border p-4">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            Appointment Status
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.appointmentsByStatus).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="border-border flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {status === 'COMPLETED' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {status === 'SCHEDULED' && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {status === 'CANCELLED' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <p className="text-foreground text-sm font-medium">
                      {status.replace('_', ' ')}
                    </p>
                  </div>
                  <p className="text-foreground text-sm font-bold">{count}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-all hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className={`rounded-lg p-2 bg-${action.color}-500/10`}>
                    <Icon className={`h-5 w-5 text-${action.color}-500`} />
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
                </div>
                <h3 className="text-foreground mb-1 font-semibold">
                  {action.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            System Health
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-muted-foreground text-xs">
              All Systems Operational
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium text-green-500">API Status</p>
            </div>
            <p className="text-muted-foreground text-xs">Operational</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-1 flex-1 rounded-full">
                <div
                  className="h-1 rounded-full bg-green-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <span className="text-muted-foreground text-[10px]">100%</span>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium text-green-500">Database</p>
            </div>
            <p className="text-muted-foreground text-xs">Connected</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-1 flex-1 rounded-full">
                <div
                  className="h-1 rounded-full bg-green-500"
                  style={{ width: '98%' }}
                ></div>
              </div>
              <span className="text-muted-foreground text-[10px]">98%</span>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium text-green-500">Uptime</p>
            </div>
            <p className="text-muted-foreground text-xs">99.9%</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-1 flex-1 rounded-full">
                <div
                  className="h-1 rounded-full bg-green-500"
                  style={{ width: '99.9%' }}
                ></div>
              </div>
              <span className="text-muted-foreground text-[10px]">99.9%</span>
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium text-blue-500">Performance</p>
            </div>
            <p className="text-muted-foreground text-xs">Excellent</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-muted h-1 flex-1 rounded-full">
                <div
                  className="h-1 rounded-full bg-blue-500"
                  style={{ width: '95%' }}
                ></div>
              </div>
              <span className="text-muted-foreground text-[10px]">95%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Doctors Section */}
        <Link
          href="/dashboard/admin/doctors"
          className="group bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-all hover:shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Stethoscope className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  Doctors Management
                </h3>
                <p className="text-muted-foreground text-xs">
                  Manage doctor profiles
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {stats.overview.totalDoctors}
          </div>
        </Link>

        {/* Nurses Section */}
        <Link
          href="/dashboard/admin/nurses"
          className="group bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-all hover:shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-500/10 p-2">
                <Shield className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  Nurses Management
                </h3>
                <p className="text-muted-foreground text-xs">
                  Manage nurse profiles
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {stats.overview.totalNurses}
          </div>
        </Link>

        {/* Patients Section */}
        <Link
          href="/dashboard/admin/patients"
          className="group bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-all hover:shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  Patients Management
                </h3>
                <p className="text-muted-foreground text-xs">
                  View patient records
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {stats.overview.totalPatients}
          </div>
        </Link>

        {/* Notifications Section */}
        <Link
          href="/dashboard/admin/notifications"
          className="group bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-all hover:shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Bell className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Notifications</h3>
                <p className="text-muted-foreground text-xs">
                  Broadcast messages
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
          </div>
          <div className="text-foreground text-sm font-medium">
            Send Announcements
          </div>
        </Link>
      </div>
    </div>
  );
}
