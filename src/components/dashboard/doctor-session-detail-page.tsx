'use client';

import { format } from 'date-fns';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type SessionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';
type BillingStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

interface SessionDetail {
  id: string;
  sessionId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: SessionStatus;
  notes: string | null;
  patient: {
    id: string;
    patientId: string;
    dateOfBirth: string;
    bloodType: string;
    allergies: string[];
    user: {
      name: string;
      email: string;
      phoneNumber: string;
    };
  };
  doctor: {
    user: {
      name: string;
      email: string;
    };
  };
  billing: {
    id: string;
    amount: number;
    status: BillingStatus;
    paymentMethod: string | null;
    transactionId: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function DoctorSessionDetailPage({
  sessionId,
}: {
  sessionId: string;
}) {
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<SessionStatus>('SCHEDULED');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sessions/${sessionId}`);
      const result = await response.json();

      if (result.success) {
        setSession(result.data);
        setNewNotes(result.data.notes || '');
      } else {
        toast.error(result.error || 'Failed to load session');
        router.push('/dashboard/sessions');
      }
    } catch {
      toast.error('Failed to load session');
      router.push('/dashboard/sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Session status updated successfully');
        setSession(result.data);
        setStatusDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNotes }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Notes updated successfully');
        setSession(result.data);
        setNotesDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to update notes');
      }
    } catch {
      toast.error('Failed to update notes');
    } finally {
      setUpdating(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: SessionStatus) => {
    const colors: Record<SessionStatus, string> = {
      SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
      NO_SHOW: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return colors[status];
  };

  const getBillingStatusColor = (status: BillingStatus) => {
    const colors: Record<BillingStatus, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
      FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
      REFUNDED: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="p-8">
        <div className="space-y-4 text-center">
          <AlertCircle className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="text-lg font-semibold">Session Not Found</h3>
          <p className="text-muted-foreground">
            The requested session could not be found.
          </p>
          <Button asChild>
            <Link href="/dashboard/sessions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/sessions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Session Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Session ID: {session.sessionId}
            </p>
          </div>
        </div>
        <Badge className={`${getStatusColor(session.status)} border`}>
          {session.status}
        </Badge>
      </div>

      {/* Session Information */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Session Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-sm">Date</p>
              <p className="font-medium">
                {format(new Date(session.scheduledDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-sm">Time</p>
              <p className="font-medium">
                {session.startTime} - {session.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-sm">Duration</p>
              <p className="font-medium">{session.duration} minutes</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={() => setStatusDialogOpen(true)} variant="outline">
            Update Status
          </Button>
          <Button onClick={() => setNotesDialogOpen(true)} variant="outline">
            {session.notes ? 'Edit Notes' : 'Add Notes'}
          </Button>
        </div>
      </Card>

      {/* Patient Information */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Patient Information</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/patients/${session.patient.id}`}>
              View Full Profile
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full text-xl">
              👤
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {session.patient.user.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                ID: {session.patient.patientId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                {calculateAge(session.patient.dateOfBirth)} years old
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                Blood Type: {session.patient.bloodType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{session.patient.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                {session.patient.user.phoneNumber}
              </span>
            </div>
          </div>

          {session.patient.allergies &&
            session.patient.allergies.length > 0 && (
              <div className="flex items-start gap-2 border-t pt-4">
                <AlertCircle className="mt-0.5 h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-500">Allergies:</p>
                  <p className="text-muted-foreground text-sm">
                    {session.patient.allergies.join(', ')}
                  </p>
                </div>
              </div>
            )}
        </div>
      </Card>

      {/* Billing Information */}
      {session.billing && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Billing Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <DollarSign className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Amount</p>
                <p className="text-lg font-medium">
                  ${session.billing.amount.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <Badge
                  className={`${getBillingStatusColor(session.billing.status)} mt-1 border`}
                >
                  {session.billing.status}
                </Badge>
              </div>
            </div>
            {session.billing.paymentMethod && (
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm">
                    Payment Method
                  </p>
                  <p className="font-medium">{session.billing.paymentMethod}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Session Notes */}
      {session.notes && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Session Notes</h2>
          <div className="bg-muted rounded-md p-4">
            <p className="text-sm whitespace-pre-wrap">{session.notes}</p>
          </div>
        </Card>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Session Status</DialogTitle>
            <DialogDescription>
              Change the current status of this therapy session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <div>
                <Badge className={`${getStatusColor(session.status)} border`}>
                  {session.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Status *</label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as SessionStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={updating || newStatus === session.status}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Update Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {session.notes ? 'Edit Session Notes' : 'Add Session Notes'}
            </DialogTitle>
            <DialogDescription>
              Document important information about this therapy session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Enter session notes, observations, or key points discussed..."
                rows={6}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotesDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleNotesUpdate} disabled={updating}>
              {updating ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
