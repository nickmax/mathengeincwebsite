
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo } from "react"; // Import useMemo

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
// Removed the previous action import
// import { generateWhatsAppLink } from "@/actions/generate-whatsapp-link";

// Schema for client-side validation (can be kept)
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(), // Web3Forms handles extra fields
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

// Memoize input style class string if it's complex or computed
const inputStyle = cn(
    "bg-background/70 border-white/20 focus:border-primary focus:ring-primary/50",
    "rounded-[10px]"
);

// Memoize default values outside the component
const defaultFormValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = "3b386dd9-4b5d-4ac0-8511-dbfbaf63abc1";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    // Ensure mode is 'onSubmit' or similar if relying on RHF validation before native submit
    mode: 'onSubmit',
  });

  // Handle RHF's onSubmit which validates before allowing native form submission
  // Note: We don't prevent default or call a server action here.
  // The form's action attribute handles the submission.
  const handleValidation = async (values: ContactFormValues) => {
    // Validation successful, native form submission will proceed.
    // You might want to show a brief "Submitting..." state.
    setIsSubmitting(true);
    // Optionally, add a small delay or feedback before the browser navigates
    // or Web3Forms handles the response.
    // setTimeout(() => setIsSubmitting(false), 3000); // Reset submitting state after a delay
    // Consider using Web3Forms's AJAX submission for better UX if needed:
    // https://docs.web3forms.com/how-to-guides/ajax-submit-vanilla-js
    // For simplicity, we'll let the native form submission handle it for now.
  };

  const handleValidationError = (errors: any) => {
    console.error("Validation Error:", errors);
    toast({
      title: "Validation Failed",
      description: "Please check the form fields for errors.",
      variant: "destructive",
    });
    setIsSubmitting(false); // Reset submitting state on validation error
  };


  return (
    <Form {...form}>
      {/* Use the native form element with Web3Forms action */}
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        onSubmit={form.handleSubmit(handleValidation, handleValidationError)} // Use RHF for validation
        className="space-y-6"
      >
        {/* Web3Forms Access Key */}
        <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
        {/* Honeypot Spam Protection */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
        {/* Optional: Redirect URL after submission */}
        {/* <input type="hidden" name="redirect" value="https://yourdomain.com/thanks" /> */}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Name</FormLabel>
              <FormControl>
                {/* Add required attribute for native browser validation fallback */}
                <Input placeholder="Your Name" {...field} disabled={isSubmitting} className={inputStyle} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSubmitting} className={inputStyle} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject" // Keep subject if you want it submitted
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Subject (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Inquiry Subject" {...field} disabled={isSubmitting} className={inputStyle} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us how we can help..."
                  className={cn("resize-none", inputStyle)}
                  rows={5}
                  {...field}
                  disabled={isSubmitting}
                  required // Add required attribute
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-semibold btn-primary-gradient" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
