'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Activity, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background-900 via-background to-background-900 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(172,236,0,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(172,236,0,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <Activity className="w-10 h-10 text-primary" />
          <span className="ml-2 text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            HMS
          </span>
        </Link>

        {/* Register Card */}
        <div className="bg-background-900/50 backdrop-blur-xl border border-background-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-background-400">Register as a new patient</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-background-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="John"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-background-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-background-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-background-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="+1234567890"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-background-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-background-300 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                disabled={isLoading}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-background-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-background-500 hover:text-background-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-background-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-background-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-background-500 hover:text-background-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-background-400 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-background-500 text-sm mt-8">
          © 2025 HMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
