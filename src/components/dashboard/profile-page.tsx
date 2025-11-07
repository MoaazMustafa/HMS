'use client';

import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Users,
  Activity,
  KeyRound,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { PasswordChangeModal } from './password-change-modal';

type Patient = {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
};

type UserData = {
  id: string;
  email: string;
  createdAt: Date;
  patient: Patient;
};

type Props = {
  userData: UserData;
};

export function ProfilePage({ userData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userData.patient.firstName,
    lastName: userData.patient.lastName,
    email: userData.email,
    phone: userData.patient.phone,
    address: userData.patient.address || '',
    city: userData.patient.city || '',
    state: userData.patient.state || '',
    zipCode: userData.patient.zipCode || '',
    emergencyContactName: userData.patient.emergencyContactName || '',
    emergencyContactPhone: userData.patient.emergencyContactPhone || '',
    emergencyContactRelation: userData.patient.emergencyContactRelation || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/patient/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactRelation: formData.emergencyContactRelation,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.patient.firstName,
      lastName: userData.patient.lastName,
      email: userData.email,
      phone: userData.patient.phone,
      address: userData.patient.address || '',
      city: userData.patient.city || '',
      state: userData.patient.state || '',
      zipCode: userData.patient.zipCode || '',
      emergencyContactName: userData.patient.emergencyContactName || '',
      emergencyContactPhone: userData.patient.emergencyContactPhone || '',
      emergencyContactRelation: userData.patient.emergencyContactRelation || '',
    });
    setIsEditing(false);
    setErrorMessage('');
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="gap-2">
              <KeyRound className="w-4 h-4" />
              Change Password
            </Button>
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{successMessage}</p>
        </motion.div>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{errorMessage}</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/50 backdrop-blur-xl border border-muted rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
            </div>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground">{userData.patient.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground">{userData.patient.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{userData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-foreground">{userData.patient.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Street Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="flex-1 px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <p className="text-foreground">{userData.patient.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* City, State, Zip */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="City"
                    />
                  ) : (
                    <p className="text-foreground">{userData.patient.city || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="State"
                    />
                  ) : (
                    <p className="text-foreground">{userData.patient.state || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="ZIP"
                    />
                  ) : (
                    <p className="text-foreground">{userData.patient.zipCode || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/50 backdrop-blur-xl border border-muted rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Emergency Contacts</h2>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactName: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelation}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactRelation: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactPhone: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            ) : !formData.emergencyContactName && !userData.patient.emergencyContactName ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No emergency contact added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-foreground font-semibold mb-2">
                    {userData.patient.emergencyContactName}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="text-muted-foreground">Relationship:</span>{' '}
                      {userData.patient.emergencyContactRelation || 'Not specified'}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {userData.patient.emergencyContactPhone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Medical Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/50 backdrop-blur-xl border border-muted rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Medical Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Patient ID</p>
                <p className="text-foreground font-mono text-sm">{userData.patient.patientId}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground text-sm">
                    {new Date(userData.patient.dateOfBirth).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Age: {calculateAge(userData.patient.dateOfBirth)} years
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-foreground text-sm">{userData.patient.gender}</p>
              </div>

              {userData.patient.bloodGroup && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
                  <p className="text-foreground text-sm font-semibold">{userData.patient.bloodGroup}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Account Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted/50 backdrop-blur-xl border border-muted rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Account Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-foreground text-sm">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </motion.div>
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
