'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Eye,
  FileText,
  Filter,
  Search,
  User,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function NurseMedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

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
          record.assessment?.toLowerCase().includes(query),
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

  return (
    <div className="container space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            Medical Records
          </h1>
          <p className="text-muted-foreground">
            View patient medical records (read-only)
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {filteredRecords.length} Record
          {filteredRecords.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search by patient name, ID, record ID, or complaint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-1 h-7 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px] flex-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="finalized">Finalized</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                    <SelectItem value="unsigned">Unsigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[200px] flex-1">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery ||
                statusFilter !== 'all' ||
                dateFilter !== 'all') && (
                <Button variant="ghost" onClick={clearFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h2 className="text-foreground mb-2 text-xl font-semibold">
                No Medical Records Found
              </h2>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No medical records available'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left Section */}
                  <div className="flex-1 space-y-4">
                    {/* Record ID and Status */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground text-lg font-semibold">
                            {record.recordId}
                          </h3>
                          {record.isFinalized && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Finalized
                            </Badge>
                          )}
                          {!record.isFinalized && (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Draft
                            </Badge>
                          )}
                          {record.isSigned && (
                            <Badge variant="outline" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Signed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            Visit: {format(new Date(record.visitDate), 'PPP')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="border-border rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">
                          {record.patient.user.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({record.patient.patientId})
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {record.patient.user.email}
                      </p>
                    </div>

                    {/* Chief Complaint */}
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs font-medium">
                        Chief Complaint:
                      </p>
                      <p className="text-foreground text-sm">
                        {record.chiefComplaint}
                      </p>
                    </div>

                    {/* Diagnoses */}
                    {record.diagnoses && record.diagnoses.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-xs font-medium">
                          Diagnoses:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {record.diagnoses.map((diagnosis, idx) => (
                            <Badge key={idx} variant="outline">
                              {diagnosis.icd10Code}: {diagnosis.description}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vital Signs */}
                    {record.vitalSigns && (
                      <div className="border-border rounded-lg border p-4">
                        <p className="text-muted-foreground mb-2 text-xs font-medium">
                          Vital Signs:
                        </p>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          <div>
                            <p className="text-muted-foreground text-xs">BP</p>
                            <p className="text-foreground text-sm font-medium">
                              {record.vitalSigns.bloodPressure}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Heart Rate
                            </p>
                            <p className="text-foreground text-sm font-medium">
                              {record.vitalSigns.heartRate} bpm
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Temperature
                            </p>
                            <p className="text-foreground text-sm font-medium">
                              {record.vitalSigns.temperature}°F
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Weight
                            </p>
                            <p className="text-foreground text-sm font-medium">
                              {record.vitalSigns.weight} kg
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assessment Preview */}
                    {record.assessment && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          Assessment:
                        </p>
                        <p className="text-foreground line-clamp-2 text-sm">
                          {record.assessment}
                        </p>
                      </div>
                    )}

                    {/* Created Date */}
                    <p className="text-muted-foreground text-xs">
                      Created: {format(new Date(record.createdAt), 'PPp')}
                    </p>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/medical-records/${record.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
