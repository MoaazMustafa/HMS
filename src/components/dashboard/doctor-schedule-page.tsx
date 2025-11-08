'use client';

import {
  Calendar,
  Clock,
  Loader2,
  Plus,
  Save,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface WorkingHours {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export function DoctorSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedules, setSchedules] = useState<WorkingHours[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Partial<WorkingHours> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/schedule');
      const result = await response.json();

      if (result.success) {
        // API returns { success: true, data: { workingHours: [...] } }
        setSchedules(result.data.workingHours || []);
      } else {
        toast.error(result.error || 'Failed to load schedule');
      }
    } catch (err) {
      toast.error('Failed to load schedule');
      // eslint-disable-next-line no-console
      if (err instanceof Error) console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = () => {
    setEditingSchedule({
      dayOfWeek: 1, // Monday by default
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    });
    setDialogOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!editingSchedule) return;

    // Validation
    if (
      editingSchedule.dayOfWeek === undefined ||
      !editingSchedule.startTime ||
      !editingSchedule.endTime
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingSchedule.startTime >= editingSchedule.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setSaving(true);

    try {
      const url = editingSchedule.id
        ? `/api/doctor/schedule/${editingSchedule.id}`
        : '/api/doctor/schedule';

      const method = editingSchedule.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: editingSchedule.dayOfWeek,
          startTime: editingSchedule.startTime,
          endTime: editingSchedule.endTime,
          isAvailable: editingSchedule.isAvailable ?? true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          editingSchedule.id ? 'Schedule updated successfully' : 'Schedule added successfully'
        );
        setEditingSchedule(null);
        setDialogOpen(false);
        fetchSchedule();
      } else {
        toast.error(result.error || 'Failed to save schedule');
      }
    } catch (err) {
      toast.error('Failed to save schedule');
      // eslint-disable-next-line no-console
      if (err instanceof Error) console.error('Error:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSchedule = (schedule: WorkingHours) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  const handleToggleAvailability = async (schedule: WorkingHours) => {
    try {
      const response = await fetch(`/api/doctor/schedule/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...schedule,
          isAvailable: !schedule.isAvailable,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Availability updated');
        fetchSchedule();
      } else {
        toast.error(result.error || 'Failed to update availability');
      }
    } catch (err) {
      toast.error('Failed to update availability');
      // eslint-disable-next-line no-console
      if (err instanceof Error) console.error('Error:', err.message);
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      const response = await fetch(`/api/doctor/schedule/${scheduleToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Schedule deleted successfully');
        fetchSchedule();
      } else {
        toast.error(result.error || 'Failed to delete schedule');
      }
    } catch (err) {
      toast.error('Failed to delete schedule');
      // eslint-disable-next-line no-console
      if (err instanceof Error) console.error('Error:', err.message);
    } finally {
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const getSchedulesForDay = (day: number) => {
    return schedules.filter((s) => s.dayOfWeek === day);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Weekly Schedule Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>

        {/* Summary Skeleton */}
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your working hours and availability
          </p>
        </div>
        <Button onClick={handleAddSchedule} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Schedule
        </Button>
      </div>

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {editingSchedule?.id ? 'Edit Schedule' : 'Add New Schedule'}
            </DialogTitle>
            <DialogDescription>
              Set your working hours for a specific day of the week
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Day of Week <span className="text-destructive">*</span>
              </label>
              <Select
                value={editingSchedule?.dayOfWeek?.toString()}
                onValueChange={(value) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    dayOfWeek: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <Select
                  value={editingSchedule?.startTime}
                  onValueChange={(value) =>
                    setEditingSchedule({ ...editingSchedule, startTime: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Time <span className="text-destructive">*</span>
                </label>
                <Select
                  value={editingSchedule?.endTime}
                  onValueChange={(value) =>
                    setEditingSchedule({ ...editingSchedule, endTime: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-md">
              <button
                type="button"
                onClick={() =>
                  setEditingSchedule({
                    ...editingSchedule,
                    isAvailable: !editingSchedule?.isAvailable,
                  })
                }
                className="flex items-center gap-2"
              >
                {editingSchedule?.isAvailable ? (
                  <ToggleRight className="w-6 h-6 text-primary" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {editingSchedule?.isAvailable ? 'Available' : 'Unavailable'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Toggle to set availability status
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditingSchedule(null);
              }}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingSchedule?.id ? 'Update' : 'Save'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this schedule entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSchedule}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Weekly Schedule View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dayNames.map((day, index) => {
          const daySchedules = getSchedulesForDay(index);
          const hasSchedules = daySchedules.length > 0;

          return (
            <Card key={index} className={hasSchedules ? 'border-primary/20' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {day}
                  </div>
                  {hasSchedules && (
                    <Badge variant="outline" className="text-xs">
                      {daySchedules.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {daySchedules.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No schedule set</p>
                ) : (
                  daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`p-3 rounded-md border ${
                        schedule.isAvailable
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleAvailability(schedule)}
                          className="text-xs"
                        >
                          {schedule.isAvailable ? (
                            <ToggleRight className="w-5 h-5 text-primary" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={schedule.isAvailable ? 'default' : 'secondary'}
                          className="text-[10px]"
                        >
                          {schedule.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      <div className="flex gap-1 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSchedule(schedule)}
                          className="flex-1 h-7 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="h-7 px-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
              <p className="text-xs text-muted-foreground">Total Schedules</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {schedules.filter((s) => s.isAvailable).length}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {schedules.filter((s) => !s.isAvailable).length}
              </p>
              <p className="text-xs text-muted-foreground">Unavailable</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {new Set(schedules.map((s) => s.dayOfWeek)).size}
              </p>
              <p className="text-xs text-muted-foreground">Days Configured</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
