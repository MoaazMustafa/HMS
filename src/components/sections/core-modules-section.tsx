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
      description: 'Comprehensive patient registration, profiles, and medical history tracking',
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
      description: 'Digital prescriptions with drug interaction checking and e-signatures',
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
      description: 'Smart booking system with automated reminders and conflict prevention',
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
      description: 'Complete electronic health records with SOAP notes and ICD-10 coding',
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
      description: 'Laboratory test ordering, results tracking, and critical value alerts',
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
    <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              Core Modules
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Comprehensive Healthcare
              <span className="block text-primary mt-2">Management System</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Five integrated modules designed to streamline healthcare operations and improve patient care
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 ${module.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl ${module.bgColor} border ${module.borderColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${module.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
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
                          <Check className={`w-4 h-4 ${module.color} shrink-0 mt-0.5`} />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ArrowRight className={`w-6 h-6 ${module.color}`} />
                    </motion.div>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.6}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All modules work seamlessly together to provide a unified healthcare experience
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
              Learn more about our architecture
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
