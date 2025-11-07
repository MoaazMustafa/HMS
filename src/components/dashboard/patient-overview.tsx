'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Pill,
  FlaskConical,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type PatientWithRelations = any; // We'll type this properly

export function PatientOverview({ patient }: { patient: PatientWithRelations }) {
  const upcomingAppointments = patient.appointments || [];
  const activePrescriptions = patient.prescriptions || [];
  const recentLabTests = patient.labTests || [];
  const activeAllergies = patient.allergies || [];

  const stats = [
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Active Prescriptions',
      value: activePrescriptions.length,
      icon: Pill,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Recent Lab Tests',
      value: recentLabTests.length,
      icon: FlaskConical,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Active Allergies',
      value: activeAllergies.length,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Alert Banner for Allergies */}
      {activeAllergies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-md p-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-red-500 mb-1.5">Active Allergies</h3>
              <div className="space-y-1">
                {activeAllergies.map((allergy: any) => (
                  <p key={allergy.id} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{allergy.allergen}</span> -{' '}
                    <span className="text-muted-foreground">{allergy.type}</span>
                    {allergy.severity && (
                      <span
                        className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                          allergy.severity === 'SEVERE'
                            ? 'bg-red-500/20 text-red-400'
                            : allergy.severity === 'MODERATE'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {allergy.severity}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card border ${stat.borderColor} rounded-md p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} ${stat.borderColor} border rounded-md p-2`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-md p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Upcoming Appointments
            </h3>
            <Link href="/dashboard/appointments">
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 h-6">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="bg-muted/50 border border-border rounded-md p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Dr. {appointment.doctor.user.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{appointment.doctor.specialization}</p>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        appointment.status === 'CONFIRMED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(appointment.scheduledDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.scheduledTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link href="/dashboard/appointments">
            <Button className="w-full mt-3" variant="outline" size="sm">
              Book New Appointment
            </Button>
          </Link>
        </motion.div>

        {/* Active Prescriptions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-md p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              Active Prescriptions
            </h3>
            <Link href="/dashboard/prescriptions">
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 h-6">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {activePrescriptions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No active prescriptions</p>
            ) : (
              activePrescriptions.map((prescription: any) => (
                <div
                  key={prescription.id}
                  className="bg-muted/50 border border-border rounded-md p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{prescription.medicationName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                    <span>Prescribed by Dr. {prescription.doctor.user.name}</span>
                    {prescription.refillsRemaining !== null && (
                      <span className="text-primary font-medium">{prescription.refillsRemaining} refills</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Lab Tests */}
      {recentLabTests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-md p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-500" />
              Recent Lab Results
            </h3>
            <Link href="/dashboard/lab-results">
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 h-6">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentLabTests.map((test: any) => (
              <div
                key={test.id}
                className="bg-muted/50 border border-border rounded-md p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  <p className="text-xs font-semibold text-foreground">{test.testName}</p>
                </div>
                {test.isCritical && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded mb-2 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Critical
                  </span>
                )}
                <p className="text-[10px] text-muted-foreground">
                  {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card border border-border rounded-md p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/dashboard/appointments">
            <Button className="w-full" variant="outline" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Book Appointment
            </Button>
          </Link>
          <Link href="/dashboard/medical-records">
            <Button className="w-full" variant="outline" size="sm">
              <FileText className="w-3.5 h-3.5 mr-2" />
              View Medical Records
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button className="w-full" variant="outline" size="sm">
              <FileText className="w-3.5 h-3.5 mr-2" />
              Update Profile
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
