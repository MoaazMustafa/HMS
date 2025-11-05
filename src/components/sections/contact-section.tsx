'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ContactSection() {
  return (
    <section id="contact" className="relative py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div data-aos="fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Ready to Transform{' '}
                <span className="bg-linear-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  Your Practice?
                </span>
              </h2>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Get started with HMS today and experience the future of
                healthcare management.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                content: 'support@hms-health.com',
                href: 'mailto:support@hms-health.com',
                delay: 0,
              },
              {
                icon: Phone,
                title: 'Call Us',
                content: '+1 (555) 123-4567',
                href: 'tel:+15551234567',
                delay: 100,
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                content: 'Available 24/7',
                href: '#',
                delay: 200,
              },
            ].map((item) => (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={item.delay}
              >
                <motion.a
                  href={item.href}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group block rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.content}
                  </p>
                </motion.a>
              </div>
            ))}
          </div>

          <div data-aos="zoom-in" data-aos-delay="400">
            <div className="mt-12 rounded-3xl border border-border/50 bg-linear-to-br from-primary/10 via-transparent to-transparent p-8 md:p-12 shadow-xl">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl">
                  Start Your Free Trial
                </h3>
                <p className="mb-8 text-muted-foreground text-base lg:text-lg">
                  Experience HMS with a 30-day free trial. No credit card
                  required.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Get Started Free
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:border-primary/50 hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
