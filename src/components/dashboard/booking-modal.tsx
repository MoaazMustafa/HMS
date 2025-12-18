'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  Search,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  defaultAppointmentFee: number;
  name?: string; // Computed field from API
  workingHours?: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
  user: {
    id: string;
    email: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSuccess?: () => void;
};

export function BookingModal({ isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch doctors from API
  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/doctors');

          if (!response.ok) {
            throw new Error('Failed to fetch doctors');
          }

          const result = await response.json();
          setDoctors(result.data || []);
        } catch {
          setError('Failed to load doctors. Please try again.');
          setDoctors([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [isOpen]);

  const filteredDoctors = doctors.filter((doctor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const doctorName = doctor.name || `${doctor.firstName} ${doctor.lastName}`;
    return (
      doctorName.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query)
    );
  });

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];

    const selectedDayNum = new Date(selectedDate).getDay(); // 0-6 (Sunday-Saturday)
    const workingHour = selectedDoctor.workingHours?.find(
      (wh) => wh.dayOfWeek === selectedDayNum && wh.isActive,
    );

    if (!workingHour) return [];

    // Generate time slots between start and end time (30-minute intervals)
    const slots: string[] = [];
    const start = workingHour.startTime.split(':').map(Number);
    const end = workingHour.endTime.split(':').map(Number);
    let currentHour = start[0];
    let currentMinute = start[1];

    while (
      currentHour < end[0] ||
      (currentHour === end[0] && currentMinute < end[1])
    ) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      // Success! Call the onSuccess callback and close modal
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to book appointment',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSearchQuery('');
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setError('');
    onClose();
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border-border flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border"
          >
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-foreground text-base font-semibold">
                  Book Appointment
                </h2>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Step {step} of 3:{' '}
                  {step === 1
                    ? 'Select Doctor'
                    : step === 2
                      ? 'Choose Date & Time'
                      : 'Confirm Details'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted h-0.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                className="bg-primary h-full"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-3 flex items-start gap-2 rounded-md border border-red-900/50 bg-red-950/50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <div className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by doctor name or specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-muted text-foreground placeholder:text-muted-foreground focus:ring-primary/50 w-full rounded-md border py-2 pr-3 pl-8 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>

                  {/* Doctors List */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="py-12 text-center">
                        <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2"></div>
                        <p className="text-muted-foreground text-xs">
                          Loading doctors...
                        </p>
                      </div>
                    ) : filteredDoctors.length === 0 ? (
                      <div className="py-12 text-center">
                        <User className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                        <p className="text-muted-foreground text-xs">
                          No doctors available at the moment
                        </p>
                        <p className="text-muted-foreground mt-1 text-[10px]">
                          Please check back later or contact support
                        </p>
                      </div>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setStep(2);
                          }}
                          className="bg-background hover:bg-muted border-muted hover:border-primary/50 group w-full rounded-md border p-3 text-left shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                                Dr.{' '}
                                {doctor.name ||
                                  `${doctor.firstName} ${doctor.lastName}`}
                              </h3>
                              <p className="text-muted-foreground mt-0.5 text-xs">
                                {doctor.specialization}
                              </p>
                              <p className="text-muted-foreground mt-1 text-[10px]">
                                {doctor.user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-muted-foreground text-[10px]">
                                Consultation Fee
                              </p>
                              <p className="text-primary mt-0.5 text-sm font-bold">
                                ${doctor.defaultAppointmentFee.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Date & Time */}
              {step === 2 && selectedDoctor && (
                <div className="space-y-4">
                  {/* Selected Doctor Info */}
                  <div className="bg-background border-muted rounded-md border p-3">
                    <p className="text-muted-foreground mb-1 text-[10px]">
                      Selected Doctor
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      Dr.{' '}
                      {selectedDoctor.name ||
                        `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {selectedDoctor.specialization}
                    </p>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="text-foreground mb-2 block text-xs font-medium">
                      <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                      }}
                      min={minDate}
                      max={maxDate}
                      className="bg-background border-muted text-foreground focus:ring-primary/50 w-full rounded-md border px-3 py-2 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="text-foreground mb-2 block text-xs font-medium">
                        <Clock className="mr-1.5 inline h-3.5 w-3.5" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                        {getAvailableTimeSlots().length === 0 ? (
                          <div className="col-span-full py-8 text-center">
                            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                            <p className="text-muted-foreground text-xs">
                              No available slots for this date
                            </p>
                          </div>
                        ) : (
                          getAvailableTimeSlots().map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                selectedTime === time
                                  ? 'bg-primary text-white'
                                  : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-muted border'
                              }`}
                            >
                              {time}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div>
                    <label className="text-foreground mb-2 block text-xs font-medium">
                      <FileText className="mr-1.5 inline h-3.5 w-3.5" />
                      Reason for Visit (Optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="bg-background border-muted text-foreground placeholder:text-muted-foreground focus:ring-primary/50 w-full resize-none rounded-md border px-3 py-2 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && selectedDoctor && (
                <div className="space-y-3">
                  <div className="bg-background border-muted space-y-3 rounded-md border p-4">
                    <h3 className="text-foreground mb-3 text-sm font-semibold">
                      Confirm Appointment Details
                    </h3>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <User className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-[10px]">
                            Doctor
                          </p>
                          <p className="text-foreground text-xs font-medium">
                            Dr.{' '}
                            {selectedDoctor.name ||
                              `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                          </p>
                          <p className="text-muted-foreground text-[10px]">
                            {selectedDoctor.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Calendar className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-[10px]">
                            Date
                          </p>
                          <p className="text-foreground text-xs font-medium">
                            {new Date(selectedDate).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-[10px]">
                            Time
                          </p>
                          <p className="text-foreground text-xs font-medium">
                            {selectedTime}
                          </p>
                        </div>
                      </div>

                      {reason && (
                        <div className="flex items-start gap-2.5">
                          <FileText className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                          <div>
                            <p className="text-muted-foreground text-[10px]">
                              Reason
                            </p>
                            <p className="text-foreground text-xs">{reason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-muted flex items-center justify-between border-t pt-3">
                      <span className="text-muted-foreground text-xs">
                        Consultation Fee
                      </span>
                      <span className="text-primary text-lg font-bold">
                        ${selectedDoctor.defaultAppointmentFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-md border border-blue-900/50 bg-blue-300/50 p-3">
                    <p className="text-xs text-blue-400">
                      <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" />
                      You will receive reminders 24 hours and 2 hours before
                      your appointment. You can reschedule or cancel up to 24
                      hours before the scheduled time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-background flex items-center justify-between gap-2 border-t p-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setStep((prev) =>
                      prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1,
                    )
                  }
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={() =>
                    setStep((prev) =>
                      prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3,
                    )
                  }
                  disabled={
                    step === 1
                      ? !selectedDoctor
                      : !selectedDate || !selectedTime
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
