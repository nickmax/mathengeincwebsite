'use server';

import { z } from 'zod';

// Define the schema for input validation - must match the form schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Define the expected return type for the action
interface ActionResult {
  success: boolean;
  link?: string; // WhatsApp link
  message?: string; // Error or success message
}

// Phone number for WhatsApp (replace with environment variable ideally)
// Using the number from previous context. Ensure country code, no '+', spaces, or dashes.
const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_CONTACT_NUMBER || "254114744256"; // Replace with your number

export async function generateWhatsAppLink(values: ContactFormValues): Promise<ActionResult> {
  // Validate input on the server
  const validatedFields = contactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data.',
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  if (!WHATSAPP_PHONE_NUMBER) {
      console.error('WhatsApp phone number not configured.');
      return { success: false, message: 'Server configuration error: WhatsApp number missing.' };
  }

  // Construct the message payload for WhatsApp
  const whatsappMessage = `
New Contact Form Submission:
Name: ${name}
Email: ${email}
Subject: ${subject || 'N/A'}
Message:
${message}
  `.trim(); // Use trim() to remove leading/trailing whitespace

  // Encode the message for the URL
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Construct the WhatsApp link
  // Using https://wa.me/ which works well on both desktop and mobile
  const whatsappLink = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

  // console.log("Generated WhatsApp Link:", whatsappLink); // For debugging

  // Return success and the link
  return {
    success: true,
    link: whatsappLink,
    message: 'WhatsApp link generated successfully.' // Optional success message
   };

  // Note: No actual sending happens here, just link generation.
  // Error handling for link generation itself is minimal as it's based on validated data.
}
