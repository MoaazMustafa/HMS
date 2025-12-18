'use client';

import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  User,
  Pill,
  AlertTriangle,
  Clock,
  FileText,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Prescription = {
  id: string;
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  refillsRemaining: number;
  status: string;
  qrCode: string | null;
  digitalSignature: string | null;
  version: number;
  issuedAt: Date;
  expiresAt: Date | null;
  discontinuedAt: Date | null;
  discontinuedReason: string | null;
  createdAt: Date;
  patient: {
    patientId: string;
    user: {
      name: string | null;
      email: string;
    };
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialization: string | null;
    user: {
      name: string | null;
    };
  };
  diagnosis: {
    icd10Code: string;
    description: string;
  } | null;
  interactions: Array<{
    id: string;
    interactsWith: string;
    severity: string;
    description: string;
  }>;
};

interface PrescriptionDetailPageProps {
  prescription: Prescription;
  userRole: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  EXPIRED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const severityColors: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-500 border-red-500/20',
  MODERATE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  LOW: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export default function PrescriptionDetailPage({
  prescription,
}: PrescriptionDetailPageProps) {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/prescriptions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Prescription Details</h1>
            <p className="text-muted-foreground text-sm">
              ID: {prescription.prescriptionId}
            </p>
          </div>
        </div>
        <Badge className={statusColors[prescription.status]}>
          {prescription.status}
        </Badge>
      </div>

      {/* Patient & Doctor Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Patient Information</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="font-medium">
                {prescription.patient.user.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{prescription.patient.user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Patient ID</p>
              <p className="font-medium">{prescription.patient.patientId}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Prescribing Doctor</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="font-medium">
                Dr. {prescription.doctor.firstName}{' '}
                {prescription.doctor.lastName}
              </p>
            </div>
            {prescription.doctor.specialization && (
              <div>
                <p className="text-muted-foreground text-sm">Specialization</p>
                <p className="font-medium">
                  {prescription.doctor.specialization}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Medication Details */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Pill className="text-primary h-5 w-5" />
          <h2 className="text-lg font-semibold">Medication Details</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Medication Name</p>
            <p className="text-foreground text-lg font-semibold">
              {prescription.medicationName}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Dosage</p>
            <p className="font-medium">{prescription.dosage}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Frequency</p>
            <p className="font-medium">{prescription.frequency}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Duration</p>
            <p className="font-medium">{prescription.duration}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Refills Remaining</p>
            <div className="flex items-center gap-2">
              <RefreshCw className="text-muted-foreground h-4 w-4" />
              <p className="font-medium">{prescription.refillsRemaining}</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Version</p>
            <p className="font-medium">v{prescription.version}</p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      {prescription.instructions && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Instructions</h2>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {prescription.instructions}
          </p>
        </Card>
      )}

      {/* Diagnosis */}
      {prescription.diagnosis && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Related Diagnosis</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">ICD-10 Code</p>
              <p className="font-medium">{prescription.diagnosis.icd10Code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Description</p>
              <p className="font-medium">
                {prescription.diagnosis.description}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Drug Interactions */}
      {prescription.interactions.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">Drug Interactions</h2>
            <Badge variant="destructive">
              {prescription.interactions.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {prescription.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`rounded-lg border p-4 ${severityColors[interaction.severity]}`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="font-semibold">{interaction.interactsWith}</p>
                  </div>
                  <Badge className={severityColors[interaction.severity]}>
                    {interaction.severity}
                  </Badge>
                </div>
                <p className="text-sm">{interaction.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Issued Date</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            {format(new Date(prescription.issuedAt), 'MMMM d, yyyy')}
          </p>
          <p className="text-muted-foreground text-xs">
            {format(new Date(prescription.issuedAt), 'h:mm a')}
          </p>
        </Card>

        {prescription.expiresAt && (
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Expires On</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(new Date(prescription.expiresAt), 'MMMM d, yyyy')}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(prescription.expiresAt), 'h:mm a')}
            </p>
          </Card>
        )}

        {prescription.discontinuedAt && (
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">Discontinued</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(new Date(prescription.discontinuedAt), 'MMMM d, yyyy')}
            </p>
            {prescription.discontinuedReason && (
              <p className="text-muted-foreground mt-2 text-xs">
                Reason: {prescription.discontinuedReason}
              </p>
            )}
          </Card>
        )}
      </div>

      {/* Digital Signature */}
      {prescription.digitalSignature && (
        <Card className="border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-muted-foreground">
              This prescription has been digitally signed by Dr.{' '}
              {prescription.doctor.firstName} {prescription.doctor.lastName}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
