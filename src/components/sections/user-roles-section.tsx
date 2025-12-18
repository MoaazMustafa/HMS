'use client';

import { motion } from 'framer-motion';
import {
  User,
  Stethoscope,
  UserCog,
  Users,
  Shield,
  Heart,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function UserRolesSection() {
  const roles = [
    {
      icon: User,
      title: 'Patient Portal',
      description: 'Comprehensive health management for patients',
      color: 'text-blue-500',
      gradient: 'from-blue-500/20 to-blue-500/0',
      features: [
        'Book & manage appointments',
        'View prescriptions & refills',
        'Access medical records',
        'View lab results & trends',
        'Manage health profile',
        '24/7 access to health data',
      ],
      stats: { users: '10,000+', satisfaction: '4.8/5' },
    },
    {
      icon: Stethoscope,
      title: 'Doctor Dashboard',
      description: 'Complete clinical workflow management',
      color: 'text-green-500',
      gradient: 'from-green-500/20 to-green-500/0',
      features: [
        'Patient management system',
        'SOAP note documentation',
        'E-prescribing with checks',
        'Lab order & review',
        'Schedule management',
        'Digital signatures',
      ],
      stats: { users: '500+', efficiency: '+40%' },
    },
    {
      icon: Heart,
      title: 'Nurse Station',
      description: 'Essential patient care tools',
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-purple-500/0',
      features: [
        'Record vital signs',
        'View patient records',
        'Medication overview',
        'Allergy information',
        'Check-in procedures',
        'Clinical support',
      ],
      stats: { users: '800+', accuracy: '99.9%' },
    },
    {
      icon: Users,
      title: 'Receptionist Panel',
      description: 'Front desk operations hub',
      color: 'text-orange-500',
      gradient: 'from-orange-500/20 to-orange-500/0',
      features: [
        'Patient registration',
        'Appointment scheduling',
        'Walk-in management',
        'Doctor availability',
        'Insurance verification',
        'Calendar management',
      ],
      stats: { efficiency: '+35%', satisfaction: '4.7/5' },
    },
    {
      icon: UserCog,
      title: 'Admin Control',
      description: 'System administration & management',
      color: 'text-red-500',
      gradient: 'from-red-500/20 to-red-500/0',
      features: [
        'User management',
        'Role assignment',
        'System configuration',
        'Reports & analytics',
        'Audit logs',
        'Data management',
      ],
      stats: { control: 'Full', security: 'HIPAA' },
    },
    {
      icon: Shield,
      title: 'Super Admin',
      description: 'Complete system oversight',
      color: 'text-primary',
      gradient: 'from-primary/20 to-primary/0',
      features: [
        'All role permissions',
        'Admin management',
        'Security compliance',
        'System integrations',
        'Policy configuration',
        'Disaster recovery',
      ],
      stats: { access: 'Complete', override: 'Enabled' },
    },
  ];

  return (
    <section className="bg-muted/30 flex flex-col items-center justify-center py-24 md:py-32">
      <div className="container px-6">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
            >
              User Roles & Permissions
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Built for Every
              <span className="text-primary mt-2 block">
                Healthcare Professional
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Role-based access control with customized dashboards for optimal
              workflow
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative p-8">
                    {/* Icon Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div
                        className={`bg-card rounded-xl border-2 p-4 ${role.color} border-current/20`}
                      >
                        <Icon className={`h-8 w-8 ${role.color}`} />
                      </div>

                      {/* Stats Badge */}
                      <div className="text-right">
                        {Object.entries(role.stats).map(([key, value], idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-muted-foreground">
                              {key}:{' '}
                            </span>
                            <span className={`font-semibold ${role.color}`}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="group-hover:text-primary mb-2 text-2xl font-bold transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      {role.description}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {role.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="group/item flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${role.color} bg-current`}
                          />
                          <span className="group-hover/item:text-foreground transition-colors">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Icon Indicators */}
                    <div className="border-border/50 mt-6 flex items-center gap-2 border-t pt-6">
                      {[Calendar, FileText, Settings].map(
                        (IconComponent, idx) => (
                          <IconComponent
                            key={idx}
                            className={`h-4 w-4 ${role.color} opacity-50`}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Security Badge */}
        <ScrollReveal delay={0.8}>
          <div className="mt-16 text-center">
            <div className="bg-primary/5 border-primary/20 inline-flex items-center gap-3 rounded-full border px-6 py-4">
              <Shield className="text-primary h-5 w-5" />
              <div className="text-left">
                <div className="text-primary text-sm font-semibold">
                  RBAC Security
                </div>
                <div className="text-muted-foreground text-xs">
                  Role-Based Access Control with audit logging
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
