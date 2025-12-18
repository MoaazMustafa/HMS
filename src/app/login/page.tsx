'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for verification success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now log in.');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      router.refresh();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="from-background-900 via-muted to-background-900 flex min-h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <Activity className="text-primary mx-auto mb-4 h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="from-background-900 via-muted to-background-900 flex min-h-screen items-center justify-center bg-linear-to-br px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#80000080,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#80000080,transparent_50%)]" />

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

        {/* Login Card */}
        <div className="bg-background-900/50 backdrop-blur-4xl border-background-800 rounded-2xl border p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Welcome Back
            </h1>
            <p className="text-background-400">Sign in to your HMS account</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-500"
            >
              {success}
            </motion.div>
          )}

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
            {/* Email Field */}
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background-800/50 border-background-700 text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background-800/50 border-background-700 text-foreground placeholder:text-muted-foreground focus:ring-primary/50 focus:border-primary w-full rounded-lg border py-3 pr-12 pl-11 transition-colors focus:ring-2 focus:outline-none"
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="border-background-700 bg-background text-primary focus:ring-primary h-4 w-4 rounded focus:ring-offset-0"
                />
                <label
                  htmlFor="remember"
                  className="text-background-400 ml-2 text-sm"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full text-base font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-primary/5 border-primary/20 mt-6 rounded-lg border p-4">
            <p className="text-background-400 mb-2 text-xs font-semibold">
              Demo Credentials:
            </p>
            <div className="text-background-500 space-y-1 text-xs">
              <p>Patient: patient1@example.com / password123</p>
              <p>Doctor: dr.smith@hms.com / password123</p>
              <p>Admin: admin@hms.com / password123</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-background-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-background-500 mt-8 text-center text-sm">
          © 2025 HMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
