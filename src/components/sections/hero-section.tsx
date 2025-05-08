
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TypewriterHeading } from '@/components/typewriter-heading'; // Import the new component

export function HeroSection() {
  const typewriterPhrases = [
    "Build Fast.",
    "Innovate Quickly.",
    "Scale Easily.",
    "Design Beautifully.",
  ];

  return (
    // Reduced py values significantly
    <section id="home" className="w-full py-16 md:py-20 lg:py-24 xl:py-32 bg-background flex justify-center">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
           <div className="relative flex justify-center lg:justify-start">
             <Image
              src="/undraw_business-plan_wv9q.svg" // Updated image source
              alt="Abstract image representing business potential and innovation"
              width={550}
              height={550}
              className={cn(
                  "mx-auto overflow-hidden rounded-[var(--radius)] object-cover sm:w-full shadow-2xl border border-white/5",
                  "aspect-square"
                )}
              data-ai-hint="business planning illustration" // Updated hint
              priority
            />
           </div>
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              {/* Replace static H1 with TypewriterHeading */}
              <h1 className="text-4xl font-bold tracking-wide sm:text-5xl xl:text-6xl/none">
                Unlock Your Business Potential:{' '}
                <TypewriterHeading phrases={typewriterPhrases} />
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl font-normal mx-auto lg:mx-0">
                We provide expert consulting and services tailored to help your business thrive in today&apos;s competitive landscape.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center lg:justify-start">
              <Button asChild size="lg" className="font-semibold btn-primary-gradient"><Link href="/#contact">Get in Touch</Link></Button>
              <Button asChild variant="outline" size="lg" className="font-semibold"><Link href="/#solutions">Learn More</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
