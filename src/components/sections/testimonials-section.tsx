
'use client'; // Ensure this is a client component

import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollHighlight } from '@/hooks/use-scroll-highlight'; // Import the hook

const testimonials = [
  {
    name: "Alice Johnson",
    company: "Tech Solutions Ltd.",
    title: "CEO",
    quote: "Mathenge Inc provided invaluable insights that helped us restructure our operations and significantly boost efficiency. Highly recommended!",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "AJ",
    aiHint: "professional headshot tech ceo",
    tag: "Consulting",
  },
  {
    name: "Bob Williams",
    company: "Creative Agency",
    title: "Marketing Director",
    quote: "Their strategic consulting was a game-changer for our market positioning. We saw a tangible increase in leads within the first quarter.",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "BW",
    aiHint: "creative director portrait marketing",
    tag: "Strategy",
  },
  {
    name: "Charlie Brown",
    company: "Retail Innovations",
    title: "Founder",
    quote: "The team at Mathenge Inc is not only knowledgeable but also genuinely invested in our success. Their support has been exceptional.",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "CB",
    aiHint: "startup founder casual retail",
    tag: "Support",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null); // Create a ref for the section container
  useScrollHighlight(sectionRef, '.testimonial-card', 'scroll-highlighted'); // Apply the hook

  return (
    <section id="testimonials" ref={sectionRef} className="w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">What Our Clients Say</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Hear from businesses that have partnered with Mathenge Inc and achieved remarkable results.
          </p>
        </div>
        {/* Consider adding carousel logic here later if needed */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
                key={testimonial.name}
                className={cn(
                    "testimonial-card flex flex-col justify-between", // Add selector class
                    // "glass-card-glow" // Keep or adjust hover glow
                )}
            >
              <CardContent className="p-6 space-y-5 flex flex-col flex-grow">
                 <div className="flex items-center space-x-4">
                   <Avatar className="h-14 w-14 border-2 border-primary/60 p-0.5 shadow-md shadow-primary/20">
                     <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} className="rounded-full" />
                     <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">{testimonial.initials}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1">
                     <p className="font-semibold text-foreground text-base">{testimonial.name}</p>
                     <p className="text-xs text-muted-foreground font-normal">
                        {testimonial.title}, {testimonial.company}
                     </p>
                   </div>
                   <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 ml-auto" />
                 </div>

                <blockquote className="text-base italic leading-relaxed text-foreground flex-grow pt-4 border-t border-white/10">
                  “{testimonial.quote}”
                </blockquote>

                 <div className="mt-auto pt-4">
                   <Badge variant="secondary" className="text-xs">
                     {testimonial.tag}
                   </Badge>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
