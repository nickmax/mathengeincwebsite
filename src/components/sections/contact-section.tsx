

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react"; // Import useMemo
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';

// Define contact details outside if static
const contactInfo = {
    email: "info@mathengeinc.com",
    phoneDisplay: "+254 114 744 256",
    phoneRaw: "254114744256", // For WhatsApp link (ensure no '+', spaces, or dashes)
    address: "Nairobi, Kenya", // Placeholder address
    instagram: "https://instagram.com/mathenge.inc", // Updated Instagram link
    tiktok: "https://tiktok.com/@mathengeinc",
};

// Simple WhatsApp link for the icon (pre-filled generic message)
const generateSimpleWhatsAppLink = (phoneNumber: string, message: string = "Hello! I'm interested in your services."): string => {
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};


export function ContactSection() {
  // Memoize the simple WhatsApp link generation for the icon
  const simpleWhatsappLink = useMemo(() => generateSimpleWhatsAppLink(contactInfo.phoneRaw), []);

  return (
    <section id="contact" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h2 className="text-3xl font-bold tracking-wide sm:text-5xl">Get in Touch</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            Ready to discuss your project or learn more about our services? Contact us today.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <ScrollHighlightCard threshold={0.3}>
            <Card className={cn("glass-card-glow")}>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
                
              </CardHeader>
              <CardContent>
                <ContactForm /> {/* This form now triggers WhatsApp */}
              </CardContent>
            </Card>
          </ScrollHighlightCard>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold tracking-wide">Contact Information</h3>
             <div className="space-y-5 text-muted-foreground font-normal">
               <div className="flex items-start space-x-4">
                 <Mail aria-hidden="true" className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 {/* Use mailto link */}
                 <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">{contactInfo.email}</a>
               </div>
               <div className="flex items-start space-x-4">
                 <Phone aria-hidden="true" className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 {/* Use tel link */}
                  <a href={`tel:+${contactInfo.phoneRaw}`} className="hover:text-primary transition-colors">{contactInfo.phoneDisplay}</a>
               </div>
               <div className="flex items-start space-x-4">
                 <MapPin aria-hidden="true" className="h-6 w-6 mt-0.5 text-primary flex-shrink-0" />
                 {/* Add link to map if address is real */}
                 <span>{contactInfo.address}</span>
               </div>
               <div className="space-y-3 pt-4 border-t border-border"> {/* Added spacing and border */}
                 <h4 className="font-semibold text-foreground">Connect With Us</h4>
                 <div className="flex items-center space-x-4">
                    {/* WhatsApp SVG Icon - Links to a simple pre-filled message */}
                    <a href={simpleWhatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" aria-label="Chat on WhatsApp">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                         <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89C2.15 13.74 2.68 15.5 3.63 16.95L2.78 21.22L7.3 20.4C8.7 21.28 10.34 21.78 12.04 21.78C17.5 21.78 21.93 17.35 21.93 11.89C21.93 6.43 17.5 2 12.04 2ZM7.97 17.81C7.97 17.81 7.97 17.81 7.97 17.81C7.49 17.81 7.01 17.7 6.56 17.51L6.31 17.36L3.7 18.01L4.37 15.49L4.19 15.26C3.31 13.94 2.82 12.41 2.82 10.84C2.82 7.13 5.92 4.03 9.63 4.03C11.4 4.03 13.04 4.73 14.3 5.99C15.56 7.25 16.26 8.89 16.26 10.66C16.25 14.37 13.15 17.47 9.44 17.47C8.96 17.47 8.47 17.38 7.97 17.2V17.81ZM13.89 14.39C13.69 14.29 12.64 13.78 12.45 13.71C12.26 13.64 12.13 13.6 11.99 13.83C11.85 14.07 11.36 14.68 11.22 14.82C11.08 14.96 10.94 14.98 10.74 14.88C10.54 14.78 9.77 14.52 8.85 13.69C8.11 13.02 7.63 12.19 7.49 11.95C7.35 11.71 7.47 11.59 7.59 11.47C7.7 11.36 7.83 11.18 7.95 11.04C8.07 10.9 8.11 10.8 8.19 10.66C8.27 10.52 8.23 10.4 8.16 10.28C8.09 10.16 7.59 8.91 7.39 8.41C7.2 7.91 7.01 7.98 6.87 7.97H6.39C6.25 7.97 6.02 8.04 5.81 8.28C5.6 8.52 4.96 9.11 4.96 10.29C4.96 11.47 5.84 12.6 5.96 12.74C6.08 12.88 7.59 15.22 9.88 16.14C11.7 16.87 12.19 16.72 12.58 16.68C13.15 16.61 14.09 16.05 14.28 15.45C14.47 14.85 14.47 14.34 14.4 14.24C14.33 14.14 14.1 14.04 13.89 13.94V14.39Z" />
                       </svg>
                     </a>
                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" aria-label="Follow on Instagram">
                      <Instagram aria-hidden="true" className="h-6 w-6" />
                    </a>
                    {/* TikTok SVG Icon */}
                    
                    
                    {/* TikTok SVG Icon */}
                    
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

