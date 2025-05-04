

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Car } from "lucide-react"; // Icon for Magari360

export default function ProductsPage() {
  return (
    <section id="products" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h1 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Products</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Explore the innovative solutions built by Mathenge Inc.
          </p>
        </div>

        {/* Grid for Product Cards */}
        {/* Centering the grid content when there's only one item */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">

          {/* Magari360 Product Card */}
          <Card className={cn(
                "flex flex-col text-center items-center",
                "glass-card-glow" // Apply glow effect
                // Removed md:col-start-2 to allow normal grid flow if more items are added
              )}>
            <CardHeader className="pb-4 items-center">
              <div className="mb-5 p-3 bg-primary/10 rounded-full inline-flex border border-primary/30">
                <Car className="h-8 w-8 text-primary" /> {/* Magari360 Icon */}
              </div>
              <CardTitle className="text-xl">Magari360</CardTitle>
              <CardDescription className="text-center font-normal text-sm pt-1">
                The Easiest Way to Sell Cars Online.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-muted-foreground font-normal text-sm mb-6">
                Launch a sleek online showroom for your car dealership instantly. Effortless setup, powerful features.
              </p>
            </CardContent>
            <CardFooter className="w-full">
              <Button asChild variant="outline" className="w-full font-semibold">
                 <Link href="/products/magari360">Learn More</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Add more product cards here as needed */}
          {/* Example Placeholder:
          <Card className={cn("flex flex-col text-center items-center glass-card-glow")}>
             <CardHeader>...</CardHeader>
             <CardContent>...</CardContent>
             <CardFooter>...</CardFooter>
          </Card>
          */}

        </div>
      </div>
    </section>
  );
}
