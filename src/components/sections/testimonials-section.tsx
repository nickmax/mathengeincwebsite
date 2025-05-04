import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Import Badge for tags/rating
import { CircleCheckBig } from "lucide-react"; // Updated icon
import { cn } from "@/lib/utils";
import { ScrollHighlightCard } from '@/components/scroll-highlight-card'; // Import the wrapper

const testimonials = [
  {
    name: "Alice Johnson",
    company: "Tech Solutions Ltd.",
    title: "CEO", // Added title
    quote: "Mathenge Inc provided invaluable insights that helped us restructure our operations and significantly boost efficiency. Highly recommended!",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "AJ",
    aiHint: "professional headshot tech ceo",
    tag: "Consulting", // Added tag
  },
  {
    name: "Bob Williams",
    company: "Creative Agency",
    title: "Marketing Director", // Added title
    quote: "Their strategic consulting was a game-changer for our market positioning. We saw a tangible increase in leads within the first quarter.",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "BW",
    aiHint: "creative director portrait marketing",
    tag: "Strategy", // Added tag
  },
  {
    name: "Charlie Brown",
    company: "Retail Innovations",
    title: "Founder", // Added title
    quote: "The team at Mathenge Inc is not only knowledgeable but also genuinely invested in our success. Their support has been exceptional.",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "CB",
    aiHint: "startup founder casual retail",
    tag: "Support", // Added tag
  },
];

export function TestimonialsSection() {
  return (
    // Use primary background (#0D0D0D in dark mode)
    <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden"> {/* Added overflow-hidden */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">What Our Clients Say</h2>
          {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Hear from businesses that have partnered with Mathenge Inc and achieved remarkable results.
          </p>
        </div>
        {/* Glass cards for testimonials with glow effect */}
        {/* Consider adding carousel logic here later if needed */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            // Wrap the Card with ScrollHighlightCard
            <ScrollHighlightCard key={testimonial.name} threshold={0.3}>
              <Card
                  // Apply glass card style and glow hover effect
                  className={cn(
                      "glass-card-glow flex flex-col justify-between h-full", // Ensure cards take full height for consistent alignment
                      // Highlight is now handled by the wrapper
                  )}
              >
                <CardContent className="p-6 space-y-5 flex flex-col flex-grow"> {/* Adjusted spacing */}
                  {/* Avatar and Initial Info */}
                   <div className="flex items-center space-x-4">
                     {/* Avatar with glowing circular frame */}
                     <Avatar className="h-14 w-14 border-2 border-primary/60 p-0.5 shadow-md shadow-primary/20">
                       <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} className="rounded-full" />
                       <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">{testimonial.initials}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        {/* Name: Semibold, primary foreground */}
                       <p className="font-semibold text-foreground text-base">{testimonial.name}</p>
                        {/* Company & Title: Normal weight, muted foreground, smaller text */}
                       <p className="text-xs text-muted-foreground font-normal">
                          {testimonial.title}, {testimonial.company}
                       </p>
                     </div>
                     {/* Verified Icon */}
                     <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 ml-auto" /> {/* Updated icon */}
                   </div>

                   {/* Quote: Slightly larger, italic, primary foreground */}
                  <blockquote className="text-base italic leading-relaxed text-foreground flex-grow pt-4 border-t border-white/10"> {/* Adjusted styling and added border */}
                    “{testimonial.quote}”
                  </blockquote>

                  {/* Tag/Rating */}
                   <div className="mt-auto pt-4">
                     <Badge variant="secondary" className="text-xs"> {/* Using secondary badge style */}
                       {testimonial.tag}
                     </Badge>
                     {/* Optional: Add star rating here */}
                   </div>
                </CardContent>
                {/* No CardFooter needed */}
              </Card>
            </ScrollHighlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
