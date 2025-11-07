'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Search, AlertCircle } from 'lucide-react';
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
          
          const data = await response.json();
          setDoctors(data.doctors || []);
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
      (wh) => wh.dayOfWeek === selectedDayNum && wh.isActive
    );

    if (!workingHour) return [];

    // Generate time slots between start and end time (30-minute intervals)
    const slots: string[] = [];
    const start = workingHour.startTime.split(':').map(Number);
    const end = workingHour.endTime.split(':').map(Number);
    let currentHour = start[0];
    let currentMinute = start[1];

    while (currentHour < end[0] || (currentHour === end[0] && currentMinute < end[1])) {
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
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
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
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">Book Appointment</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Step {step} of 3:{' '}
                  {step === 1 ? 'Select Doctor' : step === 2 ? 'Choose Date & Time' : 'Confirm Details'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-0.5 bg-muted">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-3 p-3 bg-red-950/50 border border-red-900/50 rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <div className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search by doctor name or specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Doctors List */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                        <p className="text-xs text-muted-foreground">Loading doctors...</p>
                      </div>
                    ) : filteredDoctors.length === 0 ? (
                      <div className="text-center py-12">
                        <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-xs text-muted-foreground">No doctors available at the moment</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
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
                          className="w-full p-3 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-primary/50 rounded-md text-left transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                Dr. {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
                              </h3>
                              <p className="text-xs text-zinc-400 mt-0.5">{doctor.specialization}</p>
                              <p className="text-[10px] text-zinc-500 mt-1">{doctor.user.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-zinc-400">Consultation Fee</p>
                              <p className="text-sm font-bold text-primary mt-0.5">
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
                  <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md">
                    <p className="text-[10px] text-zinc-400 mb-1">Selected Doctor</p>
                    <p className="text-sm font-semibold text-white">
                      Dr. {selectedDoctor.name || `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                    </p>
                    <p className="text-xs text-zinc-400">{selectedDoctor.specialization}</p>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-2">
                      <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
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
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-xs font-medium text-white mb-2">
                        <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {getAvailableTimeSlots().length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                            <p className="text-xs text-zinc-400">
                              No available slots for this date
                            </p>
                          </div>
                        ) : (
                          getAvailableTimeSlots().map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                selectedTime === time
                                  ? 'bg-primary text-black'
                                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
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
                    <label className="block text-xs font-medium text-white mb-2">
                      <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                      Reason for Visit (Optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && selectedDoctor && (
                <div className="space-y-3">
                  <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-md space-y-3">
                    <h3 className="text-sm font-semibold text-white mb-3">Confirm Appointment Details</h3>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-zinc-400">Doctor</p>
                          <p className="text-xs text-white font-medium">
                            Dr. {selectedDoctor.name || `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                          </p>
                          <p className="text-[10px] text-zinc-400">{selectedDoctor.specialization}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-zinc-400">Date</p>
                          <p className="text-xs text-white font-medium">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-zinc-400">Time</p>
                          <p className="text-xs text-white font-medium">{selectedTime}</p>
                        </div>
                      </div>

                      {reason && (
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-zinc-400">Reason</p>
                            <p className="text-xs text-white">{reason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-zinc-700 flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Consultation Fee</span>
                      <span className="text-lg font-bold text-primary">
                        ${selectedDoctor.defaultAppointmentFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/50 border border-blue-900/50 rounded-md">
                    <p className="text-xs text-blue-400">
                      <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />
                      You will receive reminders 24 hours and 2 hours before your appointment. You can
                      reschedule or cancel up to 24 hours before the scheduled time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 p-4 border-t border-zinc-800">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1))}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={() => setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3))}
                  disabled={step === 1 ? !selectedDoctor : !selectedDate || !selectedTime}
                >
                  Next
                </Button>
              ) : (
                <Button size="sm" onClick={handleSubmit} disabled={isLoading} className="min-w-[120px]">
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
