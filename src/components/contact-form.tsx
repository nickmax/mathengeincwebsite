import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast"; // Import useToast
import { CheckCircle, AlertCircle } from 'lucide-react'; // Import icons

export function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phoneNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replace with your actual Web3Forms Access Key
  const WEB3FORMS_ACCESS_KEY = "3b386dd9-4b5d-4ac0-8511-dbfbaf63abc1"; // Replace with your key later

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const data = new FormData(formElement);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    // Add botcheck honeypot manually if needed, though often handled by Web3Forms
    data.append('botcheck', ''); // Append empty value for honeypot

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

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
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      {/* access_key is now added via FormData in handleSubmit */}
      {/* Honeypot is added via FormData as well */}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          type="text" 
          name="name" 
          placeholder="John Doe" 
          required 
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          name="email" 
          placeholder="johndoe@example.com" 
          required 
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject" 
          type="text" 
          name="subject" 
          placeholder="Subject" 
          required 
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
        <Input 
          id="phoneNumber" 
          type="text" 
          name="phoneNumber" 
          placeholder="(123) 456-7890" 
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          name="message" 
          placeholder="Write your message here." 
          required 
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
