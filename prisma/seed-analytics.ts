import { startOfDay, subDays } from 'date-fns';

import { prisma } from '@/lib/prisma';

export async function seedAnalyticsData() {
  console.log('Seeding analytics data...');

  try {
    // Generate analytics for the last 90 days
    for (let i = 0; i < 90; i++) {
      const date = startOfDay(subDays(new Date(), i));
      
      // Generate random but realistic data
      const baseAppointments = Math.floor(Math.random() * 20) + 10;
      const completedPercentage = 0.6 + Math.random() * 0.3; // 60-90%
      const cancelledPercentage = 0.05 + Math.random() * 0.1; // 5-15%
      
      await prisma.dailyAnalytics.upsert({
        where: { date },
        create: {
          date,
          totalAppointments: baseAppointments,
          completedAppointments: Math.floor(baseAppointments * completedPercentage),
          cancelledAppointments: Math.floor(baseAppointments * cancelledPercentage),
          newPatients: Math.floor(Math.random() * 5) + 1,
          totalUsers: 100 + (90 - i) * 2, // Growing user base
          activePrescriptions: Math.floor(Math.random() * 30) + 20,
          newPrescriptions: Math.floor(Math.random() * 10) + 3,
          labTestsOrdered: Math.floor(Math.random() * 15) + 5,
          labTestsCompleted: Math.floor(Math.random() * 12) + 4,
          totalRevenue: (Math.random() * 2000 + 1000).toFixed(2),
        },
        update: {
          totalAppointments: baseAppointments,
          completedAppointments: Math.floor(baseAppointments * completedPercentage),
          cancelledAppointments: Math.floor(baseAppointments * cancelledPercentage),
          newPatients: Math.floor(Math.random() * 5) + 1,
          totalUsers: 100 + (90 - i) * 2,
          activePrescriptions: Math.floor(Math.random() * 30) + 20,
          newPrescriptions: Math.floor(Math.random() * 10) + 3,
          labTestsOrdered: Math.floor(Math.random() * 15) + 5,
          labTestsCompleted: Math.floor(Math.random() * 12) + 4,
          totalRevenue: (Math.random() * 2000 + 1000).toFixed(2),
        },
      });
    }

    // Seed department analytics
    const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'];
    
    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(new Date(), i));
      
      for (const dept of departments) {
        await prisma.departmentAnalytics.upsert({
          where: {
            date_departmentName: {
              date,
              departmentName: dept,
            },
          },
          create: {
            date,
            departmentName: dept,
            totalPatients: Math.floor(Math.random() * 50) + 20,
            totalAppointments: Math.floor(Math.random() * 80) + 30,
            completedSessions: Math.floor(Math.random() * 60) + 20,
            revenue: (Math.random() * 5000 + 2000).toFixed(2),
          },
          update: {
            totalPatients: Math.floor(Math.random() * 50) + 20,
            totalAppointments: Math.floor(Math.random() * 80) + 30,
            completedSessions: Math.floor(Math.random() * 60) + 20,
            revenue: (Math.random() * 5000 + 2000).toFixed(2),
          },
        });
      }
    }

    // Seed medication analytics
    const medications = [
      'Lisinopril',
      'Metformin',
      'Amoxicillin',
      'Atorvastatin',
      'Omeprazole',
      'Ibuprofen',
      'Aspirin',
      'Levothyroxine',
    ];

    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(new Date(), i));
      
      for (const med of medications) {
        await prisma.medicationAnalytics.upsert({
          where: {
            date_medicationName: {
              date,
              medicationName: med,
            },
          },
          create: {
            date,
            medicationName: med,
            prescriptionCount: Math.floor(Math.random() * 20) + 5,
          },
          update: {
            prescriptionCount: Math.floor(Math.random() * 20) + 5,
          },
        });
      }
    }

    // Seed diagnosis analytics
    const diagnoses = [
      'Hypertension',
      'Diabetes Type 2',
      'Common Cold',
      'Anxiety Disorder',
      'Back Pain',
      'Asthma',
      'Migraine',
      'Depression',
    ];

    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(new Date(), i));
      
      for (const diagnosis of diagnoses) {
        await prisma.diagnosisAnalytics.upsert({
          where: {
            date_diagnosisName: {
              date,
              diagnosisName: diagnosis,
            },
          },
          create: {
            date,
            diagnosisName: diagnosis,
            count: Math.floor(Math.random() * 15) + 3,
          },
          update: {
            count: Math.floor(Math.random() * 15) + 3,
          },
        });
      }
    }

    console.log('✓ Analytics data seeded successfully!');
  } catch (error) {
    console.error('Error seeding analytics data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAnalyticsData()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
