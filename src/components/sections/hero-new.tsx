'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Pill, Users, Activity, Shield } from 'lucide-react';
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <Icon className="w-16 h-16 md:w-24 md:h-24" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              HIPAA Compliant • WCAG 2.1 AA • Secure by Design
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Next-Generation
              <span className="block bg-gradient-to-r from-primary via-green-400 to-blue-500 bg-clip-text text-transparent mt-2">
                Healthcare Management
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Comprehensive digital platform for managing patients, prescriptions, appointments, 
              medical records, and lab tests. Built with security, compliance, and user experience at its core.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="group px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Quick Stats */}
          <ScrollReveal delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
                  className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
