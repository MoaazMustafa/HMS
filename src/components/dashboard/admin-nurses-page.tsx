'use client';

import {
  Shield,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Activity,
  Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { exportData } from '@/lib/export';

export function AdminNursesPage() {
  const [nurses, setNurses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users?role=NURSE');
      if (response.ok) {
        const data = await response.json();
        setNurses(data.users);
      }
    } catch (error) {
      console.error('Error fetching nurses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNurses = nurses.filter(
    (nurse) =>
      nurse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.nurse?.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (filteredNurses.length === 0) {
      alert('No nurses to export');
      return;
    }

    const exportDataArray = filteredNurses.map((nurse) => ({
      name: nurse.name || 'N/A',
      email: nurse.email || 'N/A',
      department: nurse.nurse?.department || 'N/A',
      licenseNumber: nurse.nurse?.licenseNumber || 'N/A',
      verified: nurse.emailVerified ? 'Yes' : 'No',
      joinedDate: new Date(nurse.createdAt).toLocaleDateString(),
    }));

    exportData(exportDataArray, 'nurses-list', format, {
      headers: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
        { key: 'licenseNumber', label: 'License Number' },
        { key: 'verified', label: 'Verified' },
        { key: 'joinedDate', label: 'Joined Date' },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Nurses Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage nurse accounts and profiles
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
            Add Nurse
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nurses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Nurses Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : filteredNurses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Shield className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No nurses found</p>
          </div>
        ) : (
          filteredNurses.map((nurse) => (
            <div
              key={nurse.id}
              className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      {nurse.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {nurse.nurse?.department || 'General'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <p className="text-muted-foreground truncate text-xs">
                    {nurse.email}
                  </p>
                </div>
                {nurse.nurse?.licenseNumber && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-green-500" />
                    <p className="text-muted-foreground text-xs">
                      License: {nurse.nurse.licenseNumber}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = `/dashboard/admin/nurses/${nurse.id}`}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Edit ${nurse.name}?`)) {
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
                    if (confirm(`Are you sure you want to delete ${nurse.name}? This action cannot be undone.`)) {
                      try {
                        const response = await fetch(`/api/admin/users/${nurse.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          alert('Nurse deleted successfully');
                          fetchNurses();
                        } else {
                          alert('Failed to delete nurse');
                        }
                      } catch {
                        alert('Error deleting nurse');
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
