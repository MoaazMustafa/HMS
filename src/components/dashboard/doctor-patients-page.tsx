'use client';

import {
  Search,
  Users,
  UserCheck,
  UserX,
  Eye,
  Phone,
  Mail,
  Calendar,
  Loader2,
  Filter,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PatientData {
  id: string;
  patientId: string;
  dateOfBirth: Date | null;
  gender: string | null;
  bloodType: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    phoneNumber: string | null;
  };
  assignment: {
    id: string;
    status: string;
    assignedAt: Date;
  };
  _count: {
    appointments: number;
    prescriptions: number;
    medicalRecords: number;
  };
}

export function DoctorPatientsPage() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filterPatients = () => {
      let filtered = patients;

      // Filter by status
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter((p) => p.assignment.status === statusFilter);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        setSearching(true);
        setTimeout(() => setSearching(false), 300);

        filtered = filtered.filter(
          (p) =>
            p.patientId.toLowerCase().includes(query) ||
            p.user.name?.toLowerCase().includes(query) ||
            p.user.email.toLowerCase().includes(query) ||
            p.user.phoneNumber?.includes(query)
        );
      }

      setFilteredPatients(filtered);
    };

    filterPatients();
  }, [patients, searchQuery, statusFilter]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/patients');
      const result = await response.json();

      if (result.success) {
        setPatients(result.data);
      } else {
        setError(result.error || 'Failed to load patients');
      }
    } catch (err) {
      setError('Failed to load patients');
      // Log error for debugging
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error loading patients:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Patients List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Patients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search and manage your assigned patients
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              <p className="text-xs text-muted-foreground">Total Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {patients.filter((p) => p.assignment.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <UserX className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {patients.filter((p) => p.assignment.status === 'INACTIVE').length}
              </p>
              <p className="text-xs text-muted-foreground">Inactive Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Patient ID, name, email, or phone..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {searching && (
              <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </div>

      {/* Patients List */}
      <div className="bg-card border border-border rounded-lg">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No patients found matching your search' : 'No patients assigned yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {patient.user.name?.charAt(0).toUpperCase() || 'P'}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {patient.user.name || 'Unnamed Patient'}
                        </h3>
                        <Badge variant="outline" className="text-[10px]">
                          {patient.patientId}
                        </Badge>
                        <Badge
                          variant={
                            patient.assignment.status === 'ACTIVE' ? 'default' : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {patient.assignment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        {patient.user.email && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{patient.user.email}</span>
                          </div>
                        )}
                        {patient.user.phoneNumber && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{patient.user.phoneNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {patient.dateOfBirth && (
                          <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                        )}
                        {patient.gender && <span>Gender: {patient.gender}</span>}
                        {patient.bloodType && <span>Blood: {patient.bloodType}</span>}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {patient._count.appointments} appointments
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">
                            {patient._count.prescriptions} prescriptions
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">
                            {patient._count.medicalRecords} records
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-muted-foreground mt-2">
                        Assigned: {formatDate(patient.assignment.assignedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/patients/${patient.id}`}>
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More (if needed for pagination) */}
      {filteredPatients.length > 0 && filteredPatients.length === patients.length && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">All patients displayed</p>
        </div>
      )}
    </div>
  );
}
