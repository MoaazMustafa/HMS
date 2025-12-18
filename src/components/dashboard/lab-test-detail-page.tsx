'use client';

import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  User,
  FlaskConical,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type LabTest = {
  id: string;
  testId: string;
  patientId: string;
  doctorId: string;
  testName: string;
  testType: string | null;
  description: string | null;
  status: string;
  orderedAt: Date;
  collectedAt: Date | null;
  completedAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  results: string | null;
  resultFile: string | null;
  isCritical: boolean;
  criticalAlertSent: boolean;
  notes: string | null;
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
};

interface LabTestDetailPageProps {
  labTest: LabTest;
  userRole: string;
}

const statusColors: Record<string, string> = {
  ORDERED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  COLLECTED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  IN_PROGRESS: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function LabTestDetailPage({
  labTest,
  userRole,
}: LabTestDetailPageProps) {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={
              userRole === 'DOCTOR'
                ? '/dashboard/lab-orders'
                : '/dashboard/lab-results'
            }
          >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Lab Test Details</h1>
            <p className="text-muted-foreground text-sm">
              Test ID: {labTest.testId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {labTest.isCritical && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Critical
            </Badge>
          )}
          <Badge className={statusColors[labTest.status]}>
            {labTest.status.replace('_', ' ')}
          </Badge>
        </div>
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
                {labTest.patient.user.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{labTest.patient.user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Patient ID</p>
              <p className="font-medium">{labTest.patient.patientId}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Ordering Doctor</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="font-medium">
                Dr. {labTest.doctor.firstName} {labTest.doctor.lastName}
              </p>
            </div>
            {labTest.doctor.specialization && (
              <div>
                <p className="text-muted-foreground text-sm">Specialization</p>
                <p className="font-medium">{labTest.doctor.specialization}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Test Details */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical className="text-primary h-5 w-5" />
          <h2 className="text-lg font-semibold">Test Details</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Test Name</p>
            <p className="text-foreground text-lg font-semibold">
              {labTest.testName}
            </p>
          </div>
          {labTest.testType && (
            <div>
              <p className="text-muted-foreground text-sm">Test Type</p>
              <p className="font-medium">{labTest.testType}</p>
            </div>
          )}
        </div>
        {labTest.description && (
          <div className="mt-4">
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="text-foreground leading-relaxed">
              {labTest.description}
            </p>
          </div>
        )}
      </Card>

      {/* Diagnosis */}
      {labTest.diagnosis && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Related Diagnosis</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">ICD-10 Code</p>
              <p className="font-medium">{labTest.diagnosis.icd10Code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Description</p>
              <p className="font-medium">{labTest.diagnosis.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {labTest.results && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Test Results</h2>
            {labTest.isCritical && (
              <Badge variant="destructive" className="ml-2">
                Critical Values Detected
              </Badge>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {labTest.results}
            </p>
          </div>
          {labTest.resultFile && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Full Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Report
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Notes */}
      {labTest.notes && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Additional Notes</h2>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {labTest.notes}
          </p>
        </Card>
      )}

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold">Ordered</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            {format(new Date(labTest.orderedAt), 'MMM d, yyyy')}
          </p>
          <p className="text-muted-foreground text-xs">
            {format(new Date(labTest.orderedAt), 'h:mm a')}
          </p>
        </Card>

        {labTest.collectedAt && (
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Collected</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(new Date(labTest.collectedAt), 'MMM d, yyyy')}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(labTest.collectedAt), 'h:mm a')}
            </p>
          </Card>
        )}

        {labTest.completedAt && (
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-semibold">Completed</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(new Date(labTest.completedAt), 'MMM d, yyyy')}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(labTest.completedAt), 'h:mm a')}
            </p>
          </Card>
        )}

        {labTest.reviewedAt && (
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-semibold">Reviewed</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(new Date(labTest.reviewedAt), 'MMM d, yyyy')}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(labTest.reviewedAt), 'h:mm a')}
            </p>
          </Card>
        )}
      </div>

      {/* Critical Alert Notice */}
      {labTest.isCritical && labTest.criticalAlertSent && (
        <Card className="border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-muted-foreground">
              Critical values detected. An alert has been sent to the ordering
              physician.
            </p>
          </div>
        </Card>
      )}

      {/* Reviewed Info */}
      {labTest.reviewedAt && labTest.reviewedBy && (
        <Card className="border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-muted-foreground">
              This lab test has been reviewed by Dr. {labTest.doctor.firstName}{' '}
              {labTest.doctor.lastName} on{' '}
              {format(new Date(labTest.reviewedAt), 'MMMM d, yyyy')}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
