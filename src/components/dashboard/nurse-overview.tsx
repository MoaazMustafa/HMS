'use client';

import { format } from 'date-fns';
import {
  Activity,
  Calendar,
  Heart,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NurseOverviewProps {
  stats: {
    patientsToday: number;
    vitalSignsRecorded: number;
    upcomingAppointments: number;
  };
  recentVitalSigns: Array<{
    id: string;
    recordedAt: Date;
    status: string;
    patient: {
      user: {
        name: string;
      };
      patientId: string;
    };
  }>;
  upcomingAppointments: Array<{
    id: string;
    scheduledDate: Date;
    status: string;
    patient: {
      user: {
        name: string;
      };
      patientId: string;
    };
    doctor: {
      user: {
        name: string;
      };
      specialization: string;
    };
  }>;
}

export default function NurseOverview({
  stats,
  recentVitalSigns,
  upcomingAppointments,
}: NurseOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ABNORMAL':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s today&apos;s overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Patients Today</p>
              <p className="text-3xl font-bold">{stats.patientsToday}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Vital Signs Recorded
              </p>
              <p className="text-3xl font-bold">{stats.vitalSignsRecorded}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Upcoming Appointments
              </p>
              <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/dashboard/vital-signs">
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-2 py-3"
            >
              <Activity className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Record Vital Signs</div>
                <div className="text-muted-foreground text-xs">
                  Record patient vitals
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/patients">
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-2 py-3"
            >
              <Users className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">View Patients</div>
                <div className="text-muted-foreground text-xs">
                  Patient records
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/appointments">
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-2 py-3"
            >
              <Calendar className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">View Appointments</div>
                <div className="text-muted-foreground text-xs">
                  Today&apos;s schedule
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Vital Signs */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Vital Signs</h2>
            <Link href="/dashboard/vital-signs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentVitalSigns.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No vital signs recorded today</p>
              </div>
            ) : (
              recentVitalSigns.map((vital) => (
                <div
                  key={vital.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500/10 p-2">
                      <Heart className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {vital.patient.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ID: {vital.patient.patientId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(vital.status)}`}
                    >
                      {vital.status}
                    </Badge>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {format(new Date(vital.recordedAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/10 p-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.patient.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Dr. {appointment.doctor.user.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(appointment.scheduledDate), 'HH:mm')}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
