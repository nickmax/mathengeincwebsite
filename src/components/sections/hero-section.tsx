
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section id="home" className="w-full py-24 md:py-32 lg:py-48 xl:py-64 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_550px]">
           <div className="relative">
             <Image
              src="https://picsum.photos/600/600"
              alt="Abstract image representing business potential and innovation"
              width={600}
              height={600}
              className={cn(
                  "mx-auto overflow-hidden rounded-[var(--radius)] object-cover sm:w-full shadow-2xl border border-white/5",
                  "aspect-video lg:aspect-square"
                )}
              data-ai-hint="professional business meeting abstract"
              priority
            />
           </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-wide sm:text-5xl xl:text-6xl/none">
                Unlock Your Business Potential with Mathenge Inc.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl font-normal">
                We provide expert consulting and services tailored to help your business thrive in today&apos;s competitive landscape.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              {/* Ensure no extra whitespace/comments between Button and Link */}
              <Button asChild size="lg" className="font-semibold btn-primary-gradient"><Link href="/#contact">Get in Touch</Link></Button>
              {/* Ensure no extra whitespace/comments between Button and Link */}
              <Button asChild variant="outline" size="lg" className="font-semibold"><Link href="/#solutions">Learn More</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
