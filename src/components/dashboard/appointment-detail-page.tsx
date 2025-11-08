'use client';

import type { Appointment, Billing, Doctor, Patient, User, UserRole } from '@prisma/client';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AppointmentWithDetails = Omit<Appointment, 'customFee'> & {
  customFee: number | null;
  patient: Patient & {
    user: Pick<User, 'name' | 'email' | 'phoneNumber'>;
  };
  doctor: Omit<Doctor, 'defaultAppointmentFee' | 'defaultSessionFee'> & {
    defaultAppointmentFee: number;
    defaultSessionFee: number;
    user: Pick<User, 'name' | 'email' | 'phoneNumber'>;
  };
  billing: (Omit<Billing, 'amount'> & { amount: number }) | null;
};

interface Props {
  appointment: AppointmentWithDetails;
  userRole: UserRole;
  userId: string;
}

export function AppointmentDetailPage({ appointment, userRole }: Props) {
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(appointment.status);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDoctor = userRole === 'DOCTOR';
  const canUpdateStatus = isDoctor && appointment.canUpdateStatus;

  const handleStatusUpdate = async () => {
    if (!canUpdateStatus || status === appointment.status) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Appointment status updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update appointment status');
      // eslint-disable-next-line no-console
      if (err instanceof Error) console.error('Error:', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (statusValue: string) => {
    const statusMap: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle2 }
    > = {
      SCHEDULED: { variant: 'default', icon: Clock },
      CONFIRMED: { variant: 'default', icon: CheckCircle2 },
      COMPLETED: { variant: 'secondary', icon: CheckCircle2 },
      CANCELLED: { variant: 'destructive', icon: XCircle },
      NO_SHOW: { variant: 'destructive', icon: AlertCircle },
    };

    const statusInfo = statusMap[statusValue] || { variant: 'outline' as const, icon: AlertCircle };
    const StatusIcon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
        {statusValue.replace('_', ' ')}
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

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointment Details</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Appointment ID: {appointment.appointmentId}
            </p>
          </div>
        </div>
        {getStatusBadge(status)}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Appointment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="text-foreground font-medium">
                {new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Time</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground font-medium">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
                <span className="text-xs text-muted-foreground">({appointment.duration} min)</span>
              </div>
            </div>

            {appointment.type && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="text-foreground">{appointment.type}</p>
              </div>
            )}

            {appointment.reason && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reason for Visit</p>
                <p className="text-foreground">{appointment.reason}</p>
              </div>
            )}

            {appointment.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-foreground text-sm">{appointment.notes}</p>
              </div>
            )}

            {/* Status Update (Doctor Only) */}
            {canUpdateStatus && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">Update Status</p>
                <div className="flex gap-2">
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(
                        value as
                          | 'SCHEDULED'
                          | 'CONFIRMED'
                          | 'IN_PROGRESS'
                          | 'COMPLETED'
                          | 'CANCELLED'
                          | 'NO_SHOW'
                          | 'DECLINED'
                      )
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="NO_SHOW">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={updating || status === appointment.status}
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient/Doctor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              {isDoctor ? 'Patient Information' : 'Doctor Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDoctor ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="text-foreground font-medium">
                    {appointment.patient.user.name || 'Unnamed Patient'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                  <Badge variant="outline" className="text-xs">
                    {appointment.patient.patientId}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground text-sm">{appointment.patient.user.email}</p>
                  </div>
                </div>

                {appointment.patient.user.phoneNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-foreground text-sm">
                        {appointment.patient.user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <Link href={`/dashboard/patients/${appointment.patient.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Patient Profile
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Doctor Name</p>
                  <p className="text-foreground font-medium">
                    Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </p>
                </div>

                {appointment.doctor.specialization && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                    <p className="text-foreground">{appointment.doctor.specialization}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground text-sm">{appointment.doctor.user.email}</p>
                  </div>
                </div>

                {appointment.doctor.user.phoneNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-foreground text-sm">
                        {appointment.doctor.user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Appointment Fee</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(
                  appointment.billing?.amount ||
                    appointment.customFee ||
                    appointment.doctor.defaultAppointmentFee
                )}
              </p>
            </div>

            {appointment.billing && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                  <Badge
                    variant={
                      appointment.billing.status === 'COMPLETED'
                        ? 'default'
                        : appointment.billing.status === 'PENDING'
                        ? 'outline'
                        : 'destructive'
                    }
                    className="text-xs"
                  >
                    {appointment.billing.status}
                  </Badge>
                </div>

                {appointment.billing.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Paid On</p>
                    <p className="text-foreground text-sm">
                      {new Date(appointment.billing.paidAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Medical Record */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Medical Record
            </CardTitle>
            <CardDescription>
              Medical records will be available after completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDoctor && appointment.status === 'COMPLETED' ? (
              <Link href={`/dashboard/medical-records/new?appointmentId=${appointment.id}`}>
                <Button size="sm" className="w-full">
                  Create Medical Record
                </Button>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {appointment.status === 'COMPLETED'
                  ? 'Medical record will be created by the doctor'
                  : 'Medical record will be available after appointment completion'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
