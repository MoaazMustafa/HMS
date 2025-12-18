'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowLeft, CheckCircle, Key, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      router.refresh();
    }
  }, [status, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      setStep('otp');
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
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setStep('password');
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep('success');
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
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Activity className="text-primary mx-auto mb-4 h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render forgot password form if authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(172,236,0,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(172,236,0,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center">
          <Activity className="text-primary h-10 w-10" />
          <span className="from-primary to-primary/70 ml-2 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
            HMS
          </span>
        </Link>

        {/* Forgot Password Card */}
        <div className="bg-card border-border rounded-2xl border p-8 shadow-2xl backdrop-blur-xl">
          {/* Step Indicator */}
          <div className="mb-8 flex justify-center gap-2">
            <div className={`h-2 w-12 rounded-full ${step === 'email' ? 'bg-primary' : step === 'otp' || step === 'password' || step === 'success' ? 'bg-primary/50' : 'bg-muted'}`} />
            <div className={`h-2 w-12 rounded-full ${step === 'otp' ? 'bg-primary' : step === 'password' || step === 'success' ? 'bg-primary/50' : 'bg-muted'}`} />
            <div className={`h-2 w-12 rounded-full ${step === 'password' ? 'bg-primary' : step === 'success' ? 'bg-primary/50' : 'bg-muted'}`} />
          </div>

          {/* Step 1: Email */}
          {step === 'email' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8 text-center">
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email to receive a verification code
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

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full text-base font-semibold"
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
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
                  Enter Verification Code
                </h1>
                <p className="text-muted-foreground">
                  We sent a 6-digit code to <strong>{email}</strong>
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
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 px-4 text-center text-2xl tracking-widest transition-colors focus:ring-2 focus:outline-none"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-muted-foreground mt-2 text-xs text-center">
                    Code expires in 10 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="h-12 w-full text-base font-semibold"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Use different email
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="text-primary h-8 w-8" />
                </div>
                <h1 className="text-foreground mb-2 text-3xl font-bold">
                  Create New Password
                </h1>
                <p className="text-muted-foreground">
                  Choose a strong password for your account
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

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 px-4 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    At least 8 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-foreground mb-2 block text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 px-4 transition-colors focus:ring-2 focus:outline-none"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full text-base font-semibold"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-foreground mb-2 text-xl font-semibold">
                Password Reset Successful!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your password has been changed. You can now log in with your new password.
              </p>
              <Link href="/login">
                <Button className="h-12 w-full text-base font-semibold">
                  Continue to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-8 text-center text-sm">
          © 2025 HMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
