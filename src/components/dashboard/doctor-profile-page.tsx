'use client';

import type { Decimal } from '@prisma/client/runtime/library';
import { Loader2, Save, User, Mail, Phone, Stethoscope, DollarSign, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function DoctorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setSuccess('Profile updated successfully!');
        setProfile(result.data);
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
      }
    } catch (err) {
      setError('Failed to update profile');
      // Log error for debugging
      if (err instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error updating profile:', err.message);
      }
    } finally {
      setSaving(false);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-sm text-destructive">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal and professional information
          </p>
        </div>
        <Badge variant={profile.isActive ? 'default' : 'secondary'} className="text-xs">
          {profile.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Professional Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Specialization
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  id="specialization"
                  value={profile.specialization || 'Not specified'}
                  disabled
                  className="w-full pl-10 pr-3 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Specialization cannot be changed. Contact admin if needed.
              </p>
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-foreground mb-2"
              >
                License Number
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  id="licenseNumber"
                  value={profile.licenseNumber}
                  disabled
                  className="w-full pl-10 pr-3 py-2 bg-muted border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                License number cannot be changed. Contact admin if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Fee Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="defaultAppointmentFee"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Default Appointment Fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
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
                  className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="defaultSessionFee"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Default Session Fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
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
                  className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            These are your default fees. You can set custom fees for specific appointments or
            sessions.
          </p>
        </div>

        {/* Working Hours Display */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Working Hours</h2>
            <Badge variant="outline" className="text-xs">
              {profile.workingHours?.length || 0} schedules
            </Badge>
          </div>

          {profile.workingHours && profile.workingHours.length > 0 ? (
            <div className="space-y-2">
              {profile.workingHours.map((hours) => (
                <div
                  key={hours.id}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {dayNames[hours.dayOfWeek]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {hours.startTime} - {hours.endTime}
                    </span>
                  </div>
                  <Badge variant={hours.isAvailable ? 'default' : 'secondary'} className="text-xs">
                    {hours.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No working hours configured</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            Manage your working hours in the Schedule section to configure availability.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchProfile}
            disabled={saving}
            className="min-w-[100px]"
          >
            Reset
          </Button>
          <Button type="submit" disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
