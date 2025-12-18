'use client';

import {
  UserCog,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

export function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users?role=DOCTOR');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.users);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctor?.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Doctors Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage doctor accounts and profiles
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Search */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <UserCog className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No doctors found</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
                    <UserCog className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {doctor.doctor?.specialization || 'General Practice'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <p className="text-muted-foreground truncate text-xs">
                    {doctor.email}
                  </p>
                </div>
                {doctor.doctor?.licenseNumber && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <p className="text-muted-foreground text-xs">
                      License: {doctor.doctor.licenseNumber}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = `/dashboard/admin/doctors/${doctor.id}`}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Edit Dr. ${doctor.name}?`)) {
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
                    if (confirm(`Are you sure you want to delete Dr. ${doctor.name}? This action cannot be undone.`)) {
                      try {
                        const response = await fetch(`/api/admin/users/${doctor.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          alert('Doctor deleted successfully');
                          fetchDoctors();
                        } else {
                          alert('Failed to delete doctor');
                        }
                      } catch {
                        alert('Error deleting doctor');
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
