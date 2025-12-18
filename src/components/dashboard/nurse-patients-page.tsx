'use client';

import {
  Eye,
  Mail,
  Phone,
  Search,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface Patient {
  id: string;
  patientId: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup: string | null;
  user: {
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  _count: {
    vitalSigns: number;
    appointments: number;
    medicalRecords: number;
  };
}

export default function NursePatientsPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      (p) =>
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredPatients(filtered);
  }, [patients, searchQuery]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');
      const result = await response.json();

      if (result.success) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            View patient records (read-only access)
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search by Patient ID, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Patients List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : filteredPatients.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
            <h3 className="mb-2 text-lg font-semibold">No Patients Found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No patients in the system'}
            </p>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <User className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {patient.user.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {patient.patientId}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {patient.user.email}
                      </div>
                      {patient.user.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.user.phoneNumber}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {calculateAge(patient.dateOfBirth)} years old
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {patient.gender}
                      </Badge>
                      {patient.bloodGroup && (
                        <Badge variant="secondary" className="text-xs">
                          {patient.bloodGroup}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">
                        {patient._count.vitalSigns}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Vitals
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {patient._count.appointments}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Appointments
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {patient._count.medicalRecords}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Records
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/patients/${patient.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
