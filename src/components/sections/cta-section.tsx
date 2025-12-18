'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Calendar,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function CTASection() {
  const benefits = [
    'Start managing patients in minutes',
    'No credit card required',
    'Free 30-day trial',
    'Cancel anytime',
  ];

  const trustIndicators = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Calendar, value: '50,000+', label: 'Appointments' },
    { icon: Shield, value: '99.9%', label: 'Secure' },
  ];

  return (
    <section className="from-primary/10 via-background to-background relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-br py-24 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="bg-primary/20 absolute top-0 left-0 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative container px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl"
              >
                Ready to Transform Your
                <span className="text-primary mt-2 block">
                  Healthcare Practice?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl"
              >
                Join thousands of healthcare professionals already using HMS to
                deliver better patient care
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-12 flex flex-wrap justify-center gap-4"
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-card/50 border-border flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="text-primary h-4 w-4" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
              >
                <Link href="/register">
                  <Button size="lg" className="group px-8 py-6 text-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg"
                  >
                    Sign In to Dashboard
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="border-border/50 mx-auto grid max-w-3xl grid-cols-3 gap-8 border-t pt-12"
              >
                {trustIndicators.map((indicator, index) => {
                  const Icon = indicator.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="bg-primary/10 border-primary/20 mb-3 inline-flex rounded-full border p-3">
                        <Icon className="text-primary h-6 w-6" />
                      </div>
                      <div className="text-primary mb-1 text-2xl font-bold md:text-3xl">
                        {indicator.value}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {indicator.label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
