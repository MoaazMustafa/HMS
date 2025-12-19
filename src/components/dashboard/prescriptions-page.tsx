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
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/use-toast-alert';
import { exportData, exportToPDF } from '@/lib/export';

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

  const { alert, AlertDialog } = useAlert();

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
        return 'bg-background-500/20 text-background-500 border-background-500/20';
      default:
        return 'bg-background-500/20 text-background-500 border-background-500/20';
    }
  };

  const handleDownloadPDF = (prescriptionId: string, format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    const prescription = prescriptions.find((p) => p.id === prescriptionId);
    if (!prescription) {
      alert({
        type: 'error',
        title: 'Not Found',
        message: 'Prescription not found',
      });
      return;
    }

    const prescriptionData = [
      {
        field: 'Prescription ID',
        value: prescription.prescriptionId,
      },
      {
        field: 'Medication Name',
        value: prescription.medicationName,
      },
      {
        field: 'Dosage',
        value: prescription.dosage,
      },
      {
        field: 'Frequency',
        value: prescription.frequency,
      },
      {
        field: 'Duration',
        value: prescription.duration,
      },
      {
        field: 'Instructions',
        value: prescription.instructions || 'No special instructions',
      },
      {
        field: 'Refills Allowed',
        value: prescription.refillsAllowed.toString(),
      },
      {
        field: 'Refills Remaining',
        value: prescription.refillsRemaining.toString(),
      },
      {
        field: 'Issued At',
        value: new Date(prescription.issuedAt).toLocaleDateString(),
      },
      {
        field: 'Expiry Date',
        value: prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A',
      },
      {
        field: 'Status',
        value: prescription.status,
      },
      {
        field: 'Doctor',
        value: prescription.doctor.user.name,
      },
      {
        field: 'Specialization',
        value: prescription.doctor.specialization,
      },
    ];

    if (format === 'pdf') {
      const htmlContent = `
        <h2>Prescription Details</h2>
        <table>
          <tbody>
            ${prescriptionData.map((item) => `
              <tr>
                <th style="text-align: left; width: 30%;">${item.field}</th>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #800000;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            <strong>Important:</strong> This is an electronic prescription. Please verify with your healthcare provider before use.
          </p>
        </div>
      `;
      exportToPDF(htmlContent, `prescription-${prescription.prescriptionId}`);
    } else {
      exportData(prescriptionData, `prescription-${prescription.prescriptionId}`, format, {
        headers: [
          { key: 'field', label: 'Field' },
          { key: 'value', label: 'Value' },
        ],
      });
    }
  };

  const handleShowQR = (prescriptionId: string) => {
    // TODO: Implement QR code display
    void prescriptionId; // Suppress unused variable warning
  };

  const handleExportAll = (format: 'csv' | 'excel' | 'pdf') => {
    if (filteredPrescriptions.length === 0) {
      alert({
        type: 'warning',
        title: 'No Data',
        message: 'No prescriptions available to export',
      });
      return;
    }

    const exportDataArray = filteredPrescriptions.map((prescription) => ({
      prescriptionId: prescription.prescriptionId,
      medication: prescription.medicationName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      refillsRemaining: prescription.refillsRemaining,
      issuedAt: new Date(prescription.issuedAt).toLocaleDateString(),
      expiryDate: prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A',
      status: prescription.status,
      doctor: prescription.doctor.user.name,
    }));

    exportData(exportDataArray, 'prescriptions-list', format, {
      headers: [
        { key: 'prescriptionId', label: 'Prescription ID' },
        { key: 'medication', label: 'Medication' },
        { key: 'dosage', label: 'Dosage' },
        { key: 'frequency', label: 'Frequency' },
        { key: 'duration', label: 'Duration' },
        { key: 'refillsRemaining', label: 'Refills Remaining' },
        { key: 'issuedAt', label: 'Issued At' },
        { key: 'expiryDate', label: 'Expiry Date' },
        { key: 'status', label: 'Status' },
        { key: 'doctor', label: 'Doctor' },
      ],
    });
  };

  const activePrescriptions = prescriptions.filter((rx) => rx.isActive).length;
  const totalRefills = prescriptions.reduce(
    (sum, rx) => sum + rx.refillsRemaining,
    0,
  );

  return (
    <div className="space-y-6">
      <AlertDialog />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Prescriptions
          </h1>
          <p className="text-background-400">
            View and manage your prescription medications
          </p>
        </div>
        <div className="relative group">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <div className="absolute right-0 top-full hidden w-40 rounded-lg border border-border bg-card shadow-lg group-hover:block hover:block z-50">
            <button
              onClick={() => handleExportAll('csv')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-t-lg"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExportAll('excel')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Export as Excel
            </button>
            <button
              onClick={() => handleExportAll('pdf')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-b-lg"
            >
              Export as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-background-400 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-background-900/50 border-background-800 rounded-lg border p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() =>
                  setFilter(tab.value as 'all' | 'active' | 'expired')
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-background'
                    : 'bg-background-800 text-background-400 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-background-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by medication, prescription ID, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background-800 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
            <Pill className="text-background-600 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No prescriptions found
            </h3>
            <p className="text-background-400">
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
              className="bg-background-900/50 border-background-800 hover:border-background-700 rounded-lg border p-6 backdrop-blur-xl transition-all"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                {/* Prescription Info */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <Pill className="text-primary h-5 w-5" />
                        <h3 className="text-foreground text-lg font-semibold">
                          {prescription.medicationName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium ${getStatusColor(
                            prescription.status,
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                      <p className="text-background-500 mb-2 font-mono text-xs">
                        Rx: {prescription.prescriptionId}
                      </p>
                    </div>
                  </div>

                  {/* Dosage Info */}
                  <div className="bg-background-800/50 grid grid-cols-2 gap-3 rounded-lg p-4 md:grid-cols-4">
                    <div>
                      <p className="text-background-500 mb-1 text-xs">Dosage</p>
                      <p className="text-foreground text-sm font-semibold">
                        {prescription.dosage}
                      </p>
                    </div>
                    <div>
                      <p className="text-background-500 mb-1 text-xs">
                        Frequency
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {prescription.frequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-background-500 mb-1 text-xs">
                        Duration
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {prescription.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-background-500 mb-1 text-xs">
                        Refills
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {prescription.refillsRemaining} of{' '}
                        {prescription.refillsAllowed}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  {prescription.instructions && (
                    <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <p className="text-sm text-blue-400">
                        {prescription.instructions}
                      </p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="text-background-400 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Dr. {prescription.doctor.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Prescribed:{' '}
                        {new Date(prescription.issuedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                    {prescription.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Expires:{' '}
                          {new Date(prescription.expiryDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Low refills warning */}
                  {prescription.isActive &&
                    prescription.refillsRemaining > 0 &&
                    prescription.refillsRemaining <= 2 && (
                      <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                        <p className="text-sm text-yellow-400">
                          Low refills remaining. Contact your doctor if you need
                          additional refills.
                        </p>
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col">
                  <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <div className="absolute left-0 top-full hidden w-32 rounded-lg border border-border bg-card shadow-lg group-hover:block hover:block z-50">
                      <button
                        onClick={() => handleDownloadPDF(prescription.id, 'csv')}
                        className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors rounded-t-lg"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(prescription.id, 'excel')}
                        className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors"
                      >
                        Excel
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(prescription.id, 'pdf')}
                        className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors rounded-b-lg"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowQR(prescription.id)}
                    className="gap-2"
                  >
                    <QrCode className="h-4 w-4" />
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
