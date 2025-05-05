
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Zap, ListTree, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';
import { useMemo } from 'react';

// Define features array outside the component if it's static
const staticFeatures = [
  {
    title: "Effortless Setup",
    description: "Launch your website in minutes—no tech skills needed.",
    icon: Settings,
  },
  {
    title: "Value for Money",
    description: "Skip costly dev work. Get features at a fraction of the cost.",
    icon: Zap,
  },
  {
    title: "Inventory Control",
    description: "Add, update, or remove cars with ease.",
    icon: ListTree,
  },
  {
    title: "Stunning Design",
    description: "Templates tailored for car sales. Clean and modern.",
    icon: Palette,
  },
];


export function Magari360Section() {
    // Memoize the features data
    const features = useMemo(() => staticFeatures, []);

    return (
        <section id="magari360-home" className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-6">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
                    <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">
                        Featured Product: Magari360
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
                        The easiest way to sell cars online. Launch a sleek online showroom instantly.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image/Visual Side */}
                    <ScrollHighlightCard threshold={0.3}>
                         <div className="relative aspect-video rounded-[var(--radius)] overflow-hidden glass-card border border-primary/20 shadow-lg shadow-primary/10">
                           <Image
                             src="https://picsum.photos/800/450"
                             alt="Magari360 Platform Showcase"
                             width={800}
                             height={450}
                             className="object-cover w-full h-full"
                             data-ai-hint="software platform dashboard car dealership"
                           />
                         </div>
                    </ScrollHighlightCard>

                    {/* Text/Features Side */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold tracking-wide">Key Features</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex items-start space-x-3">
                                    <div className="mt-1 p-2 bg-primary/10 rounded-full inline-flex border border-primary/30">
                                        <feature.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                        <p className="text-sm text-muted-foreground font-normal">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                         {/* Ensure no extra whitespace/comments between Button and Link */}
                         <Button asChild size="lg" className="font-semibold btn-primary-gradient">
                             <Link href="/products/magari360">Learn More about Magari360</Link>
                         </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
