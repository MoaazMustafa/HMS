'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Pill,
  Stethoscope,
  TestTube,
  Users,
} from 'lucide-react';

const modules = [
  {
    icon: Users,
    title: 'Patient Management',
    description:
      'Complete patient lifecycle management from registration to discharge.',
    features: [
      'Automated Patient ID generation',
      'Email & Phone OTP verification',
      'Emergency contact management',
      'Profile version history',
      'Advanced search with partial matching',
    ],
    color: 'from-blue-500/10 to-primary/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Pill,
    title: 'Prescription Management',
    description:
      'Digital prescription system with safety checks and compliance features.',
    features: [
      'Searchable drug database',
      'Drug-drug interaction alerts',
      'Allergy checking system',
      'Digital signature & QR codes',
      'Prescription version tracking',
    ],
    color: 'from-purple-500/10 to-primary/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Calendar,
    title: 'Appointment Scheduling',
    description:
      'Smart scheduling system with automated reminders and conflict prevention.',
    features: [
      'Real-time availability display',
      'Multi-channel reminders (SMS/Email/Push)',
      'Doctor schedule management',
      'Walk-in patient registration',
      'No-show tracking',
    ],
    color: 'from-pink-500/10 to-primary/10',
    iconColor: 'text-pink-500',
  },
  {
    icon: Activity,
    title: 'Medical Records',
    description:
      'Comprehensive EHR system with clinical documentation and reporting.',
    features: [
      'SOAP format clinical notes',
      'ICD-10 diagnosis coding',
      'Vital signs with trend analysis',
      'Lab report management',
      'Immunization tracking',
    ],
    color: 'from-green-500/10 to-primary/10',
    iconColor: 'text-green-500',
  },
];

const additionalFeatures = [
  { icon: Heart, label: 'Allergy Alerts', color: 'text-red-500' },
  { icon: TestTube, label: 'Lab Integration', color: 'text-yellow-500' },
  { icon: Stethoscope, label: 'Vital Signs', color: 'text-cyan-500' },
  { icon: FileText, label: 'Digital Reports', color: 'text-indigo-500' },
];

export function ModulesSection() {
  return (
    <section id="modules" className="bg-muted/30 relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <div data-aos="fade-up">
            <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              Core Modules
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Four Powerful Modules,{' '}
              <span className="from-primary to-primary-600 bg-linear-to-r bg-clip-text text-transparent">
                One Complete Solution
              </span>
            </h2>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              Each module is designed to work seamlessly together, providing a
              unified healthcare management experience.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {modules.map((module, index) => (
            <div
              key={module.title}
              data-aos="flip-left"
              data-aos-delay={index * 100}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group border-border/50 relative overflow-hidden rounded-3xl border bg-linear-to-br ${module.color} hover:border-primary/50 hover:shadow-primary/20 p-8 backdrop-blur-sm transition-all hover:shadow-2xl`}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`bg-background/50 inline-flex rounded-2xl p-4 ${module.iconColor} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <module.icon className="h-8 w-8" />
                  </div>
                  <div className="text-muted-foreground/20 group-hover:text-primary/20 text-5xl font-bold transition-colors">
                    0{index + 1}
                  </div>
                </div>

                <h3 className="text-foreground mb-3 text-2xl font-bold lg:text-3xl">
                  {module.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-base lg:text-lg">
                  {module.description}
                </p>

                <ul className="space-y-3">
                  {module.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                      <span className="text-foreground/80 text-sm lg:text-base">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="bg-primary/5 group-hover:bg-primary/10 absolute -right-6 -bottom-6 h-32 w-32 rounded-full blur-3xl transition-all group-hover:scale-150" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Additional Features Bar */}
        <div data-aos="zoom-in" data-aos-delay="400">
          <div className="border-border/50 bg-card/50 mt-12 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm">
            <div className="bg-border/50 grid grid-cols-2 gap-px md:grid-cols-4">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-background flex cursor-pointer flex-col items-center gap-3 p-6"
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <span className="text-foreground text-sm font-medium">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
