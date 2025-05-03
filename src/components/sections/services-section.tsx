import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, BarChart2, Zap } from "lucide-react"; // Added Zap icon
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Strategic Consulting",
    description: "Develop winning strategies to navigate market complexities and achieve sustainable growth.",
    icon: TrendingUp,
  },
  {
    title: "Operational Efficiency",
    description: "Streamline your processes, reduce costs, and improve overall business performance.",
    icon: Briefcase,
  },
  {
    title: "Digital Transformation", // Changed service
    description: "Leverage technology to innovate, automate, and future-proof your business operations.",
    icon: Zap, // Changed icon
  },
   {
    title: "Market Analysis",
    description: "Gain deep insights into your market landscape, identify opportunities, and mitigate risks.",
    icon: BarChart2,
  },
];

export function ServicesSection() {
  return (
    // Use secondary background (#1A1A1A in dark mode)
    <section id="services" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Services</h2>
          {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            We offer a range of services designed to address your key business challenges and drive results.
          </p>
        </div>
        {/* Use glass cards with optional glow effect */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className={cn(
                "flex flex-col text-center items-center",
                "glass-card-glow" // Apply the glow hover effect class
                 )}>
              <CardHeader className="pb-4 items-center">
                 <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                   <service.icon className="h-8 w-8 text-primary" />
                 </div>
                 {/* Card Title: Bold, tracking-wide */}
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                 {/* Card Description: Muted color, normal weight */}
                <CardDescription className="text-center font-normal">{service.description}</CardDescription>
              </CardContent>
               {/* Optional CTA per service */}
               {/* <CardFooter>
                 <Button variant="outline" className="w-full mt-4">Learn More</Button>
               </CardFooter> */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
