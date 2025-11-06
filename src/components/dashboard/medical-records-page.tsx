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
} from 'lucide-react';
import { useState } from 'react';

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

export function MedicalRecordsPage({ medicalRecords, allergies, immunizations }: Props) {
  const [activeTab, setActiveTab] = useState<'records' | 'allergies' | 'immunizations'>('records');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'records' as const, label: 'Medical Records', icon: FileText, count: medicalRecords.length },
    { id: 'allergies' as const, label: 'Allergies', icon: AlertTriangle, count: allergies.length },
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
        return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
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
                d.description.toLowerCase().includes(query) || d.icd10Code.toLowerCase().includes(query)
            )
        );
      case 'allergies':
        return allergies.filter(
          (allergy) =>
            allergy.allergen.toLowerCase().includes(query) || allergy.type.toLowerCase().includes(query)
        );
      case 'immunizations':
        return immunizations.filter((immunization) =>
          immunization.vaccineName.toLowerCase().includes(query)
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
          <h1 className="text-3xl font-bold text-white mb-2">Medical Records</h1>
          <p className="text-zinc-400">View your complete medical history and health information</p>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <Shield className="w-6 h-6 text-primary mb-2" />
          <p className="text-xs text-zinc-500">Read-only Access</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-white">{tab.count}</span>
              </div>
              <p className="text-sm text-zinc-400">{tab.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs and Search */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No records found</h3>
                <p className="text-zinc-400">
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
                  className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">
                              Record #{record.recordId}
                            </h3>
                            {record.isFinalized && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-500 border border-green-500/20 rounded text-xs font-medium">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Finalized
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                            <span>Dr. {record.doctor.user.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(record.visitDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Diagnoses */}
                    {record.diagnoses.length > 0 && (
                      <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-primary mb-3">Diagnoses</h4>
                        <div className="space-y-2">
                          {record.diagnoses.map((diagnosis) => (
                            <div
                              key={diagnosis.id}
                              className="flex items-start justify-between gap-4 p-3 bg-zinc-900/50 rounded"
                            >
                              <div className="flex-1">
                                <p className="text-white font-medium">{diagnosis.description}</p>
                                <p className="text-xs text-zinc-500 font-mono mt-1">
                                  ICD-10: {diagnosis.icd10Code}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium border shrink-0 ${
                                  diagnosis.isActive
                                    ? 'bg-red-500/20 text-red-500 border-red-500/20'
                                    : 'bg-green-500/20 text-green-500 border-green-500/20'
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
                    {(record.chiefComplaint || record.physicalExam || record.assessment || record.plan) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {record.chiefComplaint && (
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary mb-2">S - Subjective</h4>
                            <p className="text-sm text-zinc-300">{record.chiefComplaint}</p>
                          </div>
                        )}
                        {record.physicalExam && (
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary mb-2">O - Objective</h4>
                            <p className="text-sm text-zinc-300">{record.physicalExam}</p>
                          </div>
                        )}
                        {record.assessment && (
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary mb-2">A - Assessment</h4>
                            <p className="text-sm text-zinc-300">{record.assessment}</p>
                          </div>
                        )}
                        {record.plan && (
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary mb-2">P - Plan</h4>
                            <p className="text-sm text-zinc-300">{record.plan}</p>
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
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-1">
                    Active Allergies - Critical Information
                  </p>
                  <p className="text-xs text-red-400/80">
                    Healthcare providers must review this list before prescribing medications or treatments.
                  </p>
                </div>
              </div>
            )}
            {filteredData().length === 0 ? (
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No allergies found</h3>
                <p className="text-zinc-400">
                  {searchQuery ? 'Try adjusting your search criteria' : 'No known allergies recorded'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {(filteredData() as Allergy[]).map((allergy, index) => (
                  <motion.div
                    key={allergy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{allergy.allergen}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-medium">
                            {allergy.type}
                          </span>
                          {allergy.severity && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
                                allergy.severity
                              )}`}
                            >
                              {allergy.severity}
                            </span>
                          )}
                        </div>
                        {allergy.reaction && (
                          <p className="text-sm text-zinc-400 mb-2">
                            <span className="font-semibold">Reaction:</span> {allergy.reaction}
                          </p>
                        )}
                        {allergy.diagnosedAt && (
                          <p className="text-xs text-zinc-500">
                            Diagnosed:{' '}
                            {new Date(allergy.diagnosedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                        {allergy.notes && (
                          <p className="text-xs text-zinc-400 mt-2 p-2 bg-zinc-800/50 rounded">
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
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-12 text-center">
                <Syringe className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No immunizations found</h3>
                <p className="text-zinc-400">
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
                  className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
                >
                  <div className="flex items-start gap-3">
                    <Syringe className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {immunization.vaccineName}
                          </h3>
                          {immunization.doseNumber && (
                            <p className="text-sm text-zinc-400">Dose #{immunization.doseNumber}</p>
                          )}
                        </div>
                        {immunization.nextDueDate && new Date(immunization.nextDueDate) > new Date() && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded text-xs font-medium">
                            Next Due:{' '}
                            {new Date(immunization.nextDueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-zinc-500">Administered</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <p className="text-white">
                              {new Date(immunization.dateAdministered).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        {immunization.administeredBy && (
                          <div>
                            <p className="text-zinc-500">Administered By</p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-500" />
                              <p className="text-white">{immunization.administeredBy}</p>
                            </div>
                          </div>
                        )}
                        {immunization.site && (
                          <div>
                            <p className="text-zinc-500">Site</p>
                            <p className="text-white">{immunization.site}</p>
                          </div>
                        )}
                        {immunization.lotNumber && (
                          <div>
                            <p className="text-zinc-500">Lot Number</p>
                            <p className="text-white font-mono text-xs">{immunization.lotNumber}</p>
                          </div>
                        )}
                      </div>
                      {immunization.notes && (
                        <p className="text-sm text-zinc-400 mt-3 p-3 bg-zinc-800/50 rounded">
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
