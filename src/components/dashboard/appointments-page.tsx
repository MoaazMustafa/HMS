'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { BookingModal } from './booking-modal';

type Appointment = {
  id: string;
  appointmentId: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: string;
  reason?: string;
  fee: number;
  doctor: {
    firstName: string;
    lastName: string;
    specialization: string;
    user: {
      email: string;
    };
  };
};

type Props = {
  appointments: Appointment[];
  patientId: string;
};

export function AppointmentsPage({ appointments, patientId }: Props) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const filteredAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.scheduledDate);
    const now = new Date();
    const isUpcoming = appointmentDate >= now;

    // Filter by status
    if (filter === 'upcoming' && !isUpcoming) return false;
    if (filter === 'past' && isUpcoming) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const doctorName = `${apt.doctor.firstName} ${apt.doctor.lastName}`;
      return (
        doctorName.toLowerCase().includes(query) ||
        apt.doctor.specialization.toLowerCase().includes(query) ||
        apt.appointmentId.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'COMPLETED':
        return 'bg-primary/20 text-primary border-primary/20';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'NO_SHOW':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
      default:
        return 'bg-background-500/20 text-background-500 border-background-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <XCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canRescheduleOrCancel = (appointment: Appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.scheduledDate.toString().split('T')[0]}T${appointment.scheduledTime}`,
    );
    const now = new Date();
    const hoursUntilAppointment =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return (
      hoursUntilAppointment >= 24 &&
      (appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED')
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Appointments
          </h1>
          <p className="text-background-400">
            Manage your appointments and book new ones
          </p>
        </div>
        <Button onClick={() => setShowBookingModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: 'Total Appointments',
            value: appointments.length,
            icon: Calendar,
            color: 'text-blue-500',
          },
          {
            label: 'Upcoming',
            value: appointments.filter(
              (a) =>
                new Date(a.scheduledDate) >= new Date() &&
                (a.status === 'SCHEDULED' || a.status === 'CONFIRMED'),
            ).length,
            icon: Clock,
            color: 'text-primary',
          },
          {
            label: 'Completed',
            value: appointments.filter((a) => a.status === 'COMPLETED').length,
            icon: CheckCircle,
            color: 'text-green-500',
          },
          {
            label: 'Cancelled',
            value: appointments.filter((a) => a.status === 'CANCELLED').length,
            icon: XCircle,
            color: 'text-red-500',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-background-400 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-background-900/50 border-background-800 rounded-lg border p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() =>
                  setFilter(tab.value as 'all' | 'upcoming' | 'past')
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-background'
                    : 'bg-background-800 text-background-400 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-background-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor, specialization, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background-800 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
            <Calendar className="text-background-600 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No appointments found
            </h3>
            <p className="text-background-400 mb-4">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Book your first appointment to get started'}
            </p>
            <Button onClick={() => setShowBookingModal(true)}>
              Book Appointment
            </Button>
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background-900/50 border-background-800 hover:border-background-700 rounded-lg border p-6 backdrop-blur-xl transition-all"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                {/* Appointment Info */}
                <div className="flex-1 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-foreground text-lg font-semibold">
                          Dr. {appointment.doctor.firstName}{' '}
                          {appointment.doctor.lastName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-background-400 text-sm">
                        {appointment.doctor.specialization}
                      </p>
                    </div>
                    <span className="text-background-500 font-mono text-xs">
                      {appointment.appointmentId}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-background-500 h-4 w-4" />
                      <span className="text-background-300">
                        {new Date(appointment.scheduledDate).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-background-500 h-4 w-4" />
                      <span className="text-background-300">
                        {appointment.scheduledTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="text-background-500 h-4 w-4" />
                      <span className="text-background-300">
                        ${appointment.fee.toFixed(2)}
                      </span>
                    </div>

                    {appointment.reason && (
                      <div className="col-span-full flex items-center gap-2 text-sm">
                        <AlertCircle className="text-background-500 h-4 w-4" />
                        <span className="text-background-300">
                          {appointment.reason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {canRescheduleOrCancel(appointment) && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        patientId={patientId}
        onSuccess={() => {
          // Refresh page to show new appointment
          window.location.reload();
        }}
      />
    </div>
  );
}
