
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';
import { useMemo } from "react";

// Define pricingPlans array outside the component if it's static
const staticPricingPlans = [
  {
    title: "Basic",
    price: "$49",
    frequency: "/month",
    description: "Ideal for individuals and small teams getting started.",
    features: [
      "Core Feature 1",
      "Core Feature 2",
      "Limited Support",
      "Basic Analytics",
    ],
    cta: "Get Started",
    link: "/#contact",
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
      "Enhanced Analytics",
    ],
    cta: "Choose Pro",
    popular: true,
    link: "/#contact",
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
      "Bespoke Development",
    ],
    cta: "Contact Sales",
    link: "/#contact",
  },
];

export function PricingSection() {
    // Memoize the pricing plans data
    const pricingPlans = useMemo(() => staticPricingPlans, []);

  return (
    <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Pricing Plans</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Choose the plan that best fits your needs. Simple, transparent pricing.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <ScrollHighlightCard key={plan.title} threshold={0.3}>
              <Card className={cn(
                  "flex flex-col h-full",
                  "glass-card-glow",
                  plan.popular ? 'border-primary' : 'border-white/10'
                   )}>
                <CardHeader className="pb-4 items-center text-center">
                  {plan.popular && (
                    <Badge variant="neon" className="mb-3">Most Popular</Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.title}</CardTitle>
                  <CardDescription className="pt-2 font-normal">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-8">
                    <div className="text-4xl font-bold text-center mb-4 text-foreground">
                      {plan.price}
                      {plan.frequency && <span className="text-lg font-normal text-muted-foreground">{plan.frequency}</span>}
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground font-normal">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check aria-hidden="true" className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Ensure no extra whitespace/comments between Button and Link */}
                   <Button
                    className={cn("w-full mt-auto font-semibold", plan.popular && "btn-primary-gradient")}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                    ><Link href={plan.link}>{plan.cta}</Link></Button>
                </CardContent>
              </Card>
            </ScrollHighlightCard>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-10 text-sm font-normal">
          Need a custom solution? <Link href="/#contact" className="text-primary underline hover:text-primary/80 font-semibold">Contact us</Link> for enterprise options.
        </p>
      </div>
    </section>
  );
}
