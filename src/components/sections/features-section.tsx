'use client';

import {
  Activity,
  Bell,
  Calendar,
  ChartBar,
  Clock,
  FileText,
  Heart,
  Lock,
  Search,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { FeatureCard } from '@/components/ui/feature-card';

const features = [
  {
    icon: Users,
    title: 'Patient Management',
    description:
      'Comprehensive patient registration, profile management, and search functionality with version history tracking.',
  },
  {
    icon: FileText,
    title: 'E-Prescriptions',
    description:
      'Digital prescription system with drug database, interaction checking, and QR code generation for security.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description:
      'Intelligent appointment booking with automated reminders via SMS, email, and push notifications.',
  },
  {
    icon: Activity,
    title: 'Medical Records',
    description:
      'Complete EHR system with SOAP format clinical notes, vital signs tracking, and lab report management.',
  },
  {
    icon: Search,
    title: 'Advanced Search',
    description:
      'Lightning-fast search across all records with partial matching and results in under 2 seconds.',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description:
      'Instant notifications for critical lab values, appointment reminders, and prescription changes.',
  },
  {
    icon: Lock,
    title: 'Security First',
    description:
      'Multi-factor authentication, AES-256 encryption, and role-based access control for data protection.',
  },
  {
    icon: ChartBar,
    title: 'Analytics Dashboard',
    description:
      'Comprehensive insights with trend analysis, patient demographics, and practice performance metrics.',
  },
  {
    icon: Heart,
    title: 'Allergy Tracking',
    description:
      'Prominent allergy alerts for medications, food, and environmental factors across all modules.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      '99.5% uptime guarantee with daily automated backups and 4-hour recovery time objective.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description:
      'Full compliance with healthcare regulations including audit logging and encrypted communications.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Optimized for performance with page loads under 3 seconds and support for 10,000+ concurrent users.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <div data-aos="fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              Comprehensive Features
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Everything You Need for{' '}
              <span className="bg-linear-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                Modern Healthcare
              </span>
            </h2>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Powerful features designed to streamline healthcare operations and
              improve patient care quality.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
