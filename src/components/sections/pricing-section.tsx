import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    ],
    cta: "Get Started",
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
    ],
    cta: "Choose Pro",
    popular: true,
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
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-sans">Our Pricing Plans</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose the plan that best fits your needs. Simple, transparent pricing.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.title} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
              <CardHeader className="pb-4">
                {plan.popular && (
                  <div className="text-sm font-semibold text-primary text-center mb-2">Most Popular</div>
                )}
                <CardTitle className="text-2xl text-center font-sans">{plan.title}</CardTitle>
                <CardDescription className="text-center pt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-center mb-2">
                    {plan.price}
                    {plan.frequency && <span className="text-lg font-normal text-muted-foreground">{plan.frequency}</span>}
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full mt-auto" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </CardContent>
               {/* <CardFooter> Removed redundant button */}
               {/* </CardFooter> */}
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-8 text-sm">
          Need a custom solution? <a href="/#contact" className="text-primary underline">Contact us</a> for enterprise options.
        </p>
      </div>
    </section>
  );
}
