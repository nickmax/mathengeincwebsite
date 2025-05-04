import { HeroSection } from '@/components/sections/hero-section';
import { SolutionsSection } from '@/components/sections/solutions-section'; // Changed import
import { TrustedBySection } from '@/components/sections/trusted-by-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SolutionsSection /> {/* Changed usage */}
      <TrustedBySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
