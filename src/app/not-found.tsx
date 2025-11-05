'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen">
       {/* Main Content */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* 404 Animation */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="text-primary/20 text-9xl font-bold">404</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-primary/10 absolute inset-0 -z-10 rounded-full blur-3xl"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-foreground text-4xl font-bold sm:text-5xl"
            >
              Page Not Found
            </motion.h1>

            {/* Description */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="text-muted-foreground text-lg">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has
                been moved.
              </p>
              <p className="text-muted-foreground">
                Don&apos;t worry, let&apos;s get you back on track with our
                software house services.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>

              <Link href="/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Browse Projects
                </Button>
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={fadeInUp}
              className="border-border/20 rounded-lg border p-6"
            >
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Quick Links
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                  Our Services
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                  About Upvave
                </Link>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                  Contact Us
                </Link>
                <Link
                  href="/meeting"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                  Schedule Meeting
                </Link>
              </div>
            </motion.div>

            {/* Company Info */}
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-muted-foreground text-sm">
                Upvave LLC - US-registered software house
              </p>
              <p className="text-muted-foreground text-xs">
                Delivering innovative web applications, mobile development, and
                AI-integrated solutions
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
