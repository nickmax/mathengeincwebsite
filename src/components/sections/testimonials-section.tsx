import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Alice Johnson",
    company: "Tech Solutions Ltd.",
    quote: "Mathenge Inc provided invaluable insights that helped us restructure our operations and significantly boost efficiency. Highly recommended!",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "AJ",
    aiHint: "professional headshot tech",
  },
  {
    name: "Bob Williams",
    company: "Creative Agency",
    quote: "Their strategic consulting was a game-changer for our market positioning. We saw a tangible increase in leads within the first quarter.",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "BW",
    aiHint: "creative director portrait",
  },
  {
    name: "Charlie Brown",
    company: "Retail Innovations",
    quote: "The team at Mathenge Inc is not only knowledgeable but also genuinely invested in our success. Their support has been exceptional.",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "CB",
    aiHint: "startup founder casual",
  },
];

export function TestimonialsSection() {
  return (
    // Use primary background (#0D0D0D in dark mode)
    <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">What Our Clients Say</h2>
          {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Hear from businesses that have partnered with Mathenge Inc and achieved remarkable results.
          </p>
        </div>
        {/* Glass cards for testimonials */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col justify-between">
              <CardContent className="p-6 space-y-6"> {/* Increased space */}
                 {/* Quote: Slightly larger, italic, primary foreground */}
                <blockquote className="text-lg italic leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <div className="flex items-center space-x-4 pt-2 border-t border-white/10"> {/* Added subtle top border */}
                  <Avatar className="h-12 w-12 border-2 border-primary/50"> {/* Enhanced avatar */}
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                     {/* Name: Semibold, primary foreground */}
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                     {/* Company: Normal weight, muted foreground */}
                    <p className="text-sm text-muted-foreground font-normal">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
