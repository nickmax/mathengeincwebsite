import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const products = [
  {
    title: "Product Alpha",
    description: "Our flagship product designed to revolutionize your workflow and boost productivity.",
    image: "https://picsum.photos/400/300?random=10",
    aiHint: "modern software interface",
    features: [
      "Intuitive User Interface",
      "Powerful Analytics",
      "Seamless Integration",
      "24/7 Support",
    ],
    link: "/products/alpha",
  },
  {
    title: "Service Beta Package",
    description: "A comprehensive service package offering expert guidance and tailored solutions.",
    image: "https://picsum.photos/400/300?random=11",
    aiHint: "team collaborating chart",
    features: [
      "Strategic Planning Session",
      "Monthly Performance Review",
      "Dedicated Consultant",
      "Custom Reporting",
    ],
    link: "/products/beta",
  },
  {
    title: "Gamma Tool Suite",
    description: "A collection of essential tools to streamline specific business processes.",
    image: "https://picsum.photos/400/300?random=12",
    aiHint: "digital tools dashboard",
    features: [
      "Automation Capabilities",
      "Data Visualization",
      "Task Management",
      "Cloud-Based Access",
    ],
    link: "/products/gamma",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-sans">Our Products & Services</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Explore our offerings designed to empower your business and drive growth.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.title} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                 <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  data-ai-hint={product.aiHint}
                 />
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <CardTitle className="text-xl font-sans mb-2">{product.title}</CardTitle>
                <CardDescription className="mb-4 flex-grow">{product.description}</CardDescription>
                <ul className="space-y-1 text-sm text-muted-foreground mb-6">
                  {product.features.slice(0, 3).map((feature) => ( // Show top 3 features
                    <li key={feature} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary flex-shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
               <CardFooter className="p-6 pt-0 mt-auto">
                 <Button asChild variant="outline" className="w-full">
                   <Link href={product.link}>Learn More</Link>
                 </Button>
               </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
