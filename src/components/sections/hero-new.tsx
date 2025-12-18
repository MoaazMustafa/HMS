'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  FileText,
  Pill,
  Users,
  Activity,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function HeroNew() {
  const floatingIcons = [
    { Icon: Calendar, color: 'text-blue-500', delay: 0 },
    { Icon: FileText, color: 'text-green-500', delay: 0.2 },
    { Icon: Pill, color: 'text-purple-500', delay: 0.4 },
    { Icon: Users, color: 'text-orange-500', delay: 0.6 },
    { Icon: Activity, color: 'text-red-500', delay: 0.8 },
    { Icon: Shield, color: 'text-primary', delay: 1 },
  ];

  return (
    <section className="from-background via-background to-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Floating Icons Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingIcons.map(({ Icon, color, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${color} opacity-10`}
            initial={{ y: 0, x: 0 }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              delay: delay,
            }}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
            }}
          >
            <Icon className="h-16 w-16 md:h-24 md:w-24" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
            >
              <Shield className="h-4 w-4" />
              HIPAA Compliant • WCAG 2.1 AA • Secure by Design
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Next-Generation
              <span className="from-primary mt-2 block bg-gradient-to-r via-green-400 to-blue-500 bg-clip-text text-transparent">
                Healthcare Management
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-lg leading-relaxed md:text-xl">
              Comprehensive digital platform for managing patients,
              prescriptions, appointments, medical records, and lab tests. Built
              with security, compliance, and user experience at its core.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="group px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Quick Stats */}
          <ScrollReveal delay={0.4}>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: 'Patient Records', value: '10K+' },
                { label: 'Active Doctors', value: '500+' },
                { label: 'Appointments', value: '50K+' },
                { label: 'Uptime', value: '99.5%' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-card/50 border-border/50 rounded-lg border p-4 backdrop-blur-sm"
                >
                  <div className="text-primary mb-1 text-2xl font-bold md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="from-background absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent" />
    </section>
  );
}
