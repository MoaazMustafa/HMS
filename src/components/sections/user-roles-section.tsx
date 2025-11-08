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
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              User Roles & Permissions
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Built for Every
              <span className="block text-primary mt-2">Healthcare Professional</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Role-based access control with customized dashboards for optimal workflow
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative p-8">
                    {/* Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-xl bg-card border-2 ${role.color} border-current/20`}>
                        <Icon className={`w-8 h-8 ${role.color}`} />
                      </div>
                      
                      {/* Stats Badge */}
                      <div className="text-right">
                        {Object.entries(role.stats).map(([key, value], idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-muted-foreground">{key}: </span>
                            <span className={`font-semibold ${role.color}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
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
                          className="flex items-center gap-2 text-sm group/item"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${role.color} bg-current`} />
                          <span className="group-hover/item:text-foreground transition-colors">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Icon Indicators */}
                    <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border/50">
                      {[Calendar, FileText, Settings].map((IconComponent, idx) => (
                        <IconComponent
                          key={idx}
                          className={`w-4 h-4 ${role.color} opacity-50`}
                        />
                      ))}
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
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-primary/5 border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="text-sm font-semibold text-primary">RBAC Security</div>
                <div className="text-xs text-muted-foreground">Role-Based Access Control with audit logging</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
