import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    // Use deep charcoal background for dark mode, spacious padding
    <section id="home" className="w-full py-24 md:py-32 lg:py-48 xl:py-64 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_550px]">
           {/* Image with potential subtle glass border or shadow */}
           <div className="relative">
             <Image
              src="https://picsum.photos/600/400"
              alt="Hero Image"
              width={600}
              height={600} // Make it square for lg:aspect-square
              className="mx-auto aspect-video overflow-hidden rounded-[var(--radius)] object-cover sm:w-full lg:aspect-square shadow-2xl border border-white/5" // Use theme radius, stronger shadow, subtle border
              data-ai-hint="professional business meeting abstract"
            />
            {/* Optional: Add a subtle glow effect behind the image */}
            {/* <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full -z-10 animate-pulse"></div> */}
           </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              {/* Header: Bold, tracking-wide */}
              <h1 className="text-4xl font-bold tracking-wide sm:text-5xl xl:text-6xl/none">
                Unlock Your Business Potential with Mathenge Inc.
              </h1>
              {/* Body text: Normal weight, muted color */}
              <p className="max-w-[600px] text-muted-foreground md:text-xl font-normal">
                We provide expert consulting and services tailored to help your business thrive in today&apos;s competitive landscape.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              {/* Primary button with gradient */}
              <Button asChild size="lg" className="font-semibold">
                <Link href="/#contact">Get in Touch</Link>
              </Button>
              {/* Secondary/Outline button with glass effect */}
              <Button asChild variant="outline" size="lg" className="font-semibold">
                 <Link href="/#services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
