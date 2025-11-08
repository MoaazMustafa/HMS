'use client';

import { format } from 'date-fns';
import {
  AlertTriangle,
  Calendar,
  Eye,
  Filter,
  Loader2,
  Pill,
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

interface Prescription {
  id: string;
  prescriptionId: string;
  patient: {
    id: string;
    patientId: string;
    user: {
      name: string;
      email: string;
    };
  };
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  refillsRemaining: number;
  issuedAt: string;
  expiresAt: string;
  interactions: Array<{
    interactsWith: string;
    severity: string;
    description: string;
  }>;
}

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
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
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refillsRemaining: 0,
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    filterPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptions, searchQuery, statusFilter, severityFilter]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prescriptions');
      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data);
      } else {
        toast.error(result.error || 'Failed to load prescriptions');
      }
    } catch {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    let filtered = [...prescriptions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (prescription) =>
          prescription.patient.user.name.toLowerCase().includes(query) ||
          prescription.patient.user.email.toLowerCase().includes(query) ||
          prescription.patient.patientId.toLowerCase().includes(query) ||
          prescription.prescriptionId.toLowerCase().includes(query) ||
          prescription.medicationName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((prescription) => prescription.status === statusFilter);
    }

    // Severity filter (interactions)
    if (severityFilter && severityFilter !== 'all') {
      filtered = filtered.filter((prescription) =>
        prescription.interactions.some((i) => i.severity === severityFilter)
      );
    }

    setFilteredPrescriptions(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSeverityFilter('all');
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

  const handleCreatePrescription = async () => {
    if (!formData.patientId || !formData.medicationName || !formData.dosage || !formData.frequency || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/prescriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Check for interactions
        if (result.interactions && result.interactions.length > 0) {
          const severeInteractions = result.interactions.filter((i: { severity: string }) => i.severity === 'SEVERE');
          if (severeInteractions.length > 0) {
            toast.warning(`Prescription created with ${severeInteractions.length} severe interaction(s)`, {
              description: 'Please review interactions before finalizing',
            });
          } else {
            toast.success('Prescription created with interaction warnings');
          }
        } else {
          toast.success('Prescription created successfully');
        }

        setCreateDialogOpen(false);
        setFormData({
          patientId: '',
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          refillsRemaining: 0,
        });
        fetchPrescriptions();
      } else {
        toast.error(result.error || 'Failed to create prescription');
      }
    } catch {
      toast.error('Failed to create prescription');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
      COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
      EXPIRED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      SEVERE: 'bg-red-500/10 text-red-500 border-red-500/20',
      MODERATE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      MILD: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    };
    return colors[severity] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
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
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">Manage patient prescriptions and medications</p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          New Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Prescriptions</p>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
            </div>
            <Pill className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{prescriptions.filter((p) => p.status === 'ACTIVE').length}</p>
            </div>
            <Pill className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">With Interactions</p>
              <p className="text-2xl font-bold">
                {prescriptions.filter((p) => p.interactions.length > 0).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold">{prescriptions.filter((p) => p.status === 'EXPIRED').length}</p>
            </div>
            <Pill className="h-8 w-8 text-gray-500" />
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
                placeholder="Search prescriptions..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>

            {/* Severity Filter */}
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Interaction Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="SEVERE">Severe</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="MILD">Mild</SelectItem>
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

      {/* Prescriptions List */}
      <div className="space-y-3">
        {filteredPrescriptions.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No prescriptions found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || severityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first prescription'}
              </p>
            </div>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Patient & Medication Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{prescription.patient.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{prescription.patient.patientId}</p>
                    </div>
                  </div>

                  <div className="pl-13 space-y-2">
                    <div className="flex items-start gap-2">
                      <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{prescription.medicationName}</p>
                        <p className="text-sm text-muted-foreground">
                          {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                        </p>
                        {prescription.instructions && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Instructions:</span> {prescription.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground pl-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Issued: {format(new Date(prescription.issuedAt), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {format(new Date(prescription.expiresAt), 'MMM d, yyyy')}</span>
                      </div>
                      <span>Refills: {prescription.refillsRemaining}</span>
                    </div>

                    {/* Interactions */}
                    {prescription.interactions.length > 0 && (
                      <div className="pl-6">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Drug Interactions:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prescription.interactions.slice(0, 2).map((interaction, idx) => (
                            <Badge
                              key={idx}
                              className={`${getSeverityColor(interaction.severity)} border`}
                            >
                              {interaction.severity}: {interaction.interactsWith}
                            </Badge>
                          ))}
                          {prescription.interactions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{prescription.interactions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getStatusColor(prescription.status)} border`}>
                    {prescription.status}
                  </Badge>

                  <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground">
                    ID: {prescription.prescriptionId}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Prescription Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prescription</DialogTitle>
            <DialogDescription>
              Create a new prescription for a patient. System will check for drug interactions and allergies.
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

            {/* Medication Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Medication Name *</label>
              <input
                type="text"
                value={formData.medicationName}
                onChange={(e) => setFormData((prev) => ({ ...prev, medicationName: e.target.value }))}
                placeholder="e.g., Amoxicillin"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Dosage, Frequency, Duration */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dosage *</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency *</label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value }))}
                  placeholder="e.g., 3 times daily"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 7 days"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Instructions (Optional)</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="e.g., Take with food, avoid alcohol"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Refills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Refills</label>
              <input
                type="number"
                min="0"
                value={formData.refillsRemaining}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, refillsRemaining: parseInt(e.target.value) || 0 }))
                }
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
              onClick={handleCreatePrescription}
              disabled={
                creating ||
                !formData.patientId ||
                !formData.medicationName ||
                !formData.dosage ||
                !formData.frequency ||
                !formData.duration
              }
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Prescription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
