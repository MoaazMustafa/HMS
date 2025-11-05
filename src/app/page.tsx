import type { Metadata } from 'next';

import { ContactSection } from '@/components/sections/contact-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { Footer } from '@/components/sections/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { ModulesSection } from '@/components/sections/modules-section';
import { StatsSection } from '@/components/sections/stats-section';
import { FloatingNav } from '@/components/ui/floating-nav';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  return (
    <div className="relative overflow-hidden">
      <FloatingNav />
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
