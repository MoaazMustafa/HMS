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
    <div className="from-background-900 via-primary-900/60 to-background-900 flex min-h-screen items-center justify-center bg-linear-to-br">
      <div className="absolute inset-0 bg-[url('/img/truck-pattern.png')] opacity-5"></div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="border-foreground/20 bg-foreground/10 rounded-3xl border p-8 shadow-2xl backdrop-blur-lg">
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="from-primary-500 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r to-green-600"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Shield className="text-foreground h-8 w-8" />
            </motion.div>

            <h1 className="text-foreground text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-300 mt-2">Divine Dispatch Management</p>
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
                className="text-muted-300 mb-2 block text-sm font-medium"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="text-muted-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="border-foreground/20 bg-foreground/10 text-foreground placeholder-muted-400 focus:border-primary-400 focus:ring-primary-400/20 w-full rounded-xl border px-12 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="text-muted-300 mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="text-muted-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="border-foreground/20 bg-foreground/10 text-foreground placeholder-muted-400 focus:border-primary-400 focus:ring-primary-400/20 w-full rounded-xl border px-12 py-3 pr-12 backdrop-blur-sm focus:ring-2 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-400 hover:text-muted-300 absolute top-1/2 right-3 -translate-y-1/2"
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
              className="from-primary-500 text-foreground hover:from-primary-600 focus:ring-primary-400/50 w-full rounded-xl bg-linear-to-r to-green-600 px-6 py-3 font-semibold transition-all duration-300 hover:to-green-700 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="border-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
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
            <p className="text-muted-400 text-sm">
              Secure admin access for Divine Dispatch management
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
