'use client';

import {
  ArrowLeft,
  Mail,
  Calendar,
  Activity,
  Pill,
  FileText,
  Edit,
  Trash2,
  Shield,
  UserCog,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

export function UserDetailPage({ role }: { role: 'doctor' | 'nurse' | 'patient' }) {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [params.id]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${user?.name}? This action cannot be undone.`,
      )
    ) {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('User deleted successfully');
          router.push(`/dashboard/admin/${role}s`);
        } else {
          alert('Failed to delete user');
        }
      } catch {
        alert('Error deleting user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Activity className="text-muted-foreground mb-4 h-12 w-12" />
        <p className="text-muted-foreground">User not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const roleData =
    role === 'doctor'
      ? user.doctor
      : role === 'nurse'
        ? user.nurse
        : user.patient;

  const roleIcon =
    role === 'doctor' ? (
      <UserCog className="h-6 w-6 text-purple-500" />
    ) : role === 'nurse' ? (
      <Shield className="h-6 w-6 text-green-500" />
    ) : (
      <Activity className="h-6 w-6 text-blue-500" />
    );

  const roleColor =
    role === 'doctor'
      ? 'purple'
      : role === 'nurse'
        ? 'green'
        : 'blue';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/admin/${role}s`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {role === 'doctor' ? 'Dr. ' : ''}{user.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {role.charAt(0).toUpperCase() + role.slice(1)} Profile
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="text-destructive mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-card border-border rounded-lg border p-6">
        <div className="flex items-start gap-6">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border border-${roleColor}-500/20 bg-${roleColor}-500/10`}
          >
            {roleIcon}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-foreground text-sm font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
              {role === 'patient' && roleData?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="text-foreground text-sm font-medium">
                      {roleData.phone}
                    </p>
                  </div>
                </div>
              )}
              {role === 'patient' && roleData?.patientId && (
                <div className="flex items-center gap-3">
                  <Activity className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-xs">Patient ID</p>
                    <p className="text-foreground text-sm font-medium">
                      {roleData.patientId}
                    </p>
                  </div>
                </div>
              )}
              {role === 'doctor' && roleData?.specialization && (
                <div className="flex items-center gap-3">
                  <UserCog className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Specialization
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {roleData.specialization}
                    </p>
                  </div>
                </div>
              )}
              {(role === 'doctor' || role === 'nurse') &&
                roleData?.licenseNumber && (
                  <div className="flex items-center gap-3">
                    <Shield className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-xs">
                        License Number
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        {roleData.licenseNumber}
                      </p>
                    </div>
                  </div>
                )}
              {role === 'patient' && roleData?.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Date of Birth
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {new Date(roleData.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-xs">Joined</p>
                  <p className="text-foreground text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {role === 'patient' && (
          <>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Appointments</p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.appointments?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Pill className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Prescriptions</p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.prescriptions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Medical Records
                  </p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.medicalRecords?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {role === 'doctor' && (
          <>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Appointments</p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.appointments?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Pill className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Prescriptions</p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.prescriptions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-muted-foreground text-xs">Sessions</p>
                  <p className="text-foreground text-2xl font-bold">
                    {roleData?.sessions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {role === 'nurse' && (
          <div className="bg-card border-border rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-muted-foreground text-xs">
                  Vital Signs Recorded
                </p>
                <p className="text-foreground text-2xl font-bold">
                  {roleData?.vitalSigns?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {role === 'patient' && roleData?.appointments && roleData.appointments.length > 0 && (
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Recent Appointments
          </h3>
          <div className="space-y-3">
            {roleData.appointments.map((apt: any) => (
              <div
                key={apt.id}
                className="border-border flex items-center justify-between border-b py-3 last:border-0"
              >
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Dr. {apt.doctor.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(apt.scheduledDate).toLocaleDateString()} at{' '}
                    {apt.startTime}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    apt.status === 'COMPLETED'
                      ? 'bg-green-500/10 text-green-500'
                      : apt.status === 'SCHEDULED'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-gray-500/10 text-gray-500'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
