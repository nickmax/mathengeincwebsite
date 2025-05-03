"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Instagram } from "lucide-react"; // Removed TikTok
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Define a functional component named ContactSection
export function ContactSection() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    // Function to generate the WhatsApp link
    const generateWhatsAppLink = () => {
      const phoneNumber = "+15551234567";  // Replace with your international format phone number
      const message = "Hello, I'm interested in your services!";
      const encodedMessage = encodeURIComponent(message);
      const link = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      setWhatsappLink(link);
    };

    generateWhatsAppLink();
  }, []);  // The empty array ensures this effect runs only once on mount


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
               {/* Social Media Links */}
               <div className="space-y-3">
                 <h4 className="font-semibold text-foreground">Connect With Us</h4>
                 <div className="flex items-center space-x-4">
                    {/* WhatsApp SVG Icon */}
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89C2.15 13.74 2.68 15.5 3.63 16.95L2.78 21.22L7.3 20.4C8.7 21.28 10.34 21.78 12.04 21.78C17.5 21.78 21.93 17.35 21.93 11.89C21.93 6.43 17.5 2 12.04 2ZM7.97 17.81C7.97 17.81 7.97 17.81 7.97 17.81C7.49 17.81 7.01 17.7 6.56 17.51L6.31 17.36L3.7 18.01L4.37 15.49L4.19 15.26C3.31 13.94 2.82 12.41 2.82 10.84C2.82 7.13 5.92 4.03 9.63 4.03C11.4 4.03 13.04 4.73 14.3 5.99C15.56 7.25 16.26 8.89 16.26 10.66C16.25 14.37 13.15 17.47 9.44 17.47C8.96 17.47 8.47 17.38 7.97 17.2V17.81ZM13.89 14.39C13.69 14.29 12.64 13.78 12.45 13.71C12.26 13.64 12.13 13.6 11.99 13.83C11.85 14.07 11.36 14.68 11.22 14.82C11.08 14.96 10.94 14.98 10.74 14.88C10.54 14.78 9.77 14.52 8.85 13.69C8.11 13.02 7.63 12.19 7.49 11.95C7.35 11.71 7.47 11.59 7.59 11.47C7.7 11.36 7.83 11.18 7.95 11.04C8.07 10.9 8.11 10.8 8.19 10.66C8.27 10.52 8.23 10.4 8.16 10.28C8.09 10.16 7.59 8.91 7.39 8.41C7.2 7.91 7.01 7.98 6.87 7.97H6.39C6.25 7.97 6.02 8.04 5.81 8.28C5.6 8.52 4.96 9.11 4.96 10.29C4.96 11.47 5.84 12.6 5.96 12.74C6.08 12.88 7.59 15.22 9.88 16.14C11.7 16.87 12.19 16.72 12.58 16.68C13.15 16.61 14.09 16.05 14.28 15.45C14.47 14.85 14.47 14.34 14.4 14.24C14.33 14.14 14.1 14.04 13.89 13.94V14.39Z" fill="currentColor"/>
                       </svg>
                     </a>
                    <a href="https://instagram.com/mathengeinc" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    {/* TikTok SVG Icon */}
                    <a href="https://tiktok.com/@mathengeinc" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12.53.02C13.17 0 13.8.1 14.4.28c.6.18 1.17.44 1.7.78.53.34 1.02.76 1.44 1.24.42.48.77.98 1.04 1.52.27.54.47 1.1.6 1.68.13.58.19 1.17.19 1.76 0 .59-.06 1.17-.19 1.76-.13.58-.33 1.14-.6 1.68-.27.54-.62 1.04-1.04 1.52-.42.48-.9 1-1.44 1.3-.53.34-1.1.6-1.7.78-.6.18-1.23.28-1.87.28s-1.27-.1-1.87-.28c-.6-.18-1.17-.44-1.7-.78-.53-.3-1.02-.72-1.44-1.2-.42-.48-.77-.98-1.04-1.52-.27-.54-.47-1.1-.6-1.68-.13-.58-.19-1.17-.19-1.76 0-.59.06-1.17.19-1.76.13-.58.33-1.14.6-1.68.27-.54.62-1.04 1.04-1.52.42-.48.9-1 1.44-1.24.53-.34 1.1-.6 1.7-.78.6-.18 1.23-.28 1.87-.28M19.74 7.02c-.2-.42-.48-.82-.8-1.18-.33-.37-.7-.7-1.1-.98-.4-.28-.83-.52-1.28-.7-.45-.18-.92-.32-1.4-.42-.48-.1-.97-.15-1.47-.15-.43 0-.86.04-1.28.13-.42.09-.83.2-1.22.36-.4.16-.77.34-1.12.57-.35.23-.68.48-.98.77-.3.29-.57.6-.8.94-.23.34-.43.7-.58 1.08-.16.38-.28.77-.37 1.17-.09.4-.13.8-.13 1.2 0 .4.04.8.13 1.2.09.4.2 1.17.37 1.17.16.38.35.74.58 1.08.23.34.49.65.8.94.3.29.63.54.98.77.35.23.72.4 1.12.57.4.16.8.27 1.22.36.42.09.85.13 1.28.13.5 0 .99-.05 1.47-.15.48-.1.95-.24 1.4-.42.45-.18.88-.42 1.28-.7.4-.28.77-.6 1.1-.98.33-.36.6-.76.8-1.18.2-.42.35-.85.45-1.3.1-.45.15-.9.15-1.35s-.05-.9-.15-1.35c-.1-.45-.25-.88-.45-1.3m-5.6 5.6c-.14.04-.28.06-.42.06h-.85V7.8h.85c.14 0 .28.02.42.06.14.04.27.1.38.18.12.08.22.18.3.3.1.1.15.24.15.38v.54c0 .14-.05.28-.15.38-.08.1-.18.2-.3.3-.12.08-.24.14-.38.18-.14.04-.28.06-.42.06h-.4v3.1h.4c.14 0 .28.02.42.06.14.04.27.1.38.18.12.08.22.18.3.3.1.1.15.24.15.38v.54c0 .14-.05.28-.15.38-.08.1-.18.2-.3.3-.12.08-.24.14-.38.18M14.7 14.1v-1.4c0-.14-.02-.27-.06-.4-.1-.1-.14-.2-.18-.27-.08-.14-.18-.25-.3-.34-.1-.1-.23-.18-.38-.23-.14-.05-.3-.08-.45-.08h-.87V7.8h.87c.15 0 .3.03.45.08.15.05.28.13.38.23.12.1.22.2.3.34.1.1.14.23.18.37.04.13.06.26.06.4v1.4c0 .14.02.27.06.4.1.1.14.2.18.27.08.14.18.25.3.34.1.1.23.18.38.23.14.05.3.08.45.08h.87v3.2h-.87c-.15 0-.3-.03-.45-.08-.15-.05-.28-.13-.38-.23-.12-.1-.22-.2-.3-.34-.1-.1-.14-.23-.18-.37-.04-.13-.06-.26-.06-.4" fillRule="evenodd" clipRule="evenodd"/>
                      </svg>
                    </a>
                 </div>
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
