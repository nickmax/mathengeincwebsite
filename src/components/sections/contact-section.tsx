import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    // Use secondary background for contrast in dark mode
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          {/* Apply font-sans to heading */}
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-sans">Get in Touch</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ready to discuss your project or learn more about our services? Contact us today.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Card will use theme's card background */}
          <Card>
            <CardHeader>
               {/* Apply font-sans to card title */}
              <CardTitle className="font-sans">Contact Form</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
          <div className="space-y-6">
            {/* Apply font-sans to heading */}
            <h3 className="text-2xl font-semibold font-sans">Contact Information</h3>
             <div className="space-y-4 text-muted-foreground">
               <div className="flex items-start space-x-3">
                 <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                 <span>info@mathengeinc.com</span>
               </div>
               <div className="flex items-start space-x-3">
                 <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                 <span>+1 (555) 123-4567</span>
               </div>
               <div className="flex items-start space-x-3">
                 <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                 <span>123 Business Rd, Suite 100, City, State 12345</span>
               </div>
             </div>
              {/* Optional: Add a map here */}
              {/* <div className="h-64 bg-muted rounded-md"> Map Placeholder </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
