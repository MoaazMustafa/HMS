import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds to succeed even with TypeScript errors (during development)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
