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
  consultationFee: number;
  workingHours?: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  user: {
    name: string;
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

  // Mock data for doctors (replace with API call)
  useEffect(() => {
    if (isOpen) {
      // TODO: Fetch doctors from API
      setDoctors([]);
    }
  }, [isOpen]);

  const filteredDoctors = doctors.filter((doctor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doctor.user.name.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query)
    );
  });

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];

    const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const workingHour = selectedDoctor.workingHours?.find(
      (wh) => wh.dayOfWeek === selectedDay.toUpperCase() && wh.isAvailable
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
      // TODO: Call API to book appointment
      // const response = await fetch('/api/appointments/book', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     patientId,
      //     doctorId: selectedDoctor.id,
      //     scheduledDate: selectedDate,
      //     scheduledTime: selectedTime,
      //     reason: reason || undefined,
      //   }),
      // });

      // if (!response.ok) throw new Error('Failed to book appointment');

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-background-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-background">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Book Appointment</h2>
                <p className="text-sm text-background-400 mt-1">
                  Step {step} of 3:{' '}
                  {step === 1 ? 'Select Doctor' : step === 2 ? 'Choose Date & Time' : 'Confirm Details'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-background-400 hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-background-800">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-background-500" />
                    <input
                      type="text"
                      placeholder="Search by doctor name or specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-background-800 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Doctors List */}
                  <div className="space-y-3">
                    {filteredDoctors.length === 0 ? (
                      <div className="text-center py-12">
                        <User className="w-12 h-12 text-background-600 mx-auto mb-4" />
                        <p className="text-background-400">No doctors available at the moment</p>
                        <p className="text-sm text-background-500 mt-2">
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
                          className="w-full p-4 bg-background-800 hover:bg-background-750 border border-background-700 hover:border-primary/50 rounded-lg text-left transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                Dr. {doctor.user.name}
                              </h3>
                              <p className="text-sm text-background-400 mt-1">{doctor.specialization}</p>
                              <p className="text-xs text-background-500 mt-2">{doctor.user.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-background-400">Consultation Fee</p>
                              <p className="text-lg font-bold text-primary mt-1">
                                ${doctor.consultationFee.toFixed(2)}
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
                <div className="space-y-6">
                  {/* Selected Doctor Info */}
                  <div className="p-4 bg-background-800 border border-background-700 rounded-lg">
                    <p className="text-sm text-background-400 mb-1">Selected Doctor</p>
                    <p className="text-lg font-semibold text-foreground">Dr. {selectedDoctor.user.name}</p>
                    <p className="text-sm text-background-400">{selectedDoctor.specialization}</p>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
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
                      className="w-full px-4 py-3 bg-background-800 border border-background-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {getAvailableTimeSlots().length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <AlertCircle className="w-8 h-8 text-background-600 mx-auto mb-2" />
                            <p className="text-sm text-background-400">
                              No available slots for this date
                            </p>
                          </div>
                        ) : (
                          getAvailableTimeSlots().map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedTime === time
                                  ? 'bg-primary text-background'
                                  : 'bg-background-800 text-background-400 hover:bg-background-700 hover:text-foreground'
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Reason for Visit (Optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="w-full px-4 py-3 bg-background-800 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && selectedDoctor && (
                <div className="space-y-4">
                  <div className="p-6 bg-background-800 border border-background-700 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Appointment Details</h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-background-400">Doctor</p>
                          <p className="text-foreground font-medium">Dr. {selectedDoctor.user.name}</p>
                          <p className="text-sm text-background-400">{selectedDoctor.specialization}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-background-400">Date</p>
                          <p className="text-foreground font-medium">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-background-400">Time</p>
                          <p className="text-foreground font-medium">{selectedTime}</p>
                        </div>
                      </div>

                      {reason && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-background-400">Reason</p>
                            <p className="text-foreground">{reason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-background-700 flex items-center justify-between">
                      <span className="text-background-400">Consultation Fee</span>
                      <span className="text-2xl font-bold text-primary">
                        ${selectedDoctor.consultationFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      You will receive reminders 24 hours and 2 hours before your appointment. You can
                      reschedule or cancel up to 24 hours before the scheduled time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-background-800">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((step - 1) as any)} disabled={isLoading}>
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  onClick={() => setStep((step + 1) as any)}
                  disabled={step === 1 ? !selectedDoctor : !selectedDate || !selectedTime}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading} className="min-w-[150px]">
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
