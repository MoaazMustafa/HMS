'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Eye,
  Filter,
  Loader2,
  Plus,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
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

interface Session {
  id: string;
  sessionId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: SessionStatus;
  customFee: number | null;
  notes: string | null;
  patient: {
    patientId: string;
    user: {
      name: string;
      email: string;
    };
    dateOfBirth: string;
    gender: string;
  };
  billing: {
    amount: number;
    status: string;
    paidAt: Date | null;
  } | null;
}

export function DoctorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [patients, setPatients] = useState<
    Array<{
      id: string;
      patientId: string;
      user: { name: string };
      assignment: { status: string };
    }>
  >([]);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    duration: 60,
    customFee: 0,
    notes: '',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, searchQuery, statusFilter, dateFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions');
      const result = await response.json();

      if (result.success) {
        setSessions(result.data);
      } else {
        toast.error(result.error || 'Failed to load sessions');
      }
    } catch (error) {
      toast.error('Failed to load sessions');
      // eslint-disable-next-line no-console
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.patient.user.name.toLowerCase().includes(query) ||
          session.patient.user.email.toLowerCase().includes(query) ||
          session.patient.patientId.toLowerCase().includes(query) ||
          session.sessionId.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    // Date filter
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((session) => {
        const sessionDate = new Date(session.scheduledDate);
        sessionDate.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          return sessionDate.getTime() === today.getTime();
        } else if (dateFilter === 'upcoming') {
          return sessionDate.getTime() >= today.getTime();
        } else if (dateFilter === 'past') {
          return sessionDate.getTime() < today.getTime();
        }
        return true;
      });
    }

    setFilteredSessions(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const handleOpenCreateDialog = async () => {
    setCreateDialogOpen(true);
    // Fetch assigned patients
    try {
      const response = await fetch('/api/doctor/patients');
      const result = await response.json();
      if (result.success) {
        setPatients(
          result.data.filter(
            (p: { assignment: { status: string } }) =>
              p.assignment.status === 'ACTIVE',
          ),
        );
      }
    } catch {
      toast.error('Failed to load patients');
    }
  };

  const handleCreateSession = async () => {
    // Validation
    if (
      !formData.patientId ||
      !formData.scheduledDate ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Session created successfully');
        setCreateDialogOpen(false);
        setFormData({
          patientId: '',
          scheduledDate: '',
          startTime: '',
          endTime: '',
          duration: 60,
          customFee: 0,
          notes: '',
        });
        fetchSessions();
      } else {
        toast.error(result.error || 'Failed to create session');
      }
    } catch {
      toast.error('Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 60;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = endHour * 60 + endMin - (startHour * 60 + startMin);
    return duration > 0 ? duration : 60;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newFormData = { ...formData, [field]: value };
    if (newFormData.startTime && newFormData.endTime) {
      newFormData.duration = calculateDuration(
        newFormData.startTime,
        newFormData.endTime,
      );
    }
    setFormData(newFormData);
  };

  const getStatusColor = (status: SessionStatus) => {
    const colors: Record<SessionStatus, string> = {
      SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
      NO_SHOW: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return colors[status];
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter((s) => s.status === 'SCHEDULED').length,
    inProgress: sessions.filter((s) => s.status === 'IN_PROGRESS').length,
    completed: sessions.filter((s) => s.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Therapy Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track therapy sessions with patients
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Sessions
              </p>
              <p className="text-foreground text-2xl font-bold">
                {stats.total}
              </p>
            </div>
            <Calendar className="text-primary h-8 w-8" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Scheduled
              </p>
              <p className="text-2xl font-bold text-blue-500">
                {stats.scheduled}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                In Progress
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                {stats.inProgress}
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Completed
              </p>
              <p className="text-2xl font-bold text-green-500">
                {stats.completed}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <h3 className="text-sm font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10 text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <Card className="p-8">
            <div className="space-y-2 text-center">
              <Calendar className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="text-lg font-semibold">No sessions found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No sessions scheduled yet'}
              </p>
            </div>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Patient Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full text-xl">
                      {session.patient.gender === 'MALE' ? '👨' : '👩'}
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">
                        {session.patient.user.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {session.patient.patientId} •{' '}
                        {calculateAge(session.patient.dateOfBirth)} years old
                      </p>
                    </div>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(session.scheduledDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.startTime} - {session.endTime} (
                      {session.duration} min)
                    </div>
                  </div>

                  {session.notes && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {session.notes}
                    </p>
                  )}
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <Badge
                    variant="outline"
                    className={getStatusColor(session.status)}
                  >
                    {session.status.replace('_', ' ')}
                  </Badge>

                  {session.billing && (
                    <Badge
                      variant="outline"
                      className={
                        session.billing.status === 'PAID'
                          ? 'border-green-500/20 bg-green-500/10 text-green-500'
                          : session.billing.status === 'PENDING'
                            ? 'border-orange-500/20 bg-orange-500/10 text-orange-500'
                            : 'border-red-500/20 bg-red-500/10 text-red-500'
                      }
                    >
                      ${session.billing.amount.toFixed(2)} •{' '}
                      {session.billing.status}
                    </Badge>
                  )}

                  <Link href={`/dashboard/sessions/${session.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Session Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Schedule a therapy session with one of your assigned patients
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient *</label>
              <Select
                value={formData.patientId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, patientId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.user.name} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {patients.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No assigned patients found. Complete an appointment first to
                  assign patients.
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Date *</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
                  }))
                }
                min={new Date().toISOString().split('T')[0]}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleTimeChange('startTime', e.target.value)
                  }
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Duration Display */}
            {formData.duration > 0 && (
              <div className="bg-muted rounded-md p-3">
                <p className="text-sm">
                  <span className="font-medium">Duration:</span>{' '}
                  {formData.duration} minutes
                </p>
              </div>
            )}

            {/* Custom Fee */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Custom Fee (Optional)
              </label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.customFee || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customFee: e.target.value
                        ? parseFloat(e.target.value)
                        : 0,
                    }))
                  }
                  placeholder="Leave empty for default fee"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 pr-3 pl-7 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                If not specified, your default session fee will be used
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes about this session..."
                rows={3}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={
                creating ||
                !formData.patientId ||
                !formData.scheduledDate ||
                !formData.startTime ||
                !formData.endTime ||
                formData.duration <= 0
              }
            >
              {creating ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
