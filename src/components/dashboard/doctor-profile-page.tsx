'use client';

import type { Decimal } from '@prisma/client/runtime/library';
import {
  Save,
  User,
  Mail,
  Phone,
  Stethoscope,
  DollarSign,
  Shield,
  KeyRound,
  Edit,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { PasswordChangeModal } from './password-change-modal';

interface DoctorProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  specialization: string | null;
  licenseNumber: string;
  phone: string;
  isActive: boolean;
  defaultAppointmentFee: Decimal;
  defaultSessionFee: Decimal;
  user: {
    name: string | null;
    email: string;
    phoneNumber: string | null;
  };
  workingHours: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
}

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function DoctorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<DoctorProfileData | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    phoneNumber: '',
    defaultAppointmentFee: '',
    defaultSessionFee: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/profile');
      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        setFormData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          phone: result.data.phone,
          email: result.data.user.email,
          phoneNumber: result.data.user.phoneNumber || result.data.phone,
          defaultAppointmentFee: result.data.defaultAppointmentFee.toString(),
          defaultSessionFee: result.data.defaultSessionFee.toString(),
        });
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      // Log error for debugging
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error loading profile:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Profile updated successfully!');
        setSuccess('Profile updated successfully!');
        setProfile(result.data);
        setIsEditing(false);
        // Update form data with new values
        setFormData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          phone: result.data.phone,
          email: result.data.user.email,
          phoneNumber: result.data.user.phoneNumber || result.data.phone,
          defaultAppointmentFee: result.data.defaultAppointmentFee.toString(),
          defaultSessionFee: result.data.defaultSessionFee.toString(),
        });
      } else {
        setError(result.error || 'Failed to update profile');
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      // Log error for debugging
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error updating profile:', err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.user.email,
        phoneNumber: profile.user.phoneNumber || profile.phone,
        defaultAppointmentFee: profile.defaultAppointmentFee.toString(),
        defaultSessionFee: profile.defaultSessionFee.toString(),
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Profile Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>

        {/* Working Hours Skeleton */}
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-6 text-center">
        <p className="text-destructive text-sm">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Doctor Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal and professional information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={profile.isActive ? 'default' : 'secondary'}
            className="text-xs"
          >
            {profile.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {!isEditing ? (
            <>
              <Button
                onClick={() => setIsPasswordModalOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Button>
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Profile Form */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={`border-border text-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none ${
                  !isEditing ? 'bg-muted cursor-not-allowed' : 'bg-background'
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                className={`border-border text-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none ${
                  !isEditing ? 'bg-muted cursor-not-allowed' : 'bg-background'
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  required
                  className="bg-muted border-border text-muted-foreground w-full cursor-not-allowed rounded-md border py-2 pr-3 pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className={`border-border text-foreground focus:ring-primary w-full rounded-md border py-2 pr-3 pl-10 text-sm focus:border-transparent focus:ring-2 focus:outline-none ${
                    !isEditing ? 'bg-muted cursor-not-allowed' : 'bg-background'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Stethoscope className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">
              Professional Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="specialization"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Specialization
              </label>
              <div className="relative">
                <Stethoscope className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="text"
                  id="specialization"
                  value={profile.specialization || 'Not specified'}
                  disabled
                  className="bg-muted border-border text-muted-foreground w-full cursor-not-allowed rounded-md border py-2 pr-3 pl-10 text-sm"
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Specialization cannot be changed. Contact admin if needed.
              </p>
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                License Number
              </label>
              <div className="relative">
                <Shield className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="text"
                  id="licenseNumber"
                  value={profile.licenseNumber}
                  disabled
                  className="bg-muted border-border text-muted-foreground w-full cursor-not-allowed rounded-md border py-2 pr-3 pl-10 text-sm"
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                License number cannot be changed. Contact admin if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">
              Fee Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="defaultAppointmentFee"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Default Appointment Fee
              </label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                  $
                </span>
                <input
                  type="number"
                  id="defaultAppointmentFee"
                  name="defaultAppointmentFee"
                  value={formData.defaultAppointmentFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="bg-background border-border text-foreground focus:ring-primary w-full rounded-md border py-2 pr-3 pl-7 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="defaultSessionFee"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Default Session Fee
              </label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                  $
                </span>
                <input
                  type="number"
                  id="defaultSessionFee"
                  name="defaultSessionFee"
                  value={formData.defaultSessionFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="bg-background border-border text-foreground focus:ring-primary w-full rounded-md border py-2 pr-3 pl-7 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mt-3 text-xs">
            These are your default fees. You can set custom fees for specific
            appointments or sessions.
          </p>
        </div>

        {/* Working Hours Display */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">
              Working Hours
            </h2>
            <Badge variant="outline" className="text-xs">
              {profile.workingHours?.length || 0} schedules
            </Badge>
          </div>

          {profile.workingHours && profile.workingHours.length > 0 ? (
            <div className="space-y-2">
              {profile.workingHours.map((hours) => (
                <div
                  key={hours.id}
                  className="bg-accent/50 flex items-center justify-between rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-foreground text-sm font-medium">
                      {dayNames[hours.dayOfWeek]}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {hours.startTime} - {hours.endTime}
                    </span>
                  </div>
                  <Badge
                    variant={hours.isAvailable ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {hours.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground text-sm">
                No working hours configured
              </p>
            </div>
          )}

          <p className="text-muted-foreground mt-3 text-xs">
            Manage your working hours in the Schedule section to configure
            availability.
          </p>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
