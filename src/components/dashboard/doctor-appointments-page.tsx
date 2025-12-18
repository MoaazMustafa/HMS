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
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  canUpdateStatus: boolean;
  patient: {
    id: string;
    patientId: string;
    user: {
      name: string | null;
      email: string;
      phoneNumber: string | null;
    };
  };
}

type StatusFilter =
  | 'ALL'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export function DoctorAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentData[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'upcoming' | 'past'
  >('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);

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
      const response = await fetch('/api/doctor/appointments');
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      } else {
        setError(result.error || 'Failed to load appointments');
      }
    } catch (err) {
      setError('Failed to load appointments');
      // Log error for debugging
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error loading appointments:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateDialog = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setUpdateDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppointment || !newStatus) {
      toast.error('Please select a status');
      return;
    }

    if (newStatus === selectedAppointment.status) {
      toast.error('Please select a different status');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success('Appointment status updated successfully');
        setUpdateDialogOpen(false);
        fetchAppointments(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update appointment status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = [
      { value: 'SCHEDULED', label: 'Scheduled' },
      { value: 'CONFIRMED', label: 'Confirmed' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
      { value: 'NO_SHOW', label: 'No Show' },
    ];

    // Filter out invalid transitions
    if (
      currentStatus === 'COMPLETED' ||
      currentStatus === 'CANCELLED' ||
      currentStatus === 'NO_SHOW'
    ) {
      return [allStatuses.find((s) => s.value === currentStatus)!];
    }

    return allStatuses;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        icon: typeof CheckCircle2;
        label: string;
      }
    > = {
      SCHEDULED: { variant: 'default', icon: Clock, label: 'Scheduled' },
      CONFIRMED: { variant: 'default', icon: CheckCircle2, label: 'Confirmed' },
      COMPLETED: {
        variant: 'secondary',
        icon: CheckCircle2,
        label: 'Completed',
      },
      CANCELLED: { variant: 'destructive', icon: XCircle, label: 'Cancelled' },
      NO_SHOW: { variant: 'destructive', icon: AlertCircle, label: 'No Show' },
    };

    const statusInfo = statusMap[status] || {
      variant: 'outline' as const,
      icon: AlertCircle,
      label: status,
    };
    const StatusIcon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="px-1.5 py-0.5 text-[10px]">
        <StatusIcon className="mr-1 h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const aptDate = new Date(date);
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusCounts = () => {
    return {
      all: appointments.length,
      scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
      confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
      completed: appointments.filter((a) => a.status === 'COMPLETED').length,
      cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
      noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Appointments List Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your appointment schedule
          </p>
        </div>
        {/* Temporarily hide calendar view until implemented */}
        {/* <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
        </div> */}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-foreground text-xl font-bold">{counts.all}</p>
          <p className="text-muted-foreground text-[10px]">Total</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-xl font-bold text-blue-500">{counts.scheduled}</p>
          <p className="text-muted-foreground text-[10px]">Scheduled</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-xl font-bold text-green-500">{counts.confirmed}</p>
          <p className="text-muted-foreground text-[10px]">Confirmed</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-xl font-bold text-purple-500">
            {counts.completed}
          </p>
          <p className="text-muted-foreground text-[10px]">Completed</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-xl font-bold text-orange-500">
            {counts.cancelled}
          </p>
          <p className="text-muted-foreground text-[10px]">Cancelled</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-3">
          <p className="text-xl font-bold text-red-500">{counts.noShow}</p>
          <p className="text-muted-foreground text-[10px]">No Show</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
            <Select
              value={dateFilter}
              onValueChange={(value) =>
                setDateFilter(value as typeof dateFilter)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-60 justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(selectedDate ||
            dateFilter !== 'upcoming' ||
            statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate(undefined);
                setDateFilter('upcoming');
                setStatusFilter('ALL');
              }}
              className="ml-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          Showing {filteredAppointments.length} of {appointments.length}{' '}
          appointments
        </p>
      </div>

      {/* Appointments List */}
      <div className="bg-card border-border rounded-lg border">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarIcon className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No appointments found
            </p>
          </div>
        ) : (
          <div className="divide-border divide-y">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="hover:bg-accent/50 p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    {/* Date Badge */}
                    <div className="shrink-0">
                      <div
                        className={`h-14 w-14 rounded-lg border ${
                          isToday(appointment.scheduledDate)
                            ? 'bg-primary/10 border-primary/20'
                            : 'bg-accent border-border'
                        } flex flex-col items-center justify-center`}
                      >
                        <span className="text-muted-foreground text-xs font-medium">
                          {new Date(
                            appointment.scheduledDate,
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                          })}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            isToday(appointment.scheduledDate)
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {new Date(appointment.scheduledDate).getDate()}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {appointment.appointmentId}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                        {isToday(appointment.scheduledDate) && (
                          <Badge
                            variant="default"
                            className="bg-primary text-[10px]"
                          >
                            Today
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">
                          {formatTime(appointment.startTime)} -{' '}
                          {formatTime(appointment.endTime)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({appointment.duration} min)
                        </span>
                      </div>

                      {appointment.type && (
                        <p className="text-muted-foreground mb-2 text-xs">
                          Type: {appointment.type}
                        </p>
                      )}

                      {appointment.reason && (
                        <p className="text-muted-foreground mb-3 text-xs">
                          Reason: {appointment.reason}
                        </p>
                      )}

                      {/* Patient Info */}
                      <div className="bg-accent/30 mb-2 rounded-md p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <User className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="text-foreground text-sm font-medium">
                            {appointment.patient.user.name || 'Unnamed Patient'}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {appointment.patient.patientId}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">
                              {appointment.patient.user.email}
                            </span>
                          </div>
                          {appointment.patient.user.phoneNumber && (
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3" />
                              <span>
                                {appointment.patient.user.phoneNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fee */}
                      {appointment.customFee && (
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>Fee: ${appointment.customFee.toString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex flex-col gap-2">
                    <Link href={`/dashboard/appointments/${appointment.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                    {appointment.canUpdateStatus && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 w-full"
                        onClick={() => handleOpenUpdateDialog(appointment)}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status of this appointment. The patient will be
              notified of the update.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 py-4">
              {/* Appointment Info */}
              <div className="bg-accent/50 space-y-2 rounded-lg p-3">
                <p className="text-sm font-medium">
                  {selectedAppointment.patient.user.name || 'Unnamed Patient'}
                </p>
                <p className="text-muted-foreground text-xs">
                  {format(
                    new Date(selectedAppointment.scheduledDate),
                    'MMM d, yyyy',
                  )}{' '}
                  at {formatTime(selectedAppointment.startTime)}
                </p>
                <p className="text-muted-foreground text-xs">
                  Current Status:{' '}
                  <span className="font-medium">
                    {selectedAppointment.status}
                  </span>
                </p>
              </div>

              {/* Status Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Status <span className="text-destructive">*</span>
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions(selectedAppointment.status).map(
                      (option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
