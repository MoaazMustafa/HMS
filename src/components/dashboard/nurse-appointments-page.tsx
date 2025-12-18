'use client';

import type { Decimal } from '@prisma/client/runtime/library';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  Eye,
  Filter,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AppointmentData {
  id: string;
  appointmentId: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  type: string | null;
  reason: string | null;
  status: string;
  customFee: Decimal | null;
  patient: {
    id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    user: {
      name: string | null;
      email: string;
      phoneNumber: string | null;
    };
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
}

type StatusFilter =
  | 'ALL'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export default function NurseAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentData[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'upcoming' | 'past'
  >('today');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filterAppointments = () => {
      let filtered = appointments;

      // Filter by status
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter((a) => a.status === statusFilter);
      }

      // Filter by specific date
      if (selectedDate) {
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        const nextDay = new Date(selected);
        nextDay.setDate(nextDay.getDate() + 1);

        filtered = filtered.filter((a) => {
          const aptDate = new Date(a.scheduledDate);
          return aptDate >= selected && aptDate < nextDay;
        });
      }
      // Filter by date range
      else {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (dateFilter) {
          case 'today':
            filtered = filtered.filter((a) => {
              const aptDate = new Date(a.scheduledDate);
              return aptDate >= today && aptDate < tomorrow;
            });
            break;
          case 'upcoming':
            filtered = filtered.filter(
              (a) => new Date(a.scheduledDate) >= today,
            );
            break;
          case 'past':
            filtered = filtered.filter(
              (a) => new Date(a.scheduledDate) < today,
            );
            break;
        }
      }

      // Sort by date and time
      filtered.sort((a, b) => {
        const dateCompare =
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      setFilteredAppointments(filtered);
    };

    filterAppointments();
  }, [appointments, statusFilter, dateFilter, selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      } else {
        setError(result.error || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'outline';
      case 'CONFIRMED':
        return 'default';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      case 'NO_SHOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h2 className="text-foreground mb-2 text-xl font-semibold">
                Error
              </h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            View all scheduled appointments
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {filteredAppointments.length} Appointment
          {filteredAppointments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="min-w-[200px] flex-1">
              <label className="text-muted-foreground mb-2 block text-sm font-medium">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="min-w-[200px] flex-1">
              <label className="text-muted-foreground mb-2 block text-sm font-medium">
                Date Range
              </label>
              <Select
                value={dateFilter}
                onValueChange={(value: any) => {
                  setDateFilter(value);
                  setSelectedDate(undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specific Date Filter */}
            <div className="min-w-[200px] flex-1">
              <label className="text-muted-foreground mb-2 block text-sm font-medium">
                Specific Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDateFilter('all');
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters */}
            {(statusFilter !== 'ALL' ||
              dateFilter !== 'today' ||
              selectedDate) && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setDateFilter('today');
                    setSelectedDate(undefined);
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <CalendarIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h2 className="text-foreground mb-2 text-xl font-semibold">
                No Appointments Found
              </h2>
              <p className="text-muted-foreground">
                {statusFilter !== 'ALL' || dateFilter !== 'all' || selectedDate
                  ? 'Try adjusting your filters'
                  : 'No appointments scheduled'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left Section */}
                  <div className="flex-1 space-y-4">
                    {/* Appointment ID and Status */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-foreground text-lg font-semibold">
                        {appointment.appointmentId}
                      </h3>
                      <Badge
                        variant={getStatusBadgeVariant(appointment.status)}
                        className="gap-1"
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </Badge>
                    </div>

                    {/* Date and Time */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground text-sm">
                          {format(
                            new Date(appointment.scheduledDate),
                            'EEEE, MMMM d, yyyy',
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground text-sm">
                          {appointment.startTime} - {appointment.endTime} (
                          {appointment.duration} min)
                        </span>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="border-border space-y-3 rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <div>
                          <span className="text-foreground text-sm font-medium">
                            {appointment.patient.firstName}{' '}
                            {appointment.patient.lastName}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            ({appointment.patient.patientId})
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-xs">
                            {appointment.patient.user.email}
                          </span>
                        </div>
                        {appointment.patient.user.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span className="text-muted-foreground text-xs">
                              {appointment.patient.user.phoneNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="border-border rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <div>
                          <span className="text-foreground text-sm font-medium">
                            Dr. {appointment.doctor.firstName}{' '}
                            {appointment.doctor.lastName}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {appointment.doctor.specialization}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          Reason:
                        </p>
                        <p className="text-foreground text-sm">
                          {appointment.reason}
                        </p>
                      </div>
                    )}

                    {/* Type */}
                    {appointment.type && (
                      <div>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/appointments/${appointment.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
