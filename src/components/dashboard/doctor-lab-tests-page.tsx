'use client';

import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  FlaskConical,
  Loader2,
  Plus,
  Search,
  User,
  X,
  XCircle,
} from 'lucide-react';
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

interface LabTest {
  id: string;
  testId: string;
  patient: {
    id: string;
    patientId: string;
    user: {
      name: string;
      email: string;
    };
  };
  testName: string;
  testType: string;
  status: 'ORDERED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'CANCELLED';
  isCritical: boolean;
  orderedAt: string;
  completedAt: string | null;
  results: string | null;
  notes: string | null;
}

export default function DoctorLabTestsPage() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [criticalFilter, setCriticalFilter] = useState<string>('all');
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
    testName: '',
    testType: '',
    notes: '',
  });

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    filterTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests, searchQuery, statusFilter, criticalFilter]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lab-tests');
      const result = await response.json();

      if (result.success) {
        setTests(result.data);
      } else {
        toast.error(result.error || 'Failed to load lab tests');
      }
    } catch {
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = [...tests];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (test) =>
          test.patient.user.name.toLowerCase().includes(query) ||
          test.patient.user.email.toLowerCase().includes(query) ||
          test.patient.patientId.toLowerCase().includes(query) ||
          test.testId.toLowerCase().includes(query) ||
          test.testName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((test) => test.status === statusFilter);
    }

    // Critical filter
    if (criticalFilter && criticalFilter !== 'all') {
      if (criticalFilter === 'critical') {
        filtered = filtered.filter((test) => test.isCritical);
      } else if (criticalFilter === 'non-critical') {
        filtered = filtered.filter((test) => !test.isCritical);
      }
    }

    setFilteredTests(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCriticalFilter('all');
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

  const handleCreateTest = async () => {
    if (!formData.patientId || !formData.testName || !formData.testType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/lab-tests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Lab test ordered successfully');
        setCreateDialogOpen(false);
        setFormData({
          patientId: '',
          testName: '',
          testType: '',
          notes: '',
        });
        fetchTests();
      } else {
        toast.error(result.error || 'Failed to order lab test');
      }
    } catch {
      toast.error('Failed to order lab test');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ORDERED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
      REVIEWED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold tracking-tight">Lab Tests & Orders</h1>
          <p className="text-muted-foreground mt-1">Order and manage patient laboratory tests</p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Order Lab Test
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-2xl font-bold">{tests.length}</p>
            </div>
            <FlaskConical className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ordered</p>
              <p className="text-2xl font-bold">{tests.filter((t) => t.status === 'ORDERED').length}</p>
            </div>
            <FlaskConical className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{tests.filter((t) => t.status === 'COMPLETED').length}</p>
            </div>
            <FlaskConical className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold">{tests.filter((t) => t.isCritical).length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
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
                placeholder="Search tests..."
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
                <SelectItem value="ORDERED">Ordered</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Critical Filter */}
            <Select value={criticalFilter} onValueChange={setCriticalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Tests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="non-critical">Non-Critical Only</SelectItem>
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

      {/* Tests List */}
      <div className="space-y-3">
        {filteredTests.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No lab tests found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || criticalFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Order your first lab test'}
              </p>
            </div>
          </Card>
        ) : (
          filteredTests.map((test) => (
            <Card key={test.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Patient & Test Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{test.patient.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.patient.patientId}</p>
                    </div>
                    {test.isCritical && (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 border">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>

                  <div className="pl-13 space-y-2">
                    <div className="flex items-start gap-2">
                      <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-muted-foreground">Type: {test.testType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground pl-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Ordered: {format(new Date(test.orderedAt), 'MMM d, yyyy')}</span>
                      </div>
                      {test.completedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Completed: {format(new Date(test.completedAt), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>

                    {test.notes && (
                      <div className="pl-6 text-sm">
                        <span className="font-medium">Notes:</span>{' '}
                        <span className="text-muted-foreground">{test.notes}</span>
                      </div>
                    )}

                    {test.results && test.status === 'COMPLETED' && (
                      <div className="pl-6">
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">Results:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {test.results}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getStatusColor(test.status)} border flex items-center gap-1`}>
                    {getStatusIcon(test.status)}
                    {test.status}
                  </Badge>

                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    ID: {test.testId}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Test Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Lab Test</DialogTitle>
            <DialogDescription>
              Order a laboratory test for a patient. Results will be available once completed.
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
            </div>

            {/* Test Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Name *</label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) => setFormData((prev) => ({ ...prev, testName: e.target.value }))}
                placeholder="e.g., Complete Blood Count"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Test Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Type *</label>
              <Select
                value={formData.testType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, testType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOOD">Blood Test</SelectItem>
                  <SelectItem value="URINE">Urine Test</SelectItem>
                  <SelectItem value="IMAGING">Imaging (X-Ray, MRI, CT)</SelectItem>
                  <SelectItem value="BIOPSY">Biopsy</SelectItem>
                  <SelectItem value="CULTURE">Culture</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Special Instructions (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions for the lab..."
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
              onClick={handleCreateTest}
              disabled={creating || !formData.patientId || !formData.testName || !formData.testType}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ordering...
                </>
              ) : (
                'Order Test'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
