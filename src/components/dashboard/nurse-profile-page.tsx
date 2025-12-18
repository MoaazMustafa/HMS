'use client';

import {
  Save,
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Edit,
  X,
  Stethoscope,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { PasswordChangeModal } from './password-change-modal';

interface NurseProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  isActive: boolean;
  user: {
    name: string | null;
    email: string;
    phoneNumber: string | null;
  };
}

export default function NurseProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<NurseProfileData | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/nurse/profile');
      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        setFormData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          phone: result.data.phone,
          email: result.data.user.email,
          phoneNumber: result.data.user.phoneNumber || result.data.phone,
        });
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      if (err instanceof Error) {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/nurse/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Profile updated successfully!');
        setProfile(result.data);
        setIsEditing(false);
        setFormData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          phone: result.data.phone,
          email: result.data.user.email,
          phoneNumber: result.data.user.phoneNumber || result.data.phone,
        });
      } else {
        setError(result.error || 'Failed to update profile');
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      if (err instanceof Error) {
        console.error('Error updating profile:', err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.user.email,
        phoneNumber: profile.user.phoneNumber || profile.phone,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="container space-y-6 py-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Shield className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h2 className="text-foreground mb-2 text-xl font-semibold">
                Error
              </h2>
              <p className="text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={fetchProfile}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Nurse Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional information
          </p>
        </div>
        {profile?.isActive ? (
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            Inactive
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <div className="flex items-center gap-2">
                <Stethoscope className="text-muted-foreground h-4 w-4" />
                <Input
                  id="licenseNumber"
                  value={profile?.licenseNumber || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                License number cannot be changed. Contact admin for updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Email cannot be changed. Contact admin for updates.
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Professional Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Personal Phone */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Personal Phone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="text-foreground font-medium">Password</h3>
                <p className="text-muted-foreground text-sm">
                  Change your password to keep your account secure
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 md:col-span-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-500 bg-red-50 p-4 md:col-span-2 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </form>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
