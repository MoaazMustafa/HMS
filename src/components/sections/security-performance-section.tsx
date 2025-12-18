'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Zap,
  Server,
  Clock,
  CheckCircle2,
  Award,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function SecurityPerformanceSection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Full compliance with healthcare data protection standards',
    },
    {
      icon: Lock,
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption for data at rest and in transit',
    },
    {
      icon: Eye,
      title: 'Audit Logging',
      description: 'Complete activity tracking for compliance and security',
    },
    {
      icon: Award,
      title: 'WCAG 2.1 Level AA',
      description: 'Accessible to all users with disability compliance',
    },
  ];

  const performanceMetrics = [
    {
      icon: Zap,
      value: '<3s',
      label: 'Page Load Time',
      description: 'Lightning-fast performance',
    },
    {
      icon: Server,
      value: '99.5%',
      label: 'System Uptime',
      description: 'Reliable and available',
    },
    {
      icon: Clock,
      value: '<1s',
      label: 'Search Results',
      description: 'Instant data retrieval',
    },
    {
      icon: CheckCircle2,
      value: '10K+',
      label: 'Concurrent Users',
      description: 'Scalable architecture',
    },
  ];

  return (
    <section className="from-muted/30 to-background relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-b py-24 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5" />

      <div className="relative container px-6">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
            >
              Security & Performance
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Enterprise-Grade
              <span className="text-primary mt-2 block">Security & Speed</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Built with security, compliance, and performance as foundational
              principles
            </p>
          </div>
        </ScrollReveal>

        {/* Security Features */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="from-primary/5 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="bg-primary/10 border-primary/20 mb-4 inline-flex rounded-xl border p-3 transition-transform group-hover:scale-110">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <ScrollReveal delay={0.4}>
          <div className="bg-card/50 border-border rounded-2xl border p-8 backdrop-blur-sm md:p-12">
            <div className="mb-12 text-center">
              <h3 className="mb-3 text-2xl font-bold md:text-3xl">
                Performance That Matters
              </h3>
              <p className="text-muted-foreground">
                Optimized for speed and reliability in critical healthcare
                environments
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group text-center"
                  >
                    <div className="bg-primary/10 border-primary/20 mb-4 inline-flex rounded-full border p-4 transition-transform group-hover:scale-110">
                      <Icon className="text-primary h-8 w-8" />
                    </div>
                    <div className="text-primary mb-2 text-3xl font-bold md:text-4xl">
                      {metric.value}
                    </div>
                    <div className="mb-1 font-semibold">{metric.label}</div>
                    <div className="text-muted-foreground text-sm">
                      {metric.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Compliance Badges */}
        <ScrollReveal delay={0.6}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
            {[
              { label: 'HIPAA Compliant', icon: Shield },
              { label: 'ISO 27001', icon: Award },
              { label: 'SOC 2 Type II', icon: Lock },
              { label: 'WCAG 2.1 AA', icon: Eye },
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-muted/50 border-border hover:border-primary/50 flex items-center gap-3 rounded-full border px-6 py-3 transition-all"
                >
                  <Icon className="text-primary h-5 w-5" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
