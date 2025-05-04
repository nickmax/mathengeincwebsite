

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Zap, Settings, ListTree, Palette, Mail } from "lucide-react"; // Example icons

const features = [
  {
    title: "Effortless Setup",
    description: "Launch your car dealership website in minutes—no technical skills needed.",
    icon: Settings,
    tag: "Fast Setup",
  },
  {
    title: "Value for Money",
    description: "Skip the costly dev work. Get all essential features at a fraction of the cost.",
    icon: Zap, // Using Zap for value/speed
    tag: "Affordable",
  },
  {
    title: "Inventory Control",
    description: "Add, update, or remove cars in a few clicks—manage your listings with ease.",
    icon: ListTree,
    tag: "Easy Management",
  },
  {
    title: "Stunning Design",
    description: "Templates tailored for car sales. Clean, modern, and conversion-optimized.",
    icon: Palette,
    tag: "Beautiful UI",
  },
];

export function Magari360Section() {
  return (
    // Use primary background for consistency
    <section id="magari360" className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
       {/* Optional: Subtle background gradient/effects */}
       {/* <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background to-secondary opacity-50"></div> */}

      <div className="container px-4 md:px-6">
        {/* Header Zone */}
        <div className={cn(
            "product-hero mb-16 md:mb-24 text-center",
            "glass-card", // Apply base glass effect
            "border-primary/20 shadow-lg shadow-primary/10" // Subtle primary border and shadow
            )}>
          <h2 className="text-3xl font-bold tracking-wide sm:text-4xl lg:text-5xl mb-4">
             MAGARI360 — Built by <span className="text-primary">MATHENGE inc.</span>
          </h2>
           {/* Subtitle with Japanese arrow */}
          <p className="text-xl text-muted-foreground mb-2 font-semibold">川 Want to Sell Cars Online?</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 font-normal">
            Selling cars online has never been easier. With Magari360, car dealerships can launch sleek online showrooms and start connecting with customers — instantly.
          </p>
          {/* Primary CTA button */}
          <Button asChild size="lg" className="font-semibold btn-primary-gradient">
            <Link href="/products/magari360">Learn More about Magari360</Link>
          </Button>
        </div>

        {/* Key Features Grid */}
        <div className="features-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16 md:mb-24">
          {features.map((feature) => (
            <Card key={feature.title} className={cn(
                "feature flex flex-col text-center items-center",
                "glass-card-glow" // Add glow effect on hover
                 )}>
              <CardHeader className="pb-4 items-center">
                 <div className="mb-4 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                   <feature.icon className="h-7 w-7 text-primary" />
                 </div>
                 {/* Feature Title */}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                 {/* Feature Description */}
                <p className="text-muted-foreground font-normal text-sm mb-4">
                    {feature.description}
                </p>
                 {/* Tag (Optional) */}
                 {/* <Badge variant="secondary" className="mt-auto mx-auto text-xs">{feature.tag}</Badge> */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Callout Banner */}
        <div className={cn(
            "callout-glass mb-16 md:mb-24 p-8 md:p-12 text-center",
            "glass-card", // Base glass
            "border-primary/30" // Slightly stronger primary border
            )}>
          <h3 className="text-2xl font-bold tracking-wide mb-3">Tailor your experience and take your car business to the next level.</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto font-normal">Discover a world of options that await you with Magari360.</p>
          {/* CTA Group - using Button components styled as links */}
           <div className="cta-group flex flex-col sm:flex-row justify-center gap-4 mb-6">
             {/* Example links - replace #explore and #sell with actual URLs if needed */}
             <Button asChild variant="link" className="text-primary hover:text-primary/80 font-semibold text-base p-0">
                <Link href="#">EXPLORE VEHICLES →</Link>
             </Button>
             <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary font-semibold text-base">
                <Link href="#">SELL YOUR CAR →</Link>
             </Button>
           </div>
          <small className="text-xs text-muted-foreground/70 font-normal block">
            *We do not own the cars displayed on the website. All listings are for demo purposes only.
          </small>
        </div>

        {/* Floating Footer CTA */}
        <footer className={cn(
            "footer-cta p-6 text-center",
            "glass-card", // Base glass
            "border-white/10" // Subtle border
            )}>
          <p className="text-lg text-foreground mb-2 font-normal">We blend beautiful, modern designs with clean, efficient code.</p>
          <p className="text-muted-foreground mb-4 font-normal">Let’s build a site that performs as well as it looks.</p>
          <a href="mailto:info@mathengeinc.com" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
            <Mail className="h-5 w-5" />
            info@mathengeinc.com
          </a>
        </footer>
      </div>
    </section>
  );
}

