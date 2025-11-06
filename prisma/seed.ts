import { PrismaClient, UserRole, Gender, BloodGroup } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Main Admin
  const mainAdmin = await prisma.user.create({
    data: {
      email: 'mainadmin@hms.com',
      password: hashedPassword,
      role: UserRole.MAIN_ADMIN,
      emailVerified: new Date(),
      admin: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          phone: '+1234567890',
        },
      },
    },
  });
  console.log('✅ Main Admin created');

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hms.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      admin: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+1234567891',
        },
      },
    },
  });
  console.log('✅ Admin created');

  // Create Doctors
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.smith@hms.com',
      password: hashedPassword,
      role: UserRole.DOCTOR,
      emailVerified: new Date(),
      doctor: {
        create: {
          firstName: 'John',
          lastName: 'Smith',
          specialization: 'Cardiology',
          licenseNumber: 'DOC-001',
          phone: '+1234567892',
          defaultAppointmentFee: 150.00,
          defaultSessionFee: 100.00,
          workingHours: {
            create: [
              { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 5, startTime: '09:00', endTime: '13:00' },
            ],
          },
        },
      },
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.johnson@hms.com',
      password: hashedPassword,
      role: UserRole.DOCTOR,
      emailVerified: new Date(),
      doctor: {
        create: {
          firstName: 'Emily',
          lastName: 'Johnson',
          specialization: 'General Practice',
          licenseNumber: 'DOC-002',
          phone: '+1234567893',
          defaultAppointmentFee: 120.00,
          defaultSessionFee: 80.00,
          workingHours: {
            create: [
              { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 5, startTime: '08:00', endTime: '14:00' },
            ],
          },
        },
      },
    },
  });
  console.log('✅ Doctors created');

  // Create Nurse
  const nurse = await prisma.user.create({
    data: {
      email: 'nurse.williams@hms.com',
      password: hashedPassword,
      role: UserRole.NURSE,
      emailVerified: new Date(),
      nurse: {
        create: {
          firstName: 'Sarah',
          lastName: 'Williams',
          licenseNumber: 'NUR-001',
          phone: '+1234567894',
        },
      },
    },
  });
  console.log('✅ Nurse created');

  // Create Receptionist
  const receptionist = await prisma.user.create({
    data: {
      email: 'receptionist@hms.com',
      password: hashedPassword,
      role: UserRole.RECEPTIONIST,
      emailVerified: new Date(),
      receptionist: {
        create: {
          firstName: 'Maria',
          lastName: 'Garcia',
          phone: '+1234567895',
        },
      },
    },
  });
  console.log('✅ Receptionist created');

  // Create Patients
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@example.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      emailVerified: new Date(),
      patient: {
        create: {
          patientId: 'PAT-001',
          firstName: 'Michael',
          lastName: 'Brown',
          dateOfBirth: new Date('1990-05-15'),
          gender: Gender.MALE,
          bloodGroup: BloodGroup.O_POSITIVE,
          phone: '+1234567896',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          emergencyContactName: 'Jane Brown',
          emergencyContactPhone: '+1234567897',
          emergencyContactRelation: 'Spouse',
          allergies: {
            create: [
              {
                allergen: 'Penicillin',
                type: 'MEDICATION',
                severity: 'SEVERE',
                reaction: 'Anaphylaxis',
              },
            ],
          },
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@example.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      emailVerified: new Date(),
      patient: {
        create: {
          patientId: 'PAT-002',
          firstName: 'Jennifer',
          lastName: 'Davis',
          dateOfBirth: new Date('1985-08-22'),
          gender: Gender.FEMALE,
          bloodGroup: BloodGroup.A_POSITIVE,
          phone: '+1234567898',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          emergencyContactName: 'Robert Davis',
          emergencyContactPhone: '+1234567899',
          emergencyContactRelation: 'Spouse',
        },
      },
    },
  });
  console.log('✅ Patients created');

  // Create some medications
  await prisma.medication.createMany({
    data: [
      { name: 'Amoxicillin', genericName: 'Amoxicillin', category: 'Antibiotic' },
      { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'Pain Reliever' },
      { name: 'Lisinopril', genericName: 'Lisinopril', category: 'Blood Pressure' },
      { name: 'Metformin', genericName: 'Metformin', category: 'Diabetes' },
      { name: 'Atorvastatin', genericName: 'Atorvastatin', category: 'Cholesterol' },
    ],
  });
  console.log('✅ Medications created');

  // Create system settings
  await prisma.systemSettings.createMany({
    data: [
      {
        key: 'APPOINTMENT_REMINDER_HOURS',
        value: '24,2',
        description: 'Hours before appointment to send reminders',
        updatedBy: mainAdmin.id,
      },
      {
        key: 'MAX_APPOINTMENTS_PER_DAY',
        value: '20',
        description: 'Maximum appointments a doctor can have per day',
        updatedBy: mainAdmin.id,
      },
      {
        key: 'APPOINTMENT_DURATION_MINUTES',
        value: '30',
        description: 'Default appointment duration in minutes',
        updatedBy: mainAdmin.id,
      },
    ],
  });
  console.log('✅ System settings created');

  // Create notification templates
  await prisma.notificationTemplate.createMany({
    data: [
      {
        type: 'APPOINTMENT_REMINDER',
        subject: 'Appointment Reminder',
        body: 'Hello {{patientName}}, this is a reminder for your appointment with Dr. {{doctorName}} on {{date}} at {{time}}.',
        variables: ['patientName', 'doctorName', 'date', 'time'],
      },
      {
        type: 'APPOINTMENT_CONFIRMATION',
        subject: 'Appointment Confirmed',
        body: 'Your appointment with Dr. {{doctorName}} has been confirmed for {{date}} at {{time}}.',
        variables: ['patientName', 'doctorName', 'date', 'time'],
      },
      {
        type: 'PRESCRIPTION_CHANGE',
        subject: 'Prescription Update',
        body: 'Your prescription for {{medicationName}} has been updated. Please review the changes.',
        variables: ['patientName', 'medicationName'],
      },
    ],
  });
  console.log('✅ Notification templates created');

  console.log('✨ Database seeding completed!');
  console.log('\n📝 Demo Credentials:');
  console.log('Main Admin: mainadmin@hms.com / password123');
  console.log('Admin: admin@hms.com / password123');
  console.log('Doctor 1: dr.smith@hms.com / password123');
  console.log('Doctor 2: dr.johnson@hms.com / password123');
  console.log('Nurse: nurse.williams@hms.com / password123');
  console.log('Receptionist: receptionist@hms.com / password123');
  console.log('Patient 1: patient1@example.com / password123');
  console.log('Patient 2: patient2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
