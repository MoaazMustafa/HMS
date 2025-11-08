'use client';

import { format } from 'date-fns';
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  FlaskConical,
  Heart,
  Mail,
  Phone,
  Pill,
  Plus,
  Stethoscope,
  User,
  UserMinus,
  UserPlus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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

type PatientDetailPageProps = {
  patient: any; // TODO: Type this properly
};

export function PatientDetailPage({ patient }: PatientDetailPageProps) {
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [addDoctorDialogOpen, setAddDoctorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [reassignNotes, setReassignNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      CONFIRMED: 'bg-green-500/10 text-green-500 border-green-500/20',
      IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      COMPLETED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
      NO_SHOW: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getGenderIcon = (gender: string) => {
    if (gender === 'MALE') return '👨';
    if (gender === 'FEMALE') return '👩';
    return '⚧️';
  };

  const calculateAge = (dateOfBirth: Date) => {
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

  const handleOpenReassignDialog = async () => {
    setReassignDialogOpen(true);
    // Fetch available doctors
    try {
      const response = await fetch('/api/doctors');
      const result = await response.json();
      if (result.success) {
        setDoctors(result.data);
      }
    } catch {
      toast.error('Failed to load doctors list');
    }
  };

  const handleOpenAddDoctorDialog = async () => {
    setAddDoctorDialogOpen(true);
    setSelectedDoctorId('');
    // Fetch available doctors
    try {
      const response = await fetch('/api/doctors');
      const result = await response.json();
      if (result.success) {
        // Filter out already assigned doctors
        const assignedDoctorIds = patient.activeAssignments?.map((a: any) => a.doctorId) || [];
        const availableDoctors = result.data.filter((d: any) => !assignedDoctorIds.includes(d.id));
        setDoctors(availableDoctors);
      }
    } catch {
      toast.error('Failed to load doctors list');
    }
  };

  const handleAddDoctor = async () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}/assign-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          notes: 'Added to care team',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setAddDoctorDialogOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to add doctor');
      }
    } catch {
      toast.error('Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = async (doctorId: string) => {
    if (!confirm('Are you sure you want to remove this doctor from the care team?')) {
      return;
    }

    try {
      const response = await fetch(`/api/patients/${patient.id}/assign-doctor?doctorId=${doctorId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to remove doctor');
      }
    } catch {
      toast.error('Failed to remove doctor');
    }
  };

  const handleReassignPatient = async () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDoctorId: selectedDoctorId,
          notes: reassignNotes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setReassignDialogOpen(false);
        setConfirmDialogOpen(false);
        setTimeout(() => {
          window.location.href = '/dashboard/patients';
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to reassign patient');
      }
    } catch (error) {
      toast.error('Failed to reassign patient');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReassignment = () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }
    setReassignDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Profile</h1>
          <p className="text-muted-foreground mt-1">
            Complete patient information and medical history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenReassignDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            Reassign Patient
          </Button>
          <Link href="/dashboard/patients">
            <Button variant="outline">Back to Patients</Button>
          </Link>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
            {getGenderIcon(patient.gender)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{patient.user.name}</h2>
              <p className="text-muted-foreground">
                Patient ID: {patient.patientId}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {calculateAge(patient.dateOfBirth)} years old (
                  {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.phone || patient.user.phoneNumber}</span>
              </div>
              {patient.bloodGroup && (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Blood: {patient.bloodGroup}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Registered {format(new Date(patient.user.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {patient.allergies && patient.allergies.length > 0 && (
              <div className="flex items-start gap-2 mt-4 p-3 bg-red-500/10 rounded-md border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-500">Known Allergies:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.allergies.map((allergy: any) => (
                      <Badge key={allergy.id} className="bg-red-500/10 text-red-500 border-red-500/20">
                        {allergy.allergen} ({allergy.type})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Care Team */}
      {patient.activeAssignments && patient.activeAssignments.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Care Team</h3>
              <Badge variant="outline">{patient.activeAssignments.length} doctor{patient.activeAssignments.length !== 1 ? 's' : ''}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenAddDoctorDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patient.activeAssignments.map((assignment: any) => (
              <div key={assignment.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">
                      Dr. {assignment.doctor.firstName} {assignment.doctor.lastName}
                    </p>
                    {assignment.doctor.specialization && (
                      <p className="text-sm text-muted-foreground">{assignment.doctor.specialization}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned {format(new Date(assignment.assignedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {patient.activeAssignments.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDoctor(assignment.doctorId)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Medical History & Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical History */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Medical History</h3>
          </div>
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            <ul className="space-y-2">
              {patient.medicalHistory.map((condition: string, idx: number) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {condition}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No medical history recorded
            </p>
          )}
        </Card>

        {/* Emergency Contact */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
          </div>
          {patient.emergencyContactName ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">
                  {patient.emergencyContactName}
                </p>
                {patient.emergencyContactRelation && (
                  <p className="text-xs text-muted-foreground">
                    {patient.emergencyContactRelation}
                  </p>
                )}
              </div>
              {patient.emergencyContactPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {patient.emergencyContactPhone}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No emergency contact recorded
            </p>
          )}
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Appointments</h3>
          </div>
          <Badge variant="outline">{patient.appointments.length} total</Badge>
        </div>
        {patient.appointments.length > 0 ? (
          <div className="space-y-3">
            {patient.appointments.map((appointment: any) => (
              <Link
                key={appointment.id}
                href={`/dashboard/appointments/${appointment.id}`}
              >
                <div className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Dr. {appointment.doctor.firstName}{' '}
                        {appointment.doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor.specialization}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(
                            new Date(appointment.scheduledDate),
                            'MMM d, yyyy'
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.scheduledTime}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(appointment.status)}
                    >
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No appointments recorded
          </p>
        )}
      </Card>

      {/* Prescriptions & Lab Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescriptions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Recent Prescriptions</h3>
            </div>
            <Badge variant="outline">{patient.prescriptions.length} total</Badge>
          </div>
          {patient.prescriptions.length > 0 ? (
            <div className="space-y-3">
              {patient.prescriptions.map((prescription: any) => (
                <div
                  key={prescription.id}
                  className="p-3 rounded-lg border space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">
                      {prescription.medications[0]?.name || 'Multiple medications'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {prescription.medications.length} med
                      {prescription.medications.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dr. {prescription.doctor.firstName}{' '}
                    {prescription.doctor.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(prescription.issuedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No prescriptions recorded
            </p>
          )}
        </Card>

        {/* Lab Tests */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Lab Tests</h3>
            </div>
            <Badge variant="outline">{patient.labTests.length} total</Badge>
          </div>
          {patient.labTests.length > 0 ? (
            <div className="space-y-3">
              {patient.labTests.map((test: any) => (
                <div
                  key={test.id}
                  className="p-3 rounded-lg border space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{test.testType}</p>
                    <Badge
                      variant="outline"
                      className={
                        test.status === 'COMPLETED'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : test.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }
                    >
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ordered: {format(new Date(test.orderedAt), 'MMM d, yyyy')}
                  </p>
                  {test.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      Completed:{' '}
                      {format(new Date(test.completedAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No lab tests recorded
            </p>
          )}
        </Card>
      </div>

      {/* Medical Records */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Medical Records</h3>
          </div>
          <Badge variant="outline">{patient.medicalRecords.length} total</Badge>
        </div>
        {patient.medicalRecords.length > 0 ? (
          <div className="space-y-3">
            {patient.medicalRecords.map((record: any) => (
              <div
                key={record.id}
                className="p-4 rounded-lg border space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {record.assessment || 'Medical Record'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dr. {record.doctor.firstName} {record.doctor.lastName}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(record.visitDate), 'MMM d, yyyy')}
                  </p>
                </div>
                {record.chiefComplaint && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Chief Complaint:
                    </p>
                    <p className="text-sm">{record.chiefComplaint}</p>
                  </div>
                )}
                {record.plan && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Treatment Plan:
                    </p>
                    <p className="text-sm">{record.plan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No medical records found
          </p>
        )}
      </Card>

      {/* Reassign Patient Dialog */}
      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Reassign Patient
            </DialogTitle>
            <DialogDescription>
              Transfer {patient.user.name} to another doctor. This action will update
              the patient&apos;s assigned doctor and notify both parties.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select New Doctor <span className="text-destructive">*</span>
              </label>
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors
                    .filter((doc) => doc.isActive)
                    .map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName} -{' '}
                        {doctor.specialization}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={reassignNotes}
                onChange={(e) => setReassignNotes(e.target.value)}
                placeholder="Add notes about this reassignment..."
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReassignDialogOpen(false);
                setSelectedDoctorId('');
                setReassignNotes('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmReassignment}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Patient Reassignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reassign{' '}
              <strong>{patient.user.name}</strong> to{' '}
              <strong>
                Dr.{' '}
                {doctors.find((d) => d.id === selectedDoctorId)?.firstName}{' '}
                {doctors.find((d) => d.id === selectedDoctorId)?.lastName}
              </strong>
              ? This patient will no longer appear in your patients list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmDialogOpen(false);
                setReassignDialogOpen(true);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleReassignPatient} disabled={loading}>
              {loading ? 'Reassigning...' : 'Confirm Reassignment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Doctor Dialog */}
      <Dialog open={addDoctorDialogOpen} onOpenChange={setAddDoctorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Doctor to Care Team
            </DialogTitle>
            <DialogDescription>
              Add another doctor to {patient.user.name}&apos;s care team. Multiple doctors can manage this patient.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Doctor <span className="text-destructive">*</span>
              </label>
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors
                    .filter((doc) => doc.isActive)
                    .map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName} -{' '}
                        {doctor.specialization || 'General'}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {doctors.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No available doctors to add. All doctors are already assigned to this patient.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddDoctorDialogOpen(false);
                setSelectedDoctorId('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddDoctor} disabled={loading || !selectedDoctorId}>
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
