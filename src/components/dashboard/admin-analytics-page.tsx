'use client';

import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Activity,
  Pill,
  Download,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportData } from '@/lib/export';

interface QuickStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  newPatients: number;
  activeUsers: number;
  activePrescriptions: number;
  newPrescriptions: number;
  labTestsOrdered: number;
  labTestsCompleted: number;
  totalRevenue: number;
  appointmentChange: number;
  userGrowth: number;
  prescriptionChange: number;
  revenueChange: number;
}

interface DailyAnalytic {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  newPatients: number;
  totalUsers: number;
  activePrescriptions: number;
  newPrescriptions: number;
  labTestsOrdered: number;
  labTestsCompleted: number;
  totalRevenue: number;
}

interface DepartmentAnalytic {
  name: string;
  totalPatients: number;
  totalAppointments: number;
  revenue: number;
  percentage: number;
}

interface TopItem {
  name: string;
  count: number;
}

interface AnalyticsData {
  quickStats: QuickStats;
  dailyAnalytics: DailyAnalytic[];
  departmentAnalytics: DepartmentAnalytic[];
  topMedications: TopItem[];
  topDiagnoses: TopItem[];
}

export function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAnalyticsData(result.data);
        }
      }
    } catch {
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (!analyticsData) return;

    const exportDataArray = [
      {
        metric: 'Total Appointments',
        value: analyticsData.quickStats.totalAppointments,
        change: `${analyticsData.quickStats.appointmentChange}%`,
        timeRange,
      },
      {
        metric: 'Active Users',
        value: analyticsData.quickStats.activeUsers,
        change: `${analyticsData.quickStats.userGrowth}%`,
        timeRange,
      },
      {
        metric: 'Active Prescriptions',
        value: analyticsData.quickStats.activePrescriptions,
        change: `${analyticsData.quickStats.prescriptionChange}%`,
        timeRange,
      },
      {
        metric: 'Total Revenue',
        value: `$${analyticsData.quickStats.totalRevenue.toFixed(2)}`,
        change: `${analyticsData.quickStats.revenueChange}%`,
        timeRange,
      },
    ];

    exportData(exportDataArray, 'analytics-report', format, {
      headers: [
        { key: 'metric', label: 'Metric' },
        { key: 'value', label: 'Value' },
        { key: 'change', label: 'Change' },
        { key: 'timeRange', label: 'Time Range' },
      ],
    });
  };

  const formatChartData = () => {
    if (!analyticsData?.dailyAnalytics) return [];
    
    return analyticsData.dailyAnalytics.map((day) => ({
      date: format(new Date(day.date), 'MMM dd'),
      appointments: day.totalAppointments,
      completed: day.completedAppointments,
      cancelled: day.cancelledAppointments,
      newPatients: day.newPatients,
      users: day.totalUsers,
      prescriptions: day.newPrescriptions,
      revenue: Number(day.totalRevenue),
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load analytics data</p>
          <Button onClick={fetchAnalytics}>Retry</Button>
        </div>
      </div>
    );
  }

  const chartData = formatChartData();

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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="relative group">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="absolute right-0 top-full hidden w-40 rounded-lg border border-border bg-card shadow-lg group-hover:block hover:block z-50">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-t-lg"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                Export as Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-b-lg"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Appointments',
            value: analyticsData.quickStats.totalAppointments.toLocaleString(),
            change: analyticsData.quickStats.appointmentChange,
            icon: Calendar,
            color: 'blue',
          },
          {
            label: 'Active Users',
            value: analyticsData.quickStats.activeUsers.toLocaleString(),
            change: analyticsData.quickStats.userGrowth,
            icon: Users,
            color: 'green',
          },
          {
            label: 'Active Prescriptions',
            value: analyticsData.quickStats.activePrescriptions.toLocaleString(),
            change: analyticsData.quickStats.prescriptionChange,
            icon: Pill,
            color: 'purple',
          },
          {
            label: 'Total Revenue',
            value: `$${analyticsData.quickStats.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            change: analyticsData.quickStats.revenueChange,
            icon: DollarSign,
            color: 'orange',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border-border rounded-lg border p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              <span className={`flex items-center gap-1 text-xs font-medium ${
                stat.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="text-foreground text-2xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appointments Trend Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Appointments Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#800000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground text-xs"
              />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#800000"
                fillOpacity={1}
                fill="url(#colorAppointments)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            User Growth & New Patients
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground text-xs"
              />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="newPatients"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="New Patients"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Appointment Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground text-xs"
              />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground text-xs"
              />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => 
                  typeof value === 'number' ? `$${value.toFixed(2)}` : '$0.00'
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Department Statistics
        </h3>
        <div className="space-y-4">
          {analyticsData.departmentAnalytics.length > 0 ? (
            analyticsData.departmentAnalytics.map((dept) => (
              <div key={dept.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="text-primary h-4 w-4" />
                    <span className="text-foreground text-sm font-medium">
                      {dept.name}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <span>{dept.totalPatients} patients</span>
                    <span>{dept.totalAppointments} appointments</span>
                  </div>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No department data available for this time range
            </p>
          )}
        </div>
      </div>

      {/* Popular Services */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Most Common Diagnoses
          </h3>
          <div className="space-y-3">
            {analyticsData.topDiagnoses.length > 0 ? (
              analyticsData.topDiagnoses.map((diagnosis, i) => (
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
              ))
            ) : (
              <p className="text-muted-foreground text-center text-sm py-4">
                No diagnosis data available for this time range
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Top Prescribed Medications
          </h3>
          <div className="space-y-3">
            {analyticsData.topMedications.length > 0 ? (
              analyticsData.topMedications.map((medication, i) => (
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
              ))
            ) : (
              <p className="text-muted-foreground text-center text-sm py-4">
                No medication data available for this time range
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
