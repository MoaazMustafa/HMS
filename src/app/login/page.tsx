'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background-900 via-muted to-background-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(172,236,0,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(172,236,0,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <Activity className="w-10 h-10 text-primary" />
          <span className="ml-2 text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            HMS
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-background-900/50 backdrop-blur-xl border border-background-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-background-400">Sign in to your HMS account</p>
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
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-background-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-background-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-background-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-background-800/50 border border-background-700 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-background-500 hover:text-background-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
                  className="w-4 h-4 rounded border-background-700 bg-background text-primary focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-background-400">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-background-400 mb-2 font-semibold">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-background-500">
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
        <p className="text-center text-background-500 text-sm mt-8">
          © 2025 HMS. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
