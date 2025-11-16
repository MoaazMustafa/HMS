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
    <section className="py-24 md:py-32 bg-linear-to-b from-muted/30 to-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5" />
      
      <div className="container px-6 relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              Security & Performance
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Enterprise-Grade
              <span className="block text-primary mt-2">Security & Speed</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with security, compliance, and performance as foundational principles
            </p>
          </div>
        </ScrollReveal>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 inline-flex mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Performance That Matters
              </h3>
              <p className="text-muted-foreground">
                Optimized for speed and reliability in critical healthcare environments
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {metric.value}
                    </div>
                    <div className="font-semibold mb-1">{metric.label}</div>
                    <div className="text-sm text-muted-foreground">
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
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50 border border-border hover:border-primary/50 transition-all"
                >
                  <Icon className="w-5 h-5 text-primary" />
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
