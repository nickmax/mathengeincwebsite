import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/hero-section';
import { SolutionsSection } from '@/components/sections/solutions-section';
import { TrustedBySection } from '@/components/sections/trusted-by-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';

// Specific metadata for the Home page
export const metadata: Metadata = {
  title: 'Mathenge Inc. - Innovative Digital Solutions', // Explicit title for home
  description: 'Explore innovative solutions from Mathenge Inc., including expert consulting, SaaS platforms like Magari360, and custom software development to unlock your business potential.',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SolutionsSection />
      {/* Removed Magari360Section component usage */}
      <TrustedBySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
