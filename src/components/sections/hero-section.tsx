'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Calendar,
  FileText,
  Shield,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div data-aos="fade-right" data-aos-delay="0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                  <Shield className="h-4 w-4" />
                  HIPAA Compliant & Secure
                </div>
              </motion.div>
            </div>

            <div data-aos="fade-right" data-aos-delay="100">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
                Transform Healthcare with{' '}
                <span className="bg-linear-to-r from-primary via-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Intelligent Management
                </span>
              </h1>
            </div>

            <div data-aos="fade-right" data-aos-delay="200">
              <p className="text-lg text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                Comprehensive digital platform for managing patients,
                prescriptions, appointments, and medical records. Streamline
                your practice with cutting-edge healthcare technology.
              </p>
            </div>

            <div data-aos="fade-right" data-aos-delay="300">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:border-primary/50 hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div data-aos="fade-up" data-aos-delay="400">
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                    99.5%
                  </div>
                  <div className="text-xs text-muted-foreground md:text-sm">
                    Uptime
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                    10K+
                  </div>
                  <div className="text-xs text-muted-foreground md:text-sm">
                    Users
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                    &lt;3s
                  </div>
                  <div className="text-xs text-muted-foreground md:text-sm">
                    Load Time
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: 'Patient Management',
                  color: 'from-blue-500/20 to-primary/20',
                  delay: 0,
                },
                {
                  icon: FileText,
                  title: 'E-Prescriptions',
                  color: 'from-purple-500/20 to-primary/20',
                  delay: 100,
                },
                {
                  icon: Calendar,
                  title: 'Smart Scheduling',
                  color: 'from-pink-500/20 to-primary/20',
                  delay: 200,
                },
                {
                  icon: Activity,
                  title: 'Medical Records',
                  color: 'from-primary/20 to-green-500/20',
                  delay: 300,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  data-aos="zoom-in"
                  data-aos-delay={item.delay}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br ${item.color} p-6 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all`}
                >
                  <item.icon className="mb-3 h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3" />
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all group-hover:scale-150" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-primary/30 p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
