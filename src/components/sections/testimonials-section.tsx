import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alice Johnson",
    company: "Tech Solutions Ltd.",
    quote: "Mathenge Inc provided invaluable insights that helped us restructure our operations and significantly boost efficiency. Highly recommended!",
    avatar: "https://picsum.photos/100/100?random=1",
    initials: "AJ",
    aiHint: "professional headshot",
  },
  {
    name: "Bob Williams",
    company: "Creative Agency",
    quote: "Their strategic consulting was a game-changer for our market positioning. We saw a tangible increase in leads within the first quarter.",
    avatar: "https://picsum.photos/100/100?random=2",
    initials: "BW",
    aiHint: "business portrait",
  },
  {
    name: "Charlie Brown",
    company: "Retail Innovations",
    quote: "The team at Mathenge Inc is not only knowledgeable but also genuinely invested in our success. Their support has been exceptional.",
    avatar: "https://picsum.photos/100/100?random=3",
    initials: "CB",
    aiHint: "corporate executive",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Clients Say</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hear from businesses that have partnered with Mathenge Inc and achieved remarkable results.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <blockquote className="text-lg font-semibold leading-snug">
                  “{testimonial.quote}”
                </blockquote>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
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
