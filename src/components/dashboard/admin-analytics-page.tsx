'use client';

import {
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Pill,
  FileText,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface AnalyticsData {
  quickStats: {
    totalAppointments: number;
    activeUsers: number;
    prescriptions: number;
    medicalRecords: number;
  };
  appointmentsTrend: number[];
  userGrowth: number[];
}

export function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData({
          quickStats: {
            totalAppointments: data.overview.totalAppointments,
            activeUsers: data.overview.totalUsers,
            prescriptions: data.overview.activePrescriptions,
            medicalRecords: data.overview.totalPatients * 2, // Approximate
          },
          appointmentsTrend: [40, 65, 45, 80, 55, 70, 85],
          userGrowth: [30, 45, 55, 50, 70, 85, 95],
        });
      }
    } catch {
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            System performance and usage statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-background border-border text-foreground focus:ring-primary rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Appointments',
            value: analyticsData?.quickStats.totalAppointments.toLocaleString() || '0',
            change: '+12%',
            icon: Calendar,
            color: 'blue',
          },
          {
            label: 'Active Users',
            value: analyticsData?.quickStats.activeUsers.toLocaleString() || '0',
            change: '+8%',
            icon: Users,
            color: 'green',
          },
          {
            label: 'Prescriptions',
            value: analyticsData?.quickStats.prescriptions.toLocaleString() || '0',
            change: '+15%',
            icon: Pill,
            color: 'purple',
          },
          {
            label: 'Medical Records',
            value: analyticsData?.quickStats.medicalRecords.toLocaleString() || '0',
            change: '+20%',
            icon: FileText,
            color: 'orange',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border-border rounded-lg border p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-foreground text-2xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appointments Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Appointments Trend
          </h3>
          <div className="flex h-64 items-end justify-around gap-2">
            {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 w-full cursor-pointer rounded-t transition-colors"
                  style={{ height: `${height}%` }}
                />
                <span className="text-muted-foreground text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            User Growth
          </h3>
          <div className="flex h-64 items-end justify-around gap-2">
            {[30, 45, 55, 50, 70, 85, 95].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full cursor-pointer rounded-t bg-green-500/20 transition-colors hover:bg-green-500/30"
                  style={{ height: `${height}%` }}
                />
                <span className="text-muted-foreground text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Department Statistics
        </h3>
        <div className="space-y-4">
          {[
            {
              name: 'Cardiology',
              patients: 234,
              appointments: 156,
              percentage: 85,
            },
            {
              name: 'Neurology',
              patients: 189,
              appointments: 134,
              percentage: 70,
            },
            {
              name: 'Orthopedics',
              patients: 267,
              appointments: 198,
              percentage: 95,
            },
            {
              name: 'Pediatrics',
              patients: 312,
              appointments: 245,
              percentage: 78,
            },
          ].map((dept) => (
            <div key={dept.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="text-primary h-4 w-4" />
                  <span className="text-foreground text-sm font-medium">
                    {dept.name}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span>{dept.patients} patients</span>
                  <span>{dept.appointments} appointments</span>
                </div>
              </div>
              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Most Common Diagnoses
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Hypertension', count: 156 },
              { name: 'Diabetes Type 2', count: 143 },
              { name: 'Common Cold', count: 128 },
              { name: 'Anxiety Disorder', count: 98 },
              { name: 'Back Pain', count: 87 },
            ].map((diagnosis, i) => (
              <div
                key={diagnosis.name}
                className="border-border flex items-center justify-between border-b py-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-bold">
                    #{i + 1}
                  </span>
                  <span className="text-foreground text-sm">
                    {diagnosis.name}
                  </span>
                </div>
                <span className="text-foreground text-sm font-medium">
                  {diagnosis.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Top Prescribed Medications
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Lisinopril', count: 234 },
              { name: 'Metformin', count: 198 },
              { name: 'Amoxicillin', count: 176 },
              { name: 'Atorvastatin', count: 145 },
              { name: 'Omeprazole', count: 132 },
            ].map((medication, i) => (
              <div
                key={medication.name}
                className="border-border flex items-center justify-between border-b py-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-bold">
                    #{i + 1}
                  </span>
                  <span className="text-foreground text-sm">
                    {medication.name}
                  </span>
                </div>
                <span className="text-foreground text-sm font-medium">
                  {medication.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
