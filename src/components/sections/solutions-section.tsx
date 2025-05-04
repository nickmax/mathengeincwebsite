
'use client'; // Ensure this is a client component

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Palette, CodeXml, CloudCog, SquareTerminal, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useScrollHighlight } from '@/hooks/use-scroll-highlight'; // Import the hook

const solutions = [
  {
    title: "Logo Design",
    description: "Crafting professional and unique logos to represent your brand identity.",
    icon: Pencil,
    tag: "Identity First",
  },
  {
    title: "Graphic Design",
    description: "Visually striking designs for marketing materials, branding, and digital content.",
    icon: Palette,
    tag: "Bold & Beautiful",
  },
  {
    title: "Website Design & Development",
    description: "Modern, responsive, and user-friendly websites tailored to your needs.",
    icon: CodeXml,
    tag: "Pixel-Perfect",
  },
  {
    title: "SaaS Solutions",
    description: "Scalable, cloud-based software platforms that grow with your business.",
    icon: CloudCog,
    tag: "Built for Scale",
  },
  {
    title: "Custom Software Development",
    description: "Fully tailored software solutions for unique business needs.",
    icon: SquareTerminal,
    tag: "Tailored Precision",
  },
];

export function SolutionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null); // Create a ref for the section container
  useScrollHighlight(sectionRef, '.solution-card', 'scroll-highlighted'); // Apply the hook

  return (
    <section id="solutions" ref={sectionRef} className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Optional: Add subtle background effects here */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Solutions</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
             Elevate your digital presence with solutions designed for scale, beauty, and performance.
          </p>
        </div>
        {/* Use glass cards with glow effect */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted grid columns for 5+1 */}
          {solutions.map((solution) => (
            <Card key={solution.title} className={cn(
                "flex flex-col text-center items-center",
                "solution-card" // Add a common class for selection by the hook
                // "glass-card-glow" // Keep or adjust hover glow as needed
                 )}>
              <CardHeader className="pb-4 items-center">
                 <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                   <solution.icon className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="text-lg">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <CardDescription className="text-center font-normal text-sm mb-4">
                    {solution.description}
                </CardDescription>
                 <Badge variant="secondary" className="mt-auto mx-auto">{solution.tag}</Badge>
              </CardContent>
            </Card>
          ))}

           {/* Magari360 Product Card */}
           <Card className={cn(
                "flex flex-col text-center items-center",
                "solution-card" // Also apply selector class here
                // "glass-card-glow"
              )}>
            <CardHeader className="pb-4 items-center">
              <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Magari360</CardTitle>
              <CardDescription className="text-center font-normal text-sm pt-1">
                Our Flagship AutoCommerce Platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-muted-foreground font-normal text-sm mb-6">
                Launch a sleek online showroom for your car dealership instantly. Effortless setup, powerful features.
              </p>
            </CardContent>
            <CardFooter className="w-full">
              <Button asChild variant="outline" className="w-full font-semibold">
                 <Link href="/products/magari360">Explore Magari360</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Optional CTA Bar */}
        <div className="mt-20 md:mt-28 lg:mt-32">
            <div className={cn(
                "glass-card",
                "text-center",
                "relative overflow-hidden",
                "border-primary/30",
                "shadow-lg shadow-primary/10"
                )}>
                <h3 className="text-2xl font-bold tracking-wide mb-3">Don’t see what you need?</h3>
                <p className="text-muted-foreground mb-6 font-normal">Let’s collaborate on something extraordinary.</p>
                 <Button asChild size="lg" className="font-semibold btn-primary-gradient">
                    <Link href="/#contact">Start a Custom Project</Link>
                 </Button>
            </div>
        </div>

      </div>
    </section>
  );
}
