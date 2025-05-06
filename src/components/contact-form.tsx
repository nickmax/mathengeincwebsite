import { AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

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
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    phoneNumber: '',
    message: '',
  });
  const { toast } = useToast()

    // Check if the environment variable is set
    if (!WEB3FORMS_ACCESS_KEY) {
        console.error("NEXT_PUBLIC_WEB3FORMS_KEY is not set. Form submission will fail.");
    }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const data = new FormData(formElement);
    data.append('access_key', WEB3FORMS_ACCESS_KEY || '');
    // Add botcheck honeypot manually if needed, though often handled by Web3Forms
    data.append('botcheck', ''); // Append empty value for honeypot

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
          className: "border-green-500",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          phoneNumber: '',
          message: '',
        });
      } else {
        console.error("Submission failed:", result);
        throw new Error(result.message || "An error occurred while submitting the form.");
      }
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was an error submitting the form.",
        className: "border-red-500",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Send Message"}
      </Button>
    </form>
  );
}
