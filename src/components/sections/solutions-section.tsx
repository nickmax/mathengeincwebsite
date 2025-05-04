import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Palette, CodeXml, CloudCog, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Link

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
    icon: TerminalSquare,
    tag: "Tailored Precision",
  },
];

export function SolutionsSection() {
  return (
    // Use secondary background (#1A1A1A in dark mode)
    <section id="solutions" className="w-full py-16 md:py-24 lg:py-32 bg-secondary relative overflow-hidden">
        {/* Optional: Add subtle background effects here (e.g., gradient pulses, lines) */}
        {/* <div className="absolute inset-0 -z-10 opacity-10 animate-pulse">
             Add animated SVG or gradient elements
        </div> */}

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Solutions</h2>
          {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
             Elevate your digital presence with solutions designed for scale, beauty, and performance.
          </p>
        </div>
        {/* Use glass cards with glow effect */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"> {/* Adjusted grid columns */}
          {solutions.map((solution) => (
            <Card key={solution.title} className={cn(
                "flex flex-col text-center items-center",
                "glass-card-glow" // Apply the glow hover effect class
                 )}>
              <CardHeader className="pb-4 items-center">
                 {/* Icon Styling */}
                 <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                   <solution.icon className="h-8 w-8 text-primary" />
                 </div>
                 {/* Card Title: Bold, tracking-wide */}
                <CardTitle className="text-lg">{solution.title}</CardTitle> {/* Slightly smaller title */}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                {/* Card Description: Muted color, normal weight */}
                <CardDescription className="text-center font-normal text-sm mb-4"> {/* Smaller description */}
                    {solution.description}
                </CardDescription>
                {/* Tag using Badge */}
                 <Badge variant="secondary" className="mt-auto mx-auto">{solution.tag}</Badge>
              </CardContent>
               {/* Optional CTA per service */}
               {/* <CardFooter>
                 <Button variant="outline" size="sm" className="w-full mt-4 text-xs">Learn More</Button>
               </CardFooter> */}
            </Card>
          ))}
        </div>

        {/* Optional CTA Bar */}
        <div className="mt-20 md:mt-28 lg:mt-32">
            <div className={cn(
                "glass-card", // Basic glass effect
                "text-center",
                "relative overflow-hidden", // For potential gradient overlay
                "border-primary/30", // Subtle primary border
                "shadow-lg shadow-primary/10" // Subtle primary shadow
                )}>
                 {/* Optional: Add gradient overlay */}
                 {/* <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div> */}
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
