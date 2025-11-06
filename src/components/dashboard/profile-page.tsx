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
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
};

type Patient = {
  id: string;
  patientId: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContacts: EmergencyContact[];
};

type UserData = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
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

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phoneNumber: userData.phoneNumber || '',
    address: userData.patient.address || '',
    city: userData.patient.city || '',
    state: userData.patient.state || '',
    zipCode: userData.patient.zipCode || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: Implement API call to update profile
      // const response = await fetch('/api/patient/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to update profile');

      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber || '',
      address: userData.patient.address || '',
      city: userData.patient.city || '',
      state: userData.patient.state || '',
      zipCode: userData.patient.zipCode || '',
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
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-zinc-400">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
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
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-white">{userData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <p className="text-white">{userData.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-white">{userData.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Street Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-zinc-500 mt-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <p className="text-white">{userData.patient.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* City, State, Zip */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="City"
                    />
                  ) : (
                    <p className="text-white">{userData.patient.city || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="State"
                    />
                  ) : (
                    <p className="text-white">{userData.patient.state || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="ZIP"
                    />
                  ) : (
                    <p className="text-white">{userData.patient.zipCode || 'N/A'}</p>
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
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-white">Emergency Contacts</h2>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Manage
              </Button>
            </div>

            {userData.patient.emergencyContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No emergency contacts added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userData.patient.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="p-4 bg-zinc-800/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">{contact.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">Relationship:</span> {contact.relationship}
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">Phone:</span> {contact.phoneNumber}
                      </p>
                      {contact.email && (
                        <p className="text-zinc-400">
                          <span className="text-zinc-500">Email:</span> {contact.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Medical Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Patient ID</p>
                <p className="text-white font-mono text-sm">{userData.patient.patientId}</p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">Date of Birth</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <p className="text-white text-sm">
                    {new Date(userData.patient.dateOfBirth).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Age: {calculateAge(userData.patient.dateOfBirth)} years
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">Gender</p>
                <p className="text-white text-sm">{userData.patient.gender}</p>
              </div>

              {userData.patient.bloodGroup && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Blood Group</p>
                  <p className="text-white text-sm font-semibold">{userData.patient.bloodGroup}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Account Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Account Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Member Since</p>
                <p className="text-white text-sm">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Shield className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
