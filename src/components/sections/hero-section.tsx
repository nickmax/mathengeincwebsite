import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    // Use background instead of secondary for the main hero section in dark mode
    <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
           <Image
            src="https://picsum.photos/600/400"
            alt="Hero Image"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
            data-ai-hint="professional business meeting"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              {/* Apply font-sans to heading */}
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-sans">
                Unlock Your Business Potential with Mathenge Inc.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                We provide expert consulting and services tailored to help your business thrive in today&apos;s competitive landscape.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/#contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                 <Link href="/#services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
