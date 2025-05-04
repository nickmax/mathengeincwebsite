

import { HeroSection } from '@/components/sections/hero-section';
import { SolutionsSection } from '@/components/sections/solutions-section';
import { Magari360Section } from '@/components/sections/magari360-section'; // Added Magari360Section import
import { TrustedBySection } from '@/components/sections/trusted-by-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SolutionsSection />
      <Magari360Section /> {/* Added Magari360Section component usage */}
      <TrustedBySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

