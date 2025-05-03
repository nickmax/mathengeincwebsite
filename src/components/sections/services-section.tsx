import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, BarChart2 } from "lucide-react"; // Changed icon for Market Analysis

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
    title: "Team Development",
    description: "Empower your workforce with targeted training and development programs.",
    icon: Users,
  },
   {
    title: "Market Analysis",
    description: "Gain deep insights into your market landscape, identify opportunities, and mitigate risks.",
    icon: BarChart2, // Changed icon to BarChart2
  },
];

export function ServicesSection() {
  return (
    // Use secondary background for contrast in dark mode
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          {/* Apply font-sans to heading */}
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-sans">Our Services</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We offer a range of services designed to address your key business challenges and drive results.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            // Cards will use card background defined in theme
            <Card key={service.title} className="flex flex-col">
              <CardHeader className="pb-4">
                 <div className="mb-4 flex justify-center">
                   <service.icon className="h-10 w-10 text-primary" />
                 </div>
                 {/* Apply font-sans to card title */}
                <CardTitle className="text-xl text-center font-sans">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-center">{service.description}</CardDescription>
              </CardContent>
               {/* Optional CTA per service */}
               {/* <CardFooter>
                 <Button variant="outline" className="w-full">Learn More</Button>
               </CardFooter> */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
