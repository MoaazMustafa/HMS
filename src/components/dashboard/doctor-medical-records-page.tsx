'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Eye,
  FileText,
  Filter,
  Loader2,
  Plus,
  Search,
  User,
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

interface MedicalRecord {
  id: string;
  recordId: string;
  patient: {
    id: string;
    patientId: string;
    user: {
      name: string;
      email: string;
    };
  };
  visitDate: string;
  chiefComplaint: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  diagnoses: Array<{
    description: string;
    icd10Code: string;
  }>;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  } | null;
  isFinalized: boolean;
  isSigned: boolean;
  createdAt: string;
}

export default function DoctorMedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
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
    }>
  >([]);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, searchQuery, statusFilter, dateFilter]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/medical-records');
      const result = await response.json();

      if (result.success) {
        setRecords(result.data);
      } else {
        toast.error(result.error || 'Failed to load medical records');
      }
    } catch {
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.patient.user.name.toLowerCase().includes(query) ||
          record.patient.user.email.toLowerCase().includes(query) ||
          record.patient.patientId.toLowerCase().includes(query) ||
          record.recordId.toLowerCase().includes(query) ||
          record.chiefComplaint?.toLowerCase().includes(query) ||
          record.assessment?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((record) => {
        if (statusFilter === 'finalized') return record.isFinalized;
        if (statusFilter === 'draft') return !record.isFinalized;
        if (statusFilter === 'signed') return record.isSigned;
        if (statusFilter === 'unsigned') return !record.isSigned;
        return true;
      });
    }

    // Date filter
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.visitDate);
        recordDate.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          return recordDate.getTime() === today.getTime();
        } else if (dateFilter === 'this-week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return recordDate.getTime() >= weekAgo.getTime();
        } else if (dateFilter === 'this-month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return recordDate.getTime() >= monthAgo.getTime();
        }
        return true;
      });
    }

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const handleOpenCreateDialog = async () => {
    setCreateDialogOpen(true);
    try {
      const response = await fetch('/api/doctor/patients');
      const result = await response.json();
      if (result.success) {
        setPatients(result.data.filter((p: { assignment: { status: string } }) => p.assignment.status === 'ACTIVE'));
      }
    } catch {
      toast.error('Failed to load patients');
    }
  };

  const handleCreateRecord = async () => {
    if (!formData.patientId || !formData.chiefComplaint) {
      toast.error('Please select a patient and enter chief complaint');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/medical-records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Medical record created successfully');
        setCreateDialogOpen(false);
        setFormData({
          patientId: '',
          chiefComplaint: '',
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
        });
        fetchRecords();
      } else {
        toast.error(result.error || 'Failed to create medical record');
      }
    } catch {
      toast.error('Failed to create medical record');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground mt-1">Create and manage patient medical records</p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          New Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{records.length}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Finalized</p>
              <p className="text-2xl font-bold">{records.filter((r) => r.isFinalized).length}</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="text-2xl font-bold">{records.filter((r) => !r.isFinalized).length}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Signed</p>
              <p className="text-2xl font-bold">{records.filter((r) => r.isSigned).length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="unsigned">Unsigned</SelectItem>
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
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
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

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No records found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first medical record'}
              </p>
            </div>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Patient Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{record.patient.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{record.patient.patientId}</p>
                    </div>
                  </div>

                  <div className="pl-13 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(record.visitDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Chief Complaint:</span>
                      <span className="text-muted-foreground">{record.chiefComplaint}</span>
                    </div>
                  </div>

                  {/* Diagnoses */}
                  {record.diagnoses.length > 0 && (
                    <div className="pl-13">
                      <p className="text-sm font-medium mb-1">Diagnoses:</p>
                      <div className="flex flex-wrap gap-2">
                        {record.diagnoses.slice(0, 3).map((diagnosis, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {diagnosis.description} ({diagnosis.icd10Code})
                          </Badge>
                        ))}
                        {record.diagnoses.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{record.diagnoses.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    {record.isSigned ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 border">
                        Finalized
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 border">
                        Draft
                      </Badge>
                    )}
                    {record.isSigned && (
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 border">
                        Signed
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href={`/dashboard/medical-records/${record.id}`}>
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    ID: {record.recordId}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Record Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Medical Record</DialogTitle>
            <DialogDescription>
              Document a patient visit using SOAP format (Subjective, Objective, Assessment, Plan)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient *</label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, patientId: value }))}
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
                <p className="text-sm text-muted-foreground">
                  No assigned patients found. Complete an appointment first.
                </p>
              )}
            </div>

            {/* Chief Complaint */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chief Complaint *</label>
              <input
                type="text"
                value={formData.chiefComplaint}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, chiefComplaint: e.target.value }))
                }
                placeholder="e.g., Headache for 3 days"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* SOAP Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subjective (Patient&apos;s Description)</label>
              <textarea
                value={formData.subjective}
                onChange={(e) => setFormData((prev) => ({ ...prev, subjective: e.target.value }))}
                placeholder="What the patient reports..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objective (Clinical Findings)</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData((prev) => ({ ...prev, objective: e.target.value }))}
                placeholder="Physical examination findings, vital signs, lab results..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assessment (Diagnosis)</label>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData((prev) => ({ ...prev, assessment: e.target.value }))}
                placeholder="Clinical impression, diagnoses..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan (Treatment Plan)</label>
              <textarea
                value={formData.plan}
                onChange={(e) => setFormData((prev) => ({ ...prev, plan: e.target.value }))}
                placeholder="Treatment plan, medications, follow-up..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              onClick={handleCreateRecord}
              disabled={creating || !formData.patientId || !formData.chiefComplaint}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Record'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
