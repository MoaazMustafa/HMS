'use client';

import { format } from 'date-fns';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Heart,
  Loader2,
  Plus,
  Search,
  Thermometer,
  TrendingUp,
  User,
  Weight,
  Wind,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

interface VitalSign {
  id: string;
  systolicBP: number | null;
  diastolicBP: number | null;
  heartRate: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  oxygenSaturation: number | null;
  respiratoryRate: number | null;
  bmi: number | null;
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
  notes: string | null;
  recordedAt: string;
  patient: {
    id: string;
    patientId: string;
    user: {
      name: string;
      email: string;
    };
  };
}

interface Patient {
  id: string;
  patientId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function DoctorVitalSignsPage() {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    notes: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/patients');
      const result = await response.json();

      if (result.success) {
        setPatients(result.data);
        if (result.data.length === 0) {
          toast.info(
            'No patients found. Please add patients or check patient assignments.',
          );
        }
      } else {
        toast.error(result.error || 'Failed to load patients');
        console.error('Failed to load patients:', result);
      }
    } catch (error) {
      toast.error('Error loading patients');
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVitalSigns = async (patientId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vital-signs?patientId=${patientId}`);
      const result = await response.json();

      if (result.success) {
        setVitalSigns(result.data);
      } else {
        toast.error('Failed to load vital signs');
      }
    } catch (error) {
      toast.error('Error loading vital signs');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    await fetchVitalSigns(patient.id);
  };

  const handleAddVitalSigns = () => {
    if (!selectedPatient) {
      toast.error('Please select a patient first');
      return;
    }
    setAddDialogOpen(true);
    setFormData({
      systolicBP: '',
      diastolicBP: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: '',
      respiratoryRate: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error('No patient selected');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        patientId: selectedPatient.id,
        systolicBP: formData.systolicBP ? parseInt(formData.systolicBP) : null,
        diastolicBP: formData.diastolicBP
          ? parseInt(formData.diastolicBP)
          : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature
          ? parseFloat(formData.temperature)
          : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        oxygenSaturation: formData.oxygenSaturation
          ? parseInt(formData.oxygenSaturation)
          : null,
        respiratoryRate: formData.respiratoryRate
          ? parseInt(formData.respiratoryRate)
          : null,
        notes: formData.notes || null,
      };

      const response = await fetch('/api/vital-signs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Vital signs recorded successfully');
        setAddDialogOpen(false);
        await fetchVitalSigns(selectedPatient.id);
      } else {
        toast.error(result.error || 'Failed to record vital signs');
      }
    } catch (error) {
      toast.error('Error recording vital signs');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ABNORMAL':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return <CheckCircle className="h-4 w-4" />;
      case 'ABNORMAL':
        return <AlertCircle className="h-4 w-4" />;
      case 'CRITICAL':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vital Signs</h1>
          <p className="text-muted-foreground">
            Record and monitor patient vital signs
          </p>
        </div>
        <Button
          onClick={handleAddVitalSigns}
          disabled={!selectedPatient}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Record Vital Signs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Selection Panel */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Patient</h2>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : filteredPatients.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <User className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent border-border'
                    }`}
                  >
                    <div className="font-medium">{patient.user.name}</div>
                    <div className="text-muted-foreground text-sm">
                      ID: {patient.patientId}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Vital Signs History Panel */}
        <Card className="p-6 md:col-span-2">
          {!selectedPatient ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <Activity className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">
                No Patient Selected
              </h3>
              <p className="text-muted-foreground">
                Select a patient to view their vital signs history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedPatient.user.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Patient ID: {selectedPatient.patientId}
                  </p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {vitalSigns.length} Records
                </Badge>
              </div>

              <div className="max-h-[600px] space-y-3 overflow-y-auto">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))
                ) : vitalSigns.length === 0 ? (
                  <div className="text-muted-foreground py-12 text-center">
                    <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No vital signs recorded yet</p>
                  </div>
                ) : (
                  vitalSigns.map((vital) => (
                    <Card key={vital.id} className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`gap-1 ${getStatusColor(vital.status)}`}
                          >
                            {getStatusIcon(vital.status)}
                            {vital.status}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {format(
                              new Date(vital.recordedAt),
                              'MMM dd, yyyy HH:mm',
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {vital.systolicBP && vital.diastolicBP && (
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                BP
                              </div>
                              <div className="font-medium">
                                {vital.systolicBP}/{vital.diastolicBP}
                              </div>
                            </div>
                          </div>
                        )}
                        {vital.heartRate && (
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-pink-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                HR
                              </div>
                              <div className="font-medium">
                                {vital.heartRate} bpm
                              </div>
                            </div>
                          </div>
                        )}
                        {vital.temperature && (
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-orange-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                Temp
                              </div>
                              <div className="font-medium">
                                {vital.temperature}°C
                              </div>
                            </div>
                          </div>
                        )}
                        {vital.weight && (
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                Weight
                              </div>
                              <div className="font-medium">
                                {vital.weight} kg
                              </div>
                            </div>
                          </div>
                        )}
                        {vital.oxygenSaturation && (
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-cyan-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                SpO2
                              </div>
                              <div className="font-medium">
                                {vital.oxygenSaturation}%
                              </div>
                            </div>
                          </div>
                        )}
                        {vital.bmi && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <div>
                              <div className="text-muted-foreground text-xs">
                                BMI
                              </div>
                              <div className="font-medium">
                                {Number(vital.bmi).toFixed(1)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {vital.notes && (
                        <div className="text-muted-foreground mt-3 border-t pt-3 text-sm">
                          <span className="font-medium">Notes:</span>{' '}
                          {vital.notes}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add Vital Signs Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
            <DialogDescription>
              Record vital signs for {selectedPatient?.user.name} (
              {selectedPatient?.patientId})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                <Input
                  id="systolicBP"
                  type="number"
                  placeholder="120"
                  value={formData.systolicBP}
                  onChange={(e) =>
                    setFormData({ ...formData, systolicBP: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolicBP"
                  type="number"
                  placeholder="80"
                  value={formData.diastolicBP}
                  onChange={(e) =>
                    setFormData({ ...formData, diastolicBP: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  value={formData.heartRate}
                  onChange={(e) =>
                    setFormData({ ...formData, heartRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.6"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="98"
                  value={formData.oxygenSaturation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      oxygenSaturation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">
                  Respiratory Rate (breaths/min)
                </Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="16"
                  value={formData.respiratoryRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      respiratoryRate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional observations..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Vital Signs'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
