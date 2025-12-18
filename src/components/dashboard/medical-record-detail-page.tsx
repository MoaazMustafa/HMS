'use client';

import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type MedicalRecord = {
  id: string;
  recordId: string;
  visitDate: Date;
  chiefComplaint: string | null;
  physicalExam: string | null;
  assessment: string | null;
  plan: string | null;
  isSigned: boolean;
  isFinalized: boolean;
  signedAt: Date | null;
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
  diagnoses: Array<{
    id: string;
    description: string;
    icd10Code: string;
    isActive: boolean;
    diagnosedAt: Date;
  }>;
};

type Props = {
  record: MedicalRecord;
  userRole: 'DOCTOR' | 'PATIENT';
};

export function MedicalRecordDetailPage({ record, userRole }: Props) {
  // Parse physical exam for SOAP format
  const parsePhysicalExam = (exam: string | null) => {
    if (!exam) return { subjective: '', objective: '' };

    const parts = exam.split('\n\n');
    const subjective =
      parts
        .find((p) => p.startsWith('Subjective:'))
        ?.replace('Subjective:', '')
        .trim() || '';
    const objective =
      parts
        .find((p) => p.startsWith('Objective:'))
        ?.replace('Objective:', '')
        .trim() || '';

    return { subjective, objective };
  };

  const { subjective, objective } = parsePhysicalExam(record.physicalExam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/medical-records">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Medical Record
            </h1>
            <p className="text-muted-foreground mt-1">
              Record ID: <span className="font-mono">{record.recordId}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {record.isSigned ? (
            <Badge className="border border-green-500/20 bg-green-500/10 text-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Finalized
            </Badge>
          ) : (
            <Badge className="border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
              <AlertCircle className="mr-1 h-3 w-3" />
              Draft
            </Badge>
          )}
          {record.isSigned && (
            <Badge className="border border-blue-500/20 bg-blue-500/10 text-blue-500">
              Signed
            </Badge>
          )}
        </div>
      </div>

      {/* Patient & Visit Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Patient Info */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Patient Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="font-medium">{record.patient.user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Patient ID</p>
              <p className="font-mono text-sm">{record.patient.patientId}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-sm">{record.patient.user.email}</p>
            </div>
          </div>
        </Card>

        {/* Visit Info */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Visit Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm">Visit Date</p>
              <p className="font-medium">
                {format(new Date(record.visitDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Doctor</p>
              <p className="font-medium">
                Dr. {record.doctor.firstName} {record.doctor.lastName}
              </p>
              {record.doctor.specialization && (
                <p className="text-muted-foreground text-sm">
                  {record.doctor.specialization}
                </p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Created</p>
              <p className="text-sm">
                {format(new Date(record.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            {record.signedAt && (
              <div>
                <p className="text-muted-foreground text-sm">Signed</p>
                <p className="text-sm">
                  {format(new Date(record.signedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Chief Complaint */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="text-primary h-5 w-5" />
          <h2 className="text-lg font-semibold">Chief Complaint</h2>
        </div>
        <p className="text-foreground leading-relaxed">
          {record.chiefComplaint || 'Not recorded'}
        </p>
      </Card>

      {/* SOAP Notes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subjective */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Subjective</h2>
            <Badge variant="outline" className="text-xs">
              Patient&apos;s Description
            </Badge>
          </div>
          {subjective ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {subjective}
            </p>
          ) : (
            <p className="text-muted-foreground italic">Not recorded</p>
          )}
        </Card>

        {/* Objective */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Objective</h2>
            <Badge variant="outline" className="text-xs">
              Clinical Findings
            </Badge>
          </div>
          {objective ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {objective}
            </p>
          ) : (
            <p className="text-muted-foreground italic">Not recorded</p>
          )}
        </Card>
      </div>

      {/* Assessment & Plan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Assessment */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Assessment</h2>
            <Badge variant="outline" className="text-xs">
              Diagnosis
            </Badge>
          </div>
          {record.assessment ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {record.assessment}
            </p>
          ) : (
            <p className="text-muted-foreground italic">Not recorded</p>
          )}
        </Card>

        {/* Plan */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Plan</h2>
            <Badge variant="outline" className="text-xs">
              Treatment Plan
            </Badge>
          </div>
          {record.plan ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {record.plan}
            </p>
          ) : (
            <p className="text-muted-foreground italic">Not recorded</p>
          )}
        </Card>
      </div>

      {/* Diagnoses */}
      {record.diagnoses.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Diagnoses</h2>
            <Badge variant="outline">{record.diagnoses.length}</Badge>
          </div>
          <div className="space-y-3">
            {record.diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{diagnosis.description}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      ICD-10 Code:{' '}
                      <span className="font-mono">{diagnosis.icd10Code}</span>
                    </p>
                    <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                      <span>
                        Diagnosed:{' '}
                        {format(new Date(diagnosis.diagnosedAt), 'MMM d, yyyy')}
                      </span>
                      {diagnosis.isActive ? (
                        <Badge
                          variant="outline"
                          className="border-green-500/20 bg-green-500/10 text-xs text-green-500"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-gray-500/20 bg-gray-500/10 text-xs text-gray-500"
                        >
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer Info */}
      {record.isSigned && record.signedAt && (
        <Card className="border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-muted-foreground">
              This record has been finalized and digitally signed by Dr.{' '}
              {record.doctor.firstName} {record.doctor.lastName} on{' '}
              {format(new Date(record.signedAt), 'MMMM d, yyyy')} at{' '}
              {format(new Date(record.signedAt), 'h:mm a')}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
