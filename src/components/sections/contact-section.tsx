import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactSection() {
  return (
    // Use secondary background (#1A1A1A in dark mode)
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          {/* Heading: Bold, tracking-wide */}
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Get in Touch</h2>
           {/* Subtext: Muted color, normal weight */}
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Ready to discuss your project or learn more about our services? Contact us today.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Glass card for the form */}
          <Card className={cn("glass-card-glow")}> {/* Add glow effect */}
            <CardHeader>
              <CardTitle className="text-2xl">Contact Form</CardTitle>
              <CardDescription className="font-normal">Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
          <div className="space-y-8"> {/* Increased spacing */}
             {/* Heading: Bold, tracking-wide */}
            <h3 className="text-2xl font-bold tracking-wide">Contact Information</h3>
             {/* Contact Info: Use primary color for icons, muted for text */}
             <div className="space-y-5 text-muted-foreground font-normal">
               <div className="flex items-start space-x-4">
                 <Mail className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 <span>info@mathengeinc.com</span>
               </div>
               <div className="flex items-start space-x-4">
                 <Phone className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 <span>+1 (555) 123-4567</span>
               </div>
               <div className="flex items-start space-x-4">
                 <MapPin className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 <span>123 Business Rd, Suite 100, City, State 12345</span>
               </div>
             </div>
              {/* Optional: Add a styled map placeholder */}
              {/* <div className="h-64 bg-muted/50 rounded-[var(--radius)] border border-white/10 flex items-center justify-center text-muted-foreground"> Map Placeholder </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
