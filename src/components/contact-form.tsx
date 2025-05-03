
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/actions/send-contact-email"; // Import the server action

// Schema must match the one used in the server action
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

// Basic input style for Crimson Frost (adjust if needed)
const inputStyle = cn(
    "bg-background/70 border-white/20 focus:border-primary focus:ring-primary/50", // Slightly transparent bg, subtle border, primary focus
    "rounded-[10px]" // Consistent rounded corners
);

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    console.log("Form submitted:", values);

    try {
      const result = await sendContactEmail(values);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message || "Thank you for contacting us. We'll be in touch soon.",
          // variant: "success" // Optional: Add a success variant if defined
        });
        form.reset();
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
                  className={cn("resize-none", inputStyle)} // Apply style to textarea
                  rows={5}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Use primary button style */}
        <Button type="submit" className="w-full font-semibold btn-primary-gradient" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
