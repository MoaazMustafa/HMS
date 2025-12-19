'use client';

import {
  Activity,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/use-toast-alert';
import { useConfirm } from '@/hooks/use-confirm';
import { exportData } from '@/lib/export';

export function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { confirm, ConfirmDialog } = useConfirm();
  const { alert, AlertDialog } = useAlert();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users?role=PATIENT');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.users);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient?.patientId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (filteredPatients.length === 0) {
      alert({
        type: 'warning',
        title: 'No Data',
        message: 'No patients available to export',
      });
      return;
    }

    const exportDataArray = filteredPatients.map((patient) => ({
      name: patient.name || 'N/A',
      email: patient.email || 'N/A',
      patientId: patient.patient?.patientId || 'N/A',
      phone: patient.patient?.phone || 'N/A',
      dateOfBirth: patient.patient?.dateOfBirth
        ? new Date(patient.patient.dateOfBirth).toLocaleDateString()
        : 'N/A',
      verified: patient.emailVerified ? 'Yes' : 'No',
      joinedDate: new Date(patient.createdAt).toLocaleDateString(),
    }));

    exportData(exportDataArray, 'patients-list', format, {
      headers: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'patientId', label: 'Patient ID' },
        { key: 'phone', label: 'Phone' },
        { key: 'dateOfBirth', label: 'Date of Birth' },
        { key: 'verified', label: 'Verified' },
        { key: 'joinedDate', label: 'Joined Date' },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      <AlertDialog />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Patients Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage patient accounts and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="absolute right-0 top-full hidden w-40 rounded-lg border border-border bg-card shadow-lg group-hover:block hover:block z-50">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-t-lg"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                Export as Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors rounded-b-lg"
              >
                Export as PDF
              </button>
            </div>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Activity className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      {patient.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      ID: {patient.patient?.patientId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <p className="text-muted-foreground truncate text-xs">
                    {patient.email}
                  </p>
                </div>
                {patient.patient?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-3 w-3" />
                    <p className="text-muted-foreground text-xs">
                      {patient.patient.phone}
                    </p>
                  </div>
                )}
                {patient.patient?.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-3 w-3" />
                    <p className="text-muted-foreground text-xs">
                      DOB:{' '}
                      {new Date(
                        patient.patient.dateOfBirth,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = `/dashboard/admin/patients/${patient.id}`}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Edit ${patient.name}?`)) {
                      alert('Edit functionality - Connect to edit modal or form');
                    }
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete ${patient.name}? This action cannot be undone.`)) {
                      try {
                        const response = await fetch(`/api/admin/users/${patient.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          alert('Patient deleted successfully');
                          fetchPatients();
                        } else {
                          alert('Failed to delete patient');
                        }
                      } catch {
                        alert('Error deleting patient');
                      }
                    }
                  }}
                >
                  <Trash2 className="text-destructive h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
