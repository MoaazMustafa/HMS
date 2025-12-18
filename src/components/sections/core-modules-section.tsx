'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Pill,
  Calendar,
  FileText,
  FlaskConical,
  ArrowRight,
  Check,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function CoreModulesSection() {
  const modules = [
    {
      icon: Users,
      title: 'Patient Management',
      description:
        'Comprehensive patient registration, profiles, and medical history tracking',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: [
        'Auto-generated Patient IDs',
        'Advanced search & filtering',
        'Doctor assignment workflow',
        'Version control for profiles',
        'Emergency contact management',
      ],
    },
    {
      icon: Pill,
      title: 'Prescription Management',
      description:
        'Digital prescriptions with drug interaction checking and e-signatures',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: [
        'E-Prescriptions with QR codes',
        'Drug interaction alerts',
        'Allergy checking system',
        'Refill management',
        'Digital signatures',
      ],
    },
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description:
        'Smart booking system with automated reminders and conflict prevention',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: [
        'Real-time availability',
        'Double-booking prevention',
        'Multi-channel reminders',
        'Status tracking workflow',
        'Custom fee management',
      ],
    },
    {
      icon: FileText,
      title: 'Medical Records (EHR)',
      description:
        'Complete electronic health records with SOAP notes and ICD-10 coding',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      features: [
        'SOAP format documentation',
        'ICD-10 diagnosis codes',
        'Digital signature workflow',
        'Active problem lists',
        'Immutable finalized records',
      ],
    },
    {
      icon: FlaskConical,
      title: 'Lab Test Management',
      description:
        'Laboratory test ordering, results tracking, and critical value alerts',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      features: [
        'Test ordering system',
        'Results with trend graphs',
        'Critical value alerts',
        'Doctor review workflow',
        'Historical data tracking',
      ],
    },
  ];

  return (
    <section className="from-background to-muted/20 flex flex-col items-center justify-center bg-gradient-to-b py-24 md:py-32">
      <div className="container px-6">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
            >
              Core Modules
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Comprehensive Healthcare
              <span className="text-primary mt-2 block">Management System</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Five integrated modules designed to streamline healthcare
              operations and improve patient care
            </p>
          </div>
        </ScrollReveal>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group hover:border-primary/50 relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 ${module.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex rounded-2xl p-4 ${module.bgColor} border ${module.borderColor} mb-6 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-8 w-8 ${module.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="group-hover:text-primary mb-3 text-xl font-bold transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {module.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3">
                      {module.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check
                            className={`h-4 w-4 ${module.color} mt-0.5 shrink-0`}
                          />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute right-8 bottom-8 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <ArrowRight className={`h-6 w-6 ${module.color}`} />
                    </motion.div>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              All modules work seamlessly together to provide a unified
              healthcare experience
            </p>
            <div className="text-primary inline-flex items-center gap-2 text-sm font-medium">
              Learn more about our architecture
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
