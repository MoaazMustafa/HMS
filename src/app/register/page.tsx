'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Activity,
  Phone,
  Calendar,
  Key,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

type Step = 'register' | 'verify';

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState<Step>('register');
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
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      router.refresh();
    }
  }, [status, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

      // Move to OTP verification step
      setStep('verify');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Redirect to login with success message
      router.push('/login?verified=true');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="from-background-900 via-background to-background-900 flex min-h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <Activity className="text-primary mx-auto mb-4 h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="from-background-900 via-background to-background-900 flex min-h-screen items-center justify-center bg-linear-to-br px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#80000060,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#80000060,transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center">
          <Activity className="text-primary h-10 w-10" />
          <span className="from-primary to-primary/70 ml-2 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
            HMS
          </span>
        </Link>

        {/* Register Card */}
        <div className="bg-background-900/50 border-background-800 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl">
          {step === 'register' ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                  Create Account
                </h1>
                <p className="text-background-400">Register as a new patient</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="John"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-background-300 mb-2 block text-sm font-medium"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone and DOB */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="+1234567890"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="text-background-300 mb-2 block text-sm font-medium"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-background-800/50 border-background-700 text-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                disabled={isLoading}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-12 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-background-500 hover:text-background-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-background-300 mb-2 block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="text-background-500 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-12 pl-11 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-background-500 hover:text-background-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full text-base font-semibold"
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
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Key className="text-primary h-8 w-8" />
                </div>
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                  Verify Your Email
                </h1>
                <p className="text-background-400">
                  We sent a 6-digit code to <strong className="text-foreground">{formData.email}</strong>
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="text-background-300 mb-2 block text-sm font-medium"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-background-800/50 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 px-4 text-center text-2xl tracking-widest transition-colors focus:ring-2 focus:outline-none"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-background-500 mt-2 text-xs text-center">
                    Code expires in 15 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="h-12 w-full text-base font-semibold"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setOtp('');
                    setError('');
                  }}
                  className="text-background-400 hover:text-foreground text-sm transition-colors"
                >
                  Back to registration
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-background-500 mt-8 text-center text-sm">
          © 2025 HMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
