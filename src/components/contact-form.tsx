'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  phoneNumber: string;
  message: string;
}

interface Web3FormsSuccessResponse {
  success: boolean;
  message: string;
}

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKeyMissing, setIsKeyMissing] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    phoneNumber: '',
    message: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!WEB3FORMS_ACCESS_KEY) {
      console.error(
        "CRITICAL: NEXT_PUBLIC_WEB3FORMS_KEY is not set. Contact form submissions will fail."
      );
      setIsKeyMissing(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!WEB3FORMS_ACCESS_KEY) {
      toast({
        title: "Form Configuration Error",
        description: "The contact form is currently unavailable. Please try again later or contact support.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formElement = e.currentTarget;
    const data = new FormData(formElement);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('botcheck', ''); // Honeypot

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const result: Web3FormsSuccessResponse = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Success!",
          description: result.message || "Your message has been sent.",
          className: "border-green-500", // Existing custom success style
          icon: <CheckCircle className="h-4 w-4 text-green-500" />, // Existing custom success style
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          phoneNumber: '',
          message: '',
        });
      } else {
        console.error("Web3Forms Submission failed:", result);
        throw new Error(result.message || "An error occurred while submitting the form.");
      }
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was an error submitting the form.",
        variant: "destructive",
      });
      console.error("Form submission error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isKeyMissing) {
    return (
      <div className="space-y-3 text-center p-6 border border-destructive/50 rounded-lg bg-destructive/10 glass-card">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-destructive">Contact Form Unavailable</h3>
        <p className="text-sm text-muted-foreground">
          The contact form is currently experiencing technical difficulties. Please try again later or reach out to us directly via the contact information provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number (Optional)"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Textarea
          id="message"
          name="message"
          placeholder="Your Message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting || isKeyMissing}>
        {isSubmitting ? "Submitting..." : "Send Message"}
      </Button>
    </form>
  );
}
