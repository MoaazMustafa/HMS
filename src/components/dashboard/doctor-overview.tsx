'use client';

import type { Decimal } from '@prisma/client/runtime/library';
import {
  Calendar,
  Users,
  Clock,
  Eye,
  ChevronRight,
  Stethoscope,
  Pill,
  FlaskConical,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string | null;
  licenseNumber: string;
  phone: string;
  isActive: boolean;
  defaultAppointmentFee: Decimal;
  defaultSessionFee: Decimal;
  appointments: Array<{
    id: string;
    scheduledDate: Date;
    startTime: string;
    endTime: string;
    status: string;
    type: string | null;
    patient: {
      id: string;
      patientId: string;
      user: {
        name: string | null;
        email: string;
      };
    };
  }>;
  sessions: Array<{
    id: string;
    scheduledDate: Date;
    startTime: string;
    endTime: string;
    status: string;
    patient: {
      id: string;
      patientId: string;
      user: {
        name: string | null;
        email: string;
      };
    };
  }>;
  patientAssignments: Array<{
    status: string;
    patient: {
      id: string;
      patientId: string;
      user: {
        name: string | null;
      };
    };
  }>;
  prescriptions: Array<{
    id: string;
    status: string;
  }>;
  labTests: Array<{
    id: string;
    status: string;
  }>;
}

interface DoctorOverviewProps {
  doctor: DoctorData;
}

export function DoctorOverview({ doctor }: DoctorOverviewProps) {
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming'>('today');

  // Calculate stats
  const activePatients = doctor.patientAssignments.filter(
    (assignment) => assignment.status === 'ACTIVE'
  ).length;

  const todayAppointments = doctor.appointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledDate);
    const today = new Date();
    return (
      aptDate.toDateString() === today.toDateString() &&
      ['SCHEDULED', 'CONFIRMED'].includes(apt.status)
    );
  });

  const upcomingAppointments = doctor.appointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledDate);
    const today = new Date();
    return aptDate > today && ['SCHEDULED', 'CONFIRMED'].includes(apt.status);
  });

  const todaySessions = doctor.sessions.filter((session) => {
    const sessionDate = new Date(session.scheduledDate);
    const today = new Date();
    return (
      sessionDate.toDateString() === today.toDateString() &&
      ['SCHEDULED', 'IN_PROGRESS'].includes(session.status)
    );
  });

  const activePrescriptions = doctor.prescriptions.filter(
    (prescription) => prescription.status === 'ACTIVE'
  ).length;

  const pendingLabTests = doctor.labTests.filter(
    (test) => test.status === 'PENDING' || test.status === 'IN_PROGRESS'
  ).length;

  const stats = [
    {
      icon: Users,
      label: 'Active Patients',
      value: activePatients.toString(),
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/20',
      href: '/dashboard/patients',
    },
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: todayAppointments.length.toString(),
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500',
      borderColor: 'border-green-500/20',
      href: '/dashboard/appointments',
    },
    {
      icon: Clock,
      label: "Today's Sessions",
      value: todaySessions.length.toString(),
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
      href: '/dashboard/sessions',
    },
    {
      icon: Pill,
      label: 'Active Prescriptions',
      value: activePrescriptions.toString(),
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      borderColor: 'border-orange-500/20',
      href: '/dashboard/prescriptions',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      SCHEDULED: { variant: 'default', label: 'Scheduled' },
      CONFIRMED: { variant: 'default', label: 'Confirmed' },
      COMPLETED: { variant: 'secondary', label: 'Completed' },
      CANCELLED: { variant: 'destructive', label: 'Cancelled' },
      NO_SHOW: { variant: 'destructive', label: 'No Show' },
    };

    const badgeInfo = statusMap[status] || { variant: 'outline' as const, label: status };
    return (
      <Badge variant={badgeInfo.variant} className="text-[10px] px-1.5 py-0">
        {badgeInfo.label}
      </Badge>
    );
  };

  const formatTime = (timeString: string) => {
    // Assuming format is "HH:MM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, Dr. {doctor.lastName}!
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {doctor.specialization ? `${doctor.specialization} Specialist` : 'General Practice'} •{' '}
              License: {doctor.licenseNumber}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Stethoscope className="w-3 h-3 mr-1" />
                {doctor.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {activePatients} Active Patients
              </Badge>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <div
                className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bgColor} p-2 rounded-md`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/patients">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <Users className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold text-sm">Search Patients</div>
              <div className="text-xs text-muted-foreground">Find patient records by ID or name</div>
            </div>
          </Button>
        </Link>
        <Link href="/dashboard/lab-orders">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <FlaskConical className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-semibold text-sm">
                Pending Lab Results ({pendingLabTests})
              </div>
              <div className="text-xs text-muted-foreground">Review and approve test results</div>
            </div>
          </Button>
        </Link>
      </div>

      {/* Today's Schedule */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Today&apos;s Schedule</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTab('today')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedTab === 'today'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedTab('upcoming')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedTab === 'upcoming'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {selectedTab === 'today' ? (
            <>
              {/* Today's Appointments */}
              {todayAppointments.length === 0 && todaySessions.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No appointments or sessions today</p>
                </div>
              ) : (
                <>
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground">
                                {appointment.patient.user.name || 'Unknown Patient'}
                              </p>
                              <Badge variant="outline" className="text-[10px]">
                                {appointment.patient.patientId}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {appointment.type || 'Appointment'} • {formatTime(appointment.startTime)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.patient.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status)}
                          <Link href={`/dashboard/appointments`}>
                            <Button variant="ghost" size="sm" className="h-7">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Today's Sessions */}
                  {todaySessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground">
                                {session.patient.user.name || 'Unknown Patient'}
                              </p>
                              <Badge variant="outline" className="text-[10px]">
                                {session.patient.patientId}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px]">
                                Session
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Follow-up Session • {formatTime(session.startTime)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.patient.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(session.status)}
                          <Link href={`/dashboard/sessions`}>
                            <Button variant="ghost" size="sm" className="h-7">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {/* Upcoming Appointments */}
              {upcomingAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                </div>
              ) : (
                <>
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground">
                                {appointment.patient.user.name || 'Unknown Patient'}
                              </p>
                              <Badge variant="outline" className="text-[10px]">
                                {appointment.patient.patientId}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {appointment.type || 'Appointment'} • {formatDate(appointment.scheduledDate)}{' '}
                              at {formatTime(appointment.startTime)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.patient.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status)}
                          <Link href={`/dashboard/appointments`}>
                            <Button variant="ghost" size="sm" className="h-7">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {selectedTab === 'upcoming' && upcomingAppointments.length > 0 && (
          <div className="p-3 border-t border-border">
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="w-full">
                View All Appointments
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
