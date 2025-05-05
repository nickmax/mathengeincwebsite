
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';
import { useMemo } from "react"; // Import useMemo

// Define testimonials array outside the component if it's static
const staticTestimonials = [
  {
    name: "Ephraim Mundia",
    company: "Prime Variable Covers",
    title: "CEO",
    quote: "Working with Mathenge Inc. was one of the best decisions we made for our brand. Our website now reflects the professionalism and precision we stand for. They captured our vision perfectly and made it incredibly easy for clients to understand our product offerings. The team was responsive, creative, and detail-oriented from start to finish. We highly recommend them to any serious business looking to elevate their digital presence.",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "EM",
    aiHint: "professional headshot tech ceo",
    tag: "Industrial & Protective Covers",
  },
  {
    name: "Caesar Rabala",
    company: "CueSmiths",
    title: "Founder",
    quote: "Mathenge Inc. didn’t just build us a website — they gave our pool business a new edge. The design is bold, clean, and functional, and our customers now enjoy a seamless shopping experience for our cues, tables, and accessories. Sales inquiries have increased, and we finally look as premium online as we are in real life. Highly recommend for anyone in retail or e-commerce!",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "CR",
    aiHint: "creative director portrait marketing",
    tag: "Pool Tables & Accessories",
  },
  {
    name: "Eugene Oredi",
    company: "Furaha Initiative",
    title: "Finance Director",
    quote: "Mathenge Inc. helped us bring the heart of our mission online. They translated our work into a beautiful, accessible platform that makes it easy for donors, volunteers, and community members to connect with our cause. From donation flows to event updates, everything works smoothly. Thanks to Mathenge Inc., Furaha now has a digital home that reflects our impact and inspires action.",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "EO",
    aiHint: "startup founder casual retail",
    tag: "Nonprofit / Community Organization",
  },
];

export function TestimonialsSection() {
    // Memoize the testimonials data
    const testimonials = useMemo(() => staticTestimonials, []);

  return (
    <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">What Our Clients Say</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Hear from businesses that have partnered with Mathenge Inc and achieved remarkable results.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center"> {/* Added justify-center */}
          {testimonials.map((testimonial) => (
            // Use testimonial name as key assuming names are unique in this context
            <ScrollHighlightCard key={testimonial.name} threshold={0.3}>
              <Card
                  className={cn(
                      // Combined glass-card-glow with flex properties
                      "glass-card-glow flex flex-col justify-between h-full",
                  )}
              >
                <CardContent className="p-6 space-y-5 flex flex-col flex-grow">
                   <div className="flex items-center space-x-4">
                     <Avatar className="h-14 w-14 border-2 border-primary/60 p-0.5 shadow-md shadow-primary/20 flex-shrink-0"> {/* Added flex-shrink-0 */}
                       <AvatarImage src={testimonial.avatar} alt={`${testimonial.name} avatar`} data-ai-hint={testimonial.aiHint} className="rounded-full" />
                       <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">{testimonial.initials}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                       <p className="font-semibold text-foreground text-base truncate">{testimonial.name}</p> {/* Added truncate */}
                       <p className="text-xs text-muted-foreground font-normal truncate"> {/* Added truncate */}
                          {testimonial.title}, {testimonial.company}
                       </p>
                     </div>
                     <CircleCheckBig aria-label="Verified client" className="h-5 w-5 text-primary flex-shrink-0 ml-auto" /> {/* Added aria-label */}
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
            </ScrollHighlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
