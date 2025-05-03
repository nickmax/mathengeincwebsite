import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users } from "lucide-react"; // Using minimalist icons

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
    icon: Users, // Placeholder, consider a 'BarChart' or similar if available/appropriate
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We offer a range of services designed to address your key business challenges and drive results.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col">
              <CardHeader className="pb-4">
                 <div className="mb-4 flex justify-center">
                   <service.icon className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="text-xl text-center">{service.title}</CardTitle>
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
