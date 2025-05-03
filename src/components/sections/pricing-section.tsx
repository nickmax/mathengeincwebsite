import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    title: "Basic",
    price: "$49",
    frequency: "/month",
    description: "Ideal for individuals and small teams getting started.",
    features: [
      "Core Feature 1",
      "Core Feature 2",
      "Limited Support",
      "Basic Analytics", // Added feature
    ],
    cta: "Get Started",
    link: "#contact", // Link to contact
  },
  {
    title: "Pro",
    price: "$99",
    frequency: "/month",
    description: "Perfect for growing businesses needing more power.",
    features: [
      "All Basic Features",
      "Advanced Feature A",
      "Advanced Feature B",
      "Priority Support",
      "Enhanced Analytics", // Added feature
    ],
    cta: "Choose Pro",
    popular: true, // Mark as popular for neon badge
    link: "#contact", // Link to contact
  },
  {
    title: "Enterprise",
    price: "Custom",
    frequency: "",
    description: "Tailored solutions for large organizations.",
    features: [
      "All Pro Features",
      "Dedicated Account Manager",
      "Custom Integrations",
      "24/7 Premium Support",
      "Bespoke Development", // Added feature
    ],
    cta: "Contact Sales",
    link: "#contact", // Link to contact
  },
];

export function PricingSection() {
  return (
    // Use primary background
    <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
           {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Pricing Plans</h2>
           {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Choose the plan that best fits your needs. Simple, transparent pricing.
          </p>
        </div>
        {/* Glass cards with optional glow and conditional primary border */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.title} className={cn(
                "flex flex-col",
                "glass-card-glow", // Add glow effect
                plan.popular ? 'border-primary ring-2 ring-primary/50' : 'border-white/10' // Highlight popular plan
                 )}>
              <CardHeader className="pb-4 items-center text-center"> {/* Center align header */}
                {plan.popular && (
                  // Use Neon Badge for popular plan
                  <Badge variant="neon" className="mb-3">Most Popular</Badge>
                )}
                 {/* Title: Bold, tracking-wide */}
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                 {/* Description: Muted, normal */}
                <CardDescription className="pt-2 font-normal">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-8"> {/* Increased spacing */}
                   {/* Price: Bold, large */}
                  <div className="text-4xl font-bold text-center mb-4 text-foreground">
                    {plan.price}
                    {plan.frequency && <span className="text-lg font-normal text-muted-foreground">{plan.frequency}</span>}
                  </div>
                   {/* Features: Muted, normal */}
                  <ul className="space-y-3 text-sm text-muted-foreground font-normal">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                 {/* Button: Primary gradient for popular, outline (glassy) otherwise */}
                <Button
                  className="w-full mt-auto font-semibold"
                  variant={plan.popular ? 'default' : 'outline'} // 'default' uses the gradient
                  asChild
                  >
                    <a href={plan.link}>{plan.cta}</a>
                </Button>
              </CardContent>
               {/* No separate CardFooter needed */}
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-10 text-sm font-normal">
          Need a custom solution? <a href="/#contact" className="text-primary underline hover:text-primary/80 font-semibold">Contact us</a> for enterprise options.
        </p>
      </div>
    </section>
  );
}
