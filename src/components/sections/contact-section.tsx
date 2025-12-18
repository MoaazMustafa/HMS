'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ContactSection() {
  return (
    <section id="contact" className="bg-muted/30 relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div data-aos="fade-up">
              <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Ready to Transform{' '}
                <span className="from-primary to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
                  Your Practice?
                </span>
              </h2>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
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
                  className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-primary/10 block rounded-2xl border p-6 text-center backdrop-blur-sm transition-all hover:shadow-lg"
                >
                  <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.content}
                  </p>
                </motion.a>
              </div>
            ))}
          </div>

          <div data-aos="zoom-in" data-aos-delay="400">
            <div className="border-border/50 from-primary/10 mt-12 rounded-3xl border bg-linear-to-br via-transparent to-transparent p-8 shadow-xl md:p-12">
              <div className="text-center">
                <h3 className="text-foreground mb-4 text-2xl font-bold lg:text-3xl">
                  Start Your Free Trial
                </h3>
                <p className="text-muted-foreground mb-8 text-base lg:text-lg">
                  Experience HMS with a 30-day free trial. No credit card
                  required.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/30 shadow-lg transition-all hover:shadow-xl"
                  >
                    Get Started Free
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:border-primary/50 hover:bg-primary/10 shadow-lg transition-all hover:shadow-xl"
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
