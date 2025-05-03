import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react'; // Use a different icon

const products = [
  {
    title: "Product Alpha",
    description: "Our flagship product designed to revolutionize your workflow and boost productivity.",
    image: "https://picsum.photos/400/300?random=10",
    aiHint: "modern software interface dashboard",
    features: [
      "Intuitive User Interface",
      "Powerful Analytics",
      "Seamless Integration",
      "24/7 Support",
    ],
    link: "/products/alpha", // Keep example link for now
  },
  {
    title: "Service Beta Package",
    description: "A comprehensive service package offering expert guidance and tailored solutions.",
    image: "https://picsum.photos/400/300?random=11",
    aiHint: "team collaborating strategy",
    features: [
      "Strategic Planning Session",
      "Monthly Performance Review",
      "Dedicated Consultant",
      "Custom Reporting",
    ],
    link: "/products/beta", // Keep example link
  },
  {
    title: "Gamma Tool Suite",
    description: "A collection of essential tools to streamline specific business processes.",
    image: "https://picsum.photos/400/300?random=12",
    aiHint: "digital tools connected network",
    features: [
      "Automation Capabilities",
      "Data Visualization",
      "Task Management",
      "Cloud-Based Access",
    ],
    link: "/products/gamma", // Keep example link
  },
];

export function ProductsSection() {
  return (
    // Use secondary background
    <section id="products" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Products & Services</h2>
          {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Explore our offerings designed to empower your business and drive growth.
          </p>
        </div>
        {/* Glass cards with glow */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.title} className={cn(
                "flex flex-col overflow-hidden",
                "glass-card-glow" // Add glow effect
                 )}>
              {/* Remove CardHeader for image, image directly in Card */}
               <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={225} // Adjust height for a better aspect ratio (16:9)
                className="w-full h-48 object-cover" // Keep object-cover
                data-ai-hint={product.aiHint}
               />
              <CardContent className="p-6 flex-1 flex flex-col">
                 {/* Card Title: Bold, tracking-wide */}
                <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                 {/* Description: Muted color, normal weight, grow */}
                <CardDescription className="mb-5 flex-grow font-normal">{product.description}</CardDescription>
                 {/* Features list: Muted color, normal weight, use CheckCircle */}
                <ul className="space-y-2 text-sm text-muted-foreground mb-6 font-normal">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center">
                       <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0"/>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
               <CardFooter className="p-6 pt-0 mt-auto">
                  {/* Button: Outline (glassy) style */}
                 <Button asChild variant="outline" className="w-full font-semibold">
                   {/* Update Link if specific product pages exist */}
                   <Link href="#">Learn More</Link>
                 </Button>
               </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
