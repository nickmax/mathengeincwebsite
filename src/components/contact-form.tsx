
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo } from "react"; // Import useMemo

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription, // Removed if not used
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/actions/send-contact-email";

// Schema remains the same
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(),
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

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues, // Use memoized default values
  });

  // Use useCallback for onSubmit if it relies on external props/state that don't change often
  // Here, it depends on form, toast, setIsSubmitting which are stable or managed internally
  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    // console.log("Form submitted:", values); // Keep for debugging if needed

    try {
      const result = await sendContactEmail(values);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message || "Thank you for contacting us. We'll be in touch soon.",
        });
        form.reset(); // Reset form fields to default values
      } else {
        throw new Error(result.message || "An unknown error occurred.");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      {/* Use onSubmit directly on the form element */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} disabled={isSubmitting} className={inputStyle}/>
              </FormControl>
              <FormMessage /> {/* Renders only when there's an error */}
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
                <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSubmitting} className={inputStyle}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-semibold btn-primary-gradient" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
