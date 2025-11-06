'use client';

import { motion } from 'framer-motion';
import {
  Pill,
  Download,
  QrCode,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type Prescription = {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  refillsAllowed: number;
  refillsRemaining: number;
  issuedAt: Date;
  expiryDate?: Date;
  status: string;
  isActive: boolean;
  doctor: {
    user: {
      name: string;
    };
    specialization: string;
  };
};

type Props = {
  prescriptions: Prescription[];
};

export function PrescriptionsPage({ prescriptions }: Props) {
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrescriptions = prescriptions.filter((rx) => {
    // Filter by status
    if (filter === 'active' && !rx.isActive) return false;
    if (filter === 'expired' && rx.isActive) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rx.medicationName.toLowerCase().includes(query) ||
        rx.prescriptionId.toLowerCase().includes(query) ||
        rx.doctor.user.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'EXPIRED':
        return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
      default:
        return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
    }
  };

  const handleDownloadPDF = (prescriptionId: string) => {
    // TODO: Implement PDF download
    console.log('Download PDF for prescription:', prescriptionId);
  };

  const handleShowQR = (prescriptionId: string) => {
    // TODO: Implement QR code display
    console.log('Show QR code for prescription:', prescriptionId);
  };

  const activePrescriptions = prescriptions.filter((rx) => rx.isActive).length;
  const totalRefills = prescriptions.reduce((sum, rx) => sum + rx.refillsRemaining, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Prescriptions</h1>
          <p className="text-zinc-400">View and manage your prescription medications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Prescriptions',
            value: prescriptions.length,
            icon: Pill,
            color: 'text-blue-500',
          },
          {
            label: 'Active',
            value: activePrescriptions,
            icon: CheckCircle,
            color: 'text-green-500',
          },
          {
            label: 'Total Refills',
            value: totalRefills,
            icon: RefreshCw,
            color: 'text-primary',
          },
          {
            label: 'Expired',
            value: prescriptions.filter((rx) => !rx.isActive).length,
            icon: AlertCircle,
            color: 'text-red-500',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by medication, prescription ID, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-12 text-center">
            <Pill className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No prescriptions found</h3>
            <p className="text-zinc-400">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'No prescriptions available at the moment'}
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Prescription Info */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-white">
                          {prescription.medicationName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono mb-2">
                        Rx: {prescription.prescriptionId}
                      </p>
                    </div>
                  </div>

                  {/* Dosage Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Dosage</p>
                      <p className="text-sm text-white font-semibold">{prescription.dosage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Frequency</p>
                      <p className="text-sm text-white font-semibold">{prescription.frequency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Duration</p>
                      <p className="text-sm text-white font-semibold">{prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Refills</p>
                      <p className="text-sm text-white font-semibold">
                        {prescription.refillsRemaining} of {prescription.refillsAllowed}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  {prescription.instructions && (
                    <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-400">{prescription.instructions}</p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Dr. {prescription.doctor.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Prescribed:{' '}
                        {new Date(prescription.issuedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {prescription.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Expires:{' '}
                          {new Date(prescription.expiryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Low refills warning */}
                  {prescription.isActive &&
                    prescription.refillsRemaining > 0 &&
                    prescription.refillsRemaining <= 2 && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-400">
                          Low refills remaining. Contact your doctor if you need additional refills.
                        </p>
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(prescription.id)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowQR(prescription.id)}
                    className="gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    QR
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
