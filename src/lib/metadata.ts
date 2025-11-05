import type { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hms-health.vercel.app';
const defaultOgImage = `${baseUrl}/img/og-default.png`;

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage = defaultOgImage,
  canonical,
  noIndex = false,
}: PageMetadata): Metadata {
  const fullTitle = title.includes('HMS')
    ? title
    : `${title} | HMS - Health Management System`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: [{ name: 'HMS Development Team' }],
    creator: 'HMS',
    publisher: 'HMS',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      title: fullTitle,
      description,
      siteName: 'HMS - Health Management System',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@HMS_Health',
    },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
  };
}

export const defaultMetadata: Metadata = generatePageMetadata({
  title: 'HMS - Digital Healthcare Platform',
  description: 'Comprehensive Health Management System for managing patient information, prescriptions, appointments, and medical records efficiently.',
  keywords: [
    'Health Management System',
    'HMS',
    'Healthcare Platform',
    'Patient Management',
    'Prescription Management',
    'Appointment Scheduling',
    'Medical Records',
    'Electronic Health Records',
    'EHR',
    'Digital Healthcare',
    'Healthcare Software',
    'Medical Practice Management',
    'Telemedicine',
    'Health Tech',
  ],
  canonical: '/',
});

// Reusable metadata for common pages
export const pageMetadata = {
  home: generatePageMetadata({
    title: 'HMS - Health Management System',
    description:
      'Transform your healthcare practice with HMS - a comprehensive digital platform for managing patients, prescriptions, appointments, and medical records. Secure, efficient, and HIPAA-compliant.',
    keywords: [
      'Health Management System',
      'HMS',
      'Healthcare Platform',
      'Patient Management',
      'Prescription Management',
      'Appointment Scheduling',
      'Medical Records',
      'Electronic Health Records',
      'EHR System',
      'Digital Healthcare',
      'Healthcare Software',
      'Medical Practice Management',
      'Doctor Portal',
      'Patient Portal',
      'Clinical Notes',
      'Lab Reports',
      'Vital Signs Tracking',
      'Medical History',
      'HIPAA Compliant',
      'Healthcare Technology',
    ],
    canonical: '/',
  }),
  
  patients: generatePageMetadata({
    title: 'Patient Management',
    description: 'Efficiently manage patient information, registrations, and profiles with our comprehensive patient management system.',
    keywords: ['Patient Management', 'Patient Registration', 'Patient Portal', 'HMS'],
    canonical: '/patients',
  }),
  
  prescriptions: generatePageMetadata({
    title: 'Prescription Management',
    description: 'Create, manage, and track prescriptions with drug interaction checking and digital signature support.',
    keywords: ['Prescription Management', 'E-Prescription', 'Drug Database', 'HMS'],
    canonical: '/prescriptions',
  }),
  
  appointments: generatePageMetadata({
    title: 'Appointment Scheduling',
    description: 'Smart appointment scheduling system with automated reminders and calendar management.',
    keywords: ['Appointment Scheduling', 'Calendar Management', 'SMS Reminders', 'HMS'],
    canonical: '/appointments',
  }),
  
  records: generatePageMetadata({
    title: 'Medical Records',
    description: 'Comprehensive electronic health records system with clinical notes, diagnoses, and lab reports.',
    keywords: ['Medical Records', 'EHR', 'Clinical Notes', 'Lab Reports', 'HMS'],
    canonical: '/records',
  }),
};
