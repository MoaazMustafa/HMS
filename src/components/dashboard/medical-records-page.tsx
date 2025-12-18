'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  Syringe,
  Calendar,
  User,
  Shield,
  Search,
  CheckCircle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type MedicalRecord = {
  id: string;
  recordId: string;
  visitDate: Date;
  chiefComplaint?: string;
  physicalExam?: string;
  assessment?: string;
  plan?: string;
  isFinalized: boolean;
  doctor: {
    user: {
      name: string;
    };
    specialization: string;
  };
  diagnoses: {
    id: string;
    icd10Code: string;
    description: string;
    isActive: boolean;
    diagnosedAt: Date;
  }[];
};

type Allergy = {
  id: string;
  allergen: string;
  type: string;
  severity: string;
  reaction?: string;
  diagnosedAt?: Date;
  notes?: string;
};

type Immunization = {
  id: string;
  vaccineName: string;
  dateAdministered: Date;
  doseNumber?: number;
  nextDueDate?: Date;
  administeredBy?: string;
  lotNumber?: string;
  site?: string;
  notes?: string;
};

type Props = {
  medicalRecords: MedicalRecord[];
  allergies: Allergy[];
  immunizations: Immunization[];
};

export function MedicalRecordsPage({
  medicalRecords,
  allergies,
  immunizations,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    'records' | 'allergies' | 'immunizations'
  >('records');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    {
      id: 'records' as const,
      label: 'Medical Records',
      icon: FileText,
      count: medicalRecords.length,
    },
    {
      id: 'allergies' as const,
      label: 'Allergies',
      icon: AlertTriangle,
      count: allergies.length,
    },
    {
      id: 'immunizations' as const,
      label: 'Immunizations',
      icon: Syringe,
      count: immunizations.length,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
      case 'SEVERE':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'MILD':
        return 'bg-green-500/20 text-green-500 border-green-500/20';
      default:
        return 'bg-background-500/20 text-background-500 border-background-500/20';
    }
  };

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'records':
        return medicalRecords.filter(
          (record) =>
            record.recordId.toLowerCase().includes(query) ||
            record.chiefComplaint?.toLowerCase().includes(query) ||
            record.doctor.user.name.toLowerCase().includes(query) ||
            record.diagnoses.some(
              (d) =>
                d.description.toLowerCase().includes(query) ||
                d.icd10Code.toLowerCase().includes(query),
            ),
        );
      case 'allergies':
        return allergies.filter(
          (allergy) =>
            allergy.allergen.toLowerCase().includes(query) ||
            allergy.type.toLowerCase().includes(query),
        );
      case 'immunizations':
        return immunizations.filter((immunization) =>
          immunization.vaccineName.toLowerCase().includes(query),
        );
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Medical Records
          </h1>
          <p className="text-background-400">
            View your complete medical history and health information
          </p>
        </div>
        <div className="bg-background-900/50 border-background-800 rounded-lg border p-4">
          <Shield className="text-primary mb-2 h-6 w-6" />
          <p className="text-background-500 text-xs">Read-only Access</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background-900/50 border-background-800 rounded-lg border p-4 backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className="text-primary h-5 w-5" />
                <span className="text-foreground text-2xl font-bold">
                  {tab.count}
                </span>
              </div>
              <p className="text-background-400 text-sm">{tab.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs and Search */}
      <div className="bg-background-900/50 border-background-800 rounded-lg border p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-background'
                      : 'bg-background-800 text-background-400 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-background-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background-800 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <>
            {filteredData().length === 0 ? (
              <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
                <FileText className="text-background-600 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No records found
                </h3>
                <p className="text-background-400">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No medical records available yet'}
                </p>
              </div>
            ) : (
              (filteredData() as MedicalRecord[]).map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <FileText className="text-primary mt-1 h-5 w-5 shrink-0" />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="text-foreground text-lg font-semibold">
                              Record #{record.recordId}
                            </h3>
                            {record.isFinalized && (
                              <span className="rounded border border-green-500/20 bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">
                                <CheckCircle className="mr-1 inline h-3 w-3" />
                                Finalized
                              </span>
                            )}
                          </div>
                          <div className="text-background-400 flex flex-wrap items-center gap-2 text-sm">
                            <span>Dr. {record.doctor.user.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(record.visitDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/dashboard/medical-records/${record.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </Link>
                    </div>

                    {/* Diagnoses */}
                    {record.diagnoses.length > 0 && (
                      <div className="bg-background-800/50 rounded-lg p-4">
                        <h4 className="text-primary mb-3 text-sm font-semibold">
                          Diagnoses
                        </h4>
                        <div className="space-y-2">
                          {record.diagnoses.map((diagnosis) => (
                            <div
                              key={diagnosis.id}
                              className="bg-background-900/50 flex items-start justify-between gap-4 rounded p-3"
                            >
                              <div className="flex-1">
                                <p className="text-foreground font-medium">
                                  {diagnosis.description}
                                </p>
                                <p className="text-background-500 mt-1 font-mono text-xs">
                                  ICD-10: {diagnosis.icd10Code}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded border px-2 py-1 text-xs font-medium ${
                                  diagnosis.isActive
                                    ? 'border-red-500/20 bg-red-500/20 text-red-500'
                                    : 'border-green-500/20 bg-green-500/20 text-green-500'
                                }`}
                              >
                                {diagnosis.isActive ? 'Active' : 'Resolved'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SOAP Notes */}
                    {(record.chiefComplaint ||
                      record.physicalExam ||
                      record.assessment ||
                      record.plan) && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {record.chiefComplaint && (
                          <div className="bg-background-800/50 rounded-lg p-4">
                            <h4 className="text-primary mb-2 text-sm font-semibold">
                              S - Subjective
                            </h4>
                            <p className="text-background-300 text-sm">
                              {record.chiefComplaint}
                            </p>
                          </div>
                        )}
                        {record.physicalExam && (
                          <div className="bg-background-800/50 rounded-lg p-4">
                            <h4 className="text-primary mb-2 text-sm font-semibold">
                              O - Objective
                            </h4>
                            <p className="text-background-300 text-sm">
                              {record.physicalExam}
                            </p>
                          </div>
                        )}
                        {record.assessment && (
                          <div className="bg-background-800/50 rounded-lg p-4">
                            <h4 className="text-primary mb-2 text-sm font-semibold">
                              A - Assessment
                            </h4>
                            <p className="text-background-300 text-sm">
                              {record.assessment}
                            </p>
                          </div>
                        )}
                        {record.plan && (
                          <div className="bg-background-800/50 rounded-lg p-4">
                            <h4 className="text-primary mb-2 text-sm font-semibold">
                              P - Plan
                            </h4>
                            <p className="text-background-300 text-sm">
                              {record.plan}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}

        {/* Allergies Tab */}
        {activeTab === 'allergies' && (
          <>
            {allergies.length > 0 && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-red-400">
                    Active Allergies - Critical Information
                  </p>
                  <p className="text-xs text-red-400/80">
                    Healthcare providers must review this list before
                    prescribing medications or treatments.
                  </p>
                </div>
              </div>
            )}
            {filteredData().length === 0 ? (
              <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
                <AlertTriangle className="text-background-600 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No allergies found
                </h3>
                <p className="text-background-400">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No known allergies recorded'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {(filteredData() as Allergy[]).map((allergy, index) => (
                  <motion.div
                    key={allergy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                      <div className="flex-1">
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                          {allergy.allergen}
                        </h3>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="bg-background-800 text-background-300 rounded px-2 py-1 text-xs font-medium">
                            {allergy.type}
                          </span>
                          {allergy.severity && (
                            <span
                              className={`rounded border px-2 py-1 text-xs font-medium ${getSeverityColor(
                                allergy.severity,
                              )}`}
                            >
                              {allergy.severity}
                            </span>
                          )}
                        </div>
                        {allergy.reaction && (
                          <p className="text-background-400 mb-2 text-sm">
                            <span className="font-semibold">Reaction:</span>{' '}
                            {allergy.reaction}
                          </p>
                        )}
                        {allergy.diagnosedAt && (
                          <p className="text-background-500 text-xs">
                            Diagnosed:{' '}
                            {new Date(allergy.diagnosedAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </p>
                        )}
                        {allergy.notes && (
                          <p className="text-background-400 bg-background-800/50 mt-2 rounded p-2 text-xs">
                            {allergy.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Immunizations Tab */}
        {activeTab === 'immunizations' && (
          <>
            {filteredData().length === 0 ? (
              <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
                <Syringe className="text-background-600 mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No immunizations found
                </h3>
                <p className="text-background-400">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No immunization records available'}
                </p>
              </div>
            ) : (
              (filteredData() as Immunization[]).map((immunization, index) => (
                <motion.div
                  key={immunization.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <Syringe className="text-primary mt-1 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-foreground mb-1 text-lg font-semibold">
                            {immunization.vaccineName}
                          </h3>
                          {immunization.doseNumber && (
                            <p className="text-background-400 text-sm">
                              Dose #{immunization.doseNumber}
                            </p>
                          )}
                        </div>
                        {immunization.nextDueDate &&
                          new Date(immunization.nextDueDate) > new Date() && (
                            <span className="rounded border border-yellow-500/20 bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-500">
                              Next Due:{' '}
                              {new Date(
                                immunization.nextDueDate,
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                      </div>
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-background-500">Administered</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-background-500 h-4 w-4" />
                            <p className="text-foreground">
                              {new Date(
                                immunization.dateAdministered,
                              ).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        {immunization.administeredBy && (
                          <div>
                            <p className="text-background-500">
                              Administered By
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="text-background-500 h-4 w-4" />
                              <p className="text-foreground">
                                {immunization.administeredBy}
                              </p>
                            </div>
                          </div>
                        )}
                        {immunization.site && (
                          <div>
                            <p className="text-background-500">Site</p>
                            <p className="text-foreground">
                              {immunization.site}
                            </p>
                          </div>
                        )}
                        {immunization.lotNumber && (
                          <div>
                            <p className="text-background-500">Lot Number</p>
                            <p className="text-foreground font-mono text-xs">
                              {immunization.lotNumber}
                            </p>
                          </div>
                        )}
                      </div>
                      {immunization.notes && (
                        <p className="text-background-400 bg-background-800/50 mt-3 rounded p-3 text-sm">
                          {immunization.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
