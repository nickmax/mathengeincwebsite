

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TestimonialsSection } from "@/components/sections/testimonials-section"; // Optional: Reuse if needed
import { CheckCircle, Cog, LayoutDashboard, Palette, Users } from "lucide-react"; // Example icons

const features = [
  {
    title: "Live Inventory Management",
    description: "Add, remove, and update listings in seconds.",
    icon: LayoutDashboard,
    screenshotHint: "dashboard inventory management",
  },
  {
    title: "Custom Dealer Branding",
    description: "Apply your colors, logo, and identity with ease.",
    icon: Palette,
    screenshotHint: "website customization branding",
  },
  {
    title: "Integrated Contact & Booking",
    description: "Capture leads straight from the car page.",
    icon: Users,
    screenshotHint: "contact form lead capture",
  },
  {
    title: "Analytics Dashboard",
    description: "Know what’s working. See sales insights instantly.",
    icon: Cog, // Using Cog as a placeholder for analytics/settings
    screenshotHint: "analytics dashboard charts",
  },
];


export default function Magari360Page() {
  return (
    <>
      {/* 1. Hero Section */}
      <section id="hero" className="w-full py-24 md:py-32 lg:py-40 xl:py-56 relative overflow-hidden bg-background">
        {/* Optional Background Visual */}
        {/* <Image src="https://picsum.photos/1920/1080?grayscale" layout="fill" objectFit="cover" alt="Abstract background" className="absolute inset-0 -z-10 opacity-10 blur-sm" data-ai-hint="abstract futuristic background" /> */}
         <div className={cn(
             "absolute inset-0 -z-10",
             "bg-background/80 backdrop-blur-xl" // Glassy overlay effect
             )}></div>

        <div className="container px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none mb-4 relative inline-block">
            Magari360
            {/* Glowing underline */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_2px_15px_hsl(var(--primary))] animate-pulse"></span>
          </h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl font-normal mb-8">
            Transform the way you sell cars online with a fully customizable AutoCommerce platform.
          </p>
          {/* Use demo placeholder link */}
          <Button asChild size="lg" className="font-semibold btn-primary-gradient">
            <Link href="#demo">View Live Demo →</Link>
          </Button>
        </div>
      </section>

      {/* 2. The Story: Why Magari360? */}
      <section id="story" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">Why Magari360?</h2>
              <p className="text-muted-foreground font-normal text-lg leading-relaxed">
                Built exclusively for car dealerships, Magari360 offers modular features designed to seamlessly fit your unique sales process. Forget complex setups and expensive development – simply plug in your brand, manage your inventory, and start selling.
              </p>
              <p className="text-foreground font-semibold italic">
                 “From inventory control to lead generation — everything is designed around you.”
              </p>
              <Button asChild variant="outline" className="font-semibold">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
            {/* Animated Screenshot Placeholder */}
            <div className="relative aspect-video rounded-[var(--radius)] overflow-hidden glass-card border border-primary/20 shadow-lg shadow-primary/10">
               <Image
                 src="https://picsum.photos/800/450"
                 alt="Magari360 Interface Screenshot"
                 width={800}
                 height={450}
                 className="object-cover w-full h-full"
                 data-ai-hint="software dashboard interface screenshot"
               />
               {/* Optional: Add subtle animation/glow */}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Showcases */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
            <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">What’s Inside</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed font-normal">
              Packed with powerful tools designed for dealerships.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className={cn("flex flex-col glass-card-glow")}>
                <CardHeader className="items-center text-center pb-4">
                  {/* Icon */}
                  <div className="mb-4 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between items-center text-center">
                  {/* Screenshot Placeholder */}
                  <div className="relative w-full aspect-video mb-4 rounded-md overflow-hidden border border-white/10">
                    <Image
                      src={`https://picsum.photos/400/225?random=${Math.random()}`} // Random image for demo
                      alt={`${feature.title} Screenshot`}
                      width={400}
                      height={225}
                      className="object-cover"
                      data-ai-hint={feature.screenshotHint}
                    />
                  </div>
                  <p className="text-muted-foreground font-normal text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Customizability Section */}
      <section id="customizability" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Placeholder for interactive elements/visuals */}
             <div className="relative aspect-square rounded-[var(--radius)] overflow-hidden glass-card border border-primary/20 shadow-lg shadow-primary/10 flex items-center justify-center">
               <Palette className="h-24 w-24 text-primary opacity-50" />
                <span className="absolute text-center font-semibold text-foreground p-4">
                    Visual Placeholder for Customization Options (Tabs/Toggles)
                </span>
             </div>
             <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">Make It Yours</h2>
              <p className="text-muted-foreground font-normal text-lg leading-relaxed">
                 Magari360 bends to your business — not the other way around. Easily adapt the platform with your brand colors, logo, layout preferences, and regional settings like currency and location.
              </p>
              <p className="text-foreground font-semibold italic">
                 Whether you’re selling 10 or 10,000 cars, your platform scales and looks just how you want it.
              </p>
              <ul className="space-y-2 text-muted-foreground font-normal">
                 <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-primary"/> Brand Colors & Logo</li>
                 <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-primary"/> Customizable Home Layouts</li>
                 <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-primary"/> Advanced Filter Options</li>
                 <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-primary"/> Currency & Location Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* 5. Live Demo CTA Section */}
       <section id="demo" className="w-full py-20 md:py-28 lg:py-36 relative bg-background">
           <div className={cn(
             "absolute inset-0 -z-10",
             "bg-background/70 backdrop-blur-md" // Glassy overlay
             )}></div>
           <div className="container px-4 md:px-6 text-center relative z-10">
               <h2 className="text-3xl font-bold tracking-wide sm:text-4xl mb-4">Want to See It in Action?</h2>
               <p className="max-w-[600px] mx-auto text-muted-foreground md:text-lg font-normal mb-8">
                   Click below to explore our interactive demo — no signup needed. Experience the ease of Magari360 firsthand.
               </p>
               {/* Update link when demo is available */}
               <Button asChild size="lg" className="font-semibold btn-primary-gradient shadow-[0_0_24px_hsl(var(--primary)/0.6)]">
                   <Link href="#" target="_blank" rel="noopener noreferrer">Launch Demo →</Link>
               </Button>
           </div>
       </section>

      {/* Optional: 6. Testimonials Section - Reuse the existing component */}
      {/* <TestimonialsSection /> */}

      {/* 7. Final CTA */}
      <section id="final-cta" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className={cn(
              "glass-card text-center relative overflow-hidden p-8 md:p-12",
              "border-primary/40 ring-2 ring-primary/20 shadow-xl shadow-primary/15" // Enhanced border/glow
              )}>
              {/* Animated border pulse effect */}
              <div className="absolute inset-0 border-2 border-primary rounded-[var(--radius)] animate-pulse opacity-30 pointer-events-none"></div>

            <h3 className="text-2xl font-bold tracking-wide mb-4 sm:text-3xl">Ready to Elevate Your Dealership?</h3>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8 font-normal">
              Your customers are already online. Isn’t it time your showroom was too? Take control of your online presence with Magari360.
            </p>
            <Button asChild size="lg" className="font-semibold btn-primary-gradient">
              <Link href="/#contact">Let’s Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

