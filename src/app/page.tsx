import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { TrustedBySection } from '@/components/sections/trusted-by-section'; // Import the new section
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TrustedBySection /> {/* Add the new section here */}
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
