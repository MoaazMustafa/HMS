'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Users, Calendar, Shield } from 'lucide-react';
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
    <section className="flex flex-col items-center justify-center py-24 md:py-32 bg-linear-to-br from-primary/10 via-background to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container px-6 relative">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              >
                Ready to Transform Your
                <span className="block text-primary mt-2">Healthcare Practice?</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                Join thousands of healthcare professionals already using HMS to deliver better patient care
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
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
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              >
                <Link href="/register">
                  <Button size="lg" className="group px-8 py-6 text-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
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
                className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-border/50"
              >
                {trustIndicators.map((indicator, index) => {
                  const Icon = indicator.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/20 mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                        {indicator.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
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
