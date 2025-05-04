
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Palette, CodeXml, CloudCog, SquareTerminal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';
import { useMemo } from "react";

// Define solutions array outside the component if it's static
const staticSolutions = [
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
    // Memoize the solutions data
    const solutions = useMemo(() => staticSolutions, []);

  return (
    <section id="solutions" className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Solutions</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
             Elevate your digital presence with solutions designed for scale, beauty, and performance. Explore our SaaS offerings too!
          </p>
           {/* Ensure no extra whitespace/comments between Button and Link */}
           <Button asChild variant="link" className="text-primary hover:text-primary/80 font-semibold text-lg mt-2"><Link href="/products">Explore Our Products →</Link></Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {solutions.map((solution) => (
            <ScrollHighlightCard key={solution.title} threshold={0.3}>
              <Card className={cn(
                  "flex flex-col text-center items-center h-full", // Added h-full for consistent height
                  "glass-card-glow"
                   )}>
                <CardHeader className="pb-4 items-center">
                   <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                     <solution.icon aria-hidden="true" className="h-8 w-8 text-primary" />
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
            </ScrollHighlightCard>
          ))}
        </div>

        {/* Optional CTA Bar */}
        <div className="mt-20 md:mt-28 lg:mt-32">
          <ScrollHighlightCard threshold={0.5}>
            <div className={cn(
                "glass-card",
                "text-center",
                "relative overflow-hidden",
                "border-primary/30",
                "shadow-lg shadow-primary/10"
                )}>
                <h3 className="text-2xl font-bold tracking-wide mb-3">Don’t see what you need?</h3>
                <p className="text-muted-foreground mb-6 font-normal">Let’s collaborate on something extraordinary.</p>
                 {/* Ensure no extra whitespace/comments between Button and Link */}
                 <Button asChild size="lg" className="font-semibold btn-primary-gradient"><Link href="/#contact">Start a Custom Project</Link></Button>
            </div>
          </ScrollHighlightCard>
        </div>

      </div>
    </section>
  );
}
