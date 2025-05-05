 "use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from 'axios';

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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

const inputStyle = cn(
    "bg-background/70 border-white/20 focus:border-primary focus:ring-primary/50",
    "rounded-[10px]"
);

const defaultFormValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const WEB3FORMS_ACCESS_KEY = "3b386dd9-4b5d-4ac0-8511-dbfbaf63abc1";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: 'onSubmit',
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await axios.post("https://api.web3forms.com/submit", {
        ...values,
        access_key: WEB3FORMS_ACCESS_KEY,
      });

      if (response.status === 200) {
        console.log("Form submitted successfully");
        form.reset();
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Message sent successfully!",
          variant: "success",
        });
      } else {
        console.error("Form submission failed");
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Name</FormLabel>
              <FormControl>
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
                  required
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
