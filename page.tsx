'use client';

import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        // Check if session was created successfully
        const session = await getSession();
        if (session) {
          router.push('/admin');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background-900 via-primary-900/60 to-background-900">
      <div className="absolute inset-0 bg-[url('/img/truck-pattern.png')] opacity-5"></div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-3xl border border-foreground/20 bg-foreground/10 p-8 shadow-2xl backdrop-blur-lg">
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-primary-500 to-green-600"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Shield className="h-8 w-8 text-foreground" />
            </motion.div>

            <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
            <p className="mt-2 text-muted-300">Divine Dispatch Management</p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-muted-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-foreground/20 bg-foreground/10 px-12 py-3 text-foreground placeholder-muted-400 backdrop-blur-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-muted-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-foreground/20 bg-foreground/10 px-12 py-3 pr-12 text-foreground placeholder-muted-400 backdrop-blur-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-400 hover:text-muted-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="rounded-xl border border-red-400/30 bg-red-500/20 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-r from-primary-500 to-green-600 px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:from-primary-600 hover:to-green-700 focus:ring-2 focus:ring-primary-400/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-muted-400">
              Secure admin access for Divine Dispatch management
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
