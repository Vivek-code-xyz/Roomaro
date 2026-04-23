'use client';

import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default function Page() {
  return (
    <div className="landing-shell h-screen overflow-hidden text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="relative h-full overflow-y-auto no-scrollbar pt-16">
        <HeroSection />
        <ValueStrip />
        <FeatureGrid />
        <HowItWorks />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
        <SiteFooter />
      </main>
    </div>
  );
}

