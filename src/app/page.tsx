import type { Metadata } from 'next';

import { CoreModulesSection } from '@/components/sections/core-modules-section';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/sections/footer';
import { HeroNew } from '@/components/sections/hero-new';
import { SecurityPerformanceSection } from '@/components/sections/security-performance-section';
import { UserRolesSection } from '@/components/sections/user-roles-section';
import { FloatingNav } from '@/components/ui/floating-nav';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata.home;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  return (
    <div className="relative overflow-hidden">
      <FloatingNav />
      <HeroNew />
      <CoreModulesSection />
      <UserRolesSection />
      <SecurityPerformanceSection />
      <CTASection />
      <Footer />
    </div>
  );
}
