
'use server';

import { z } from 'zod';
// Import an email sending library like Nodemailer, Resend, etc.
// Example: import { Resend } from 'resend';
// Example: import nodemailer from 'nodemailer';

// Define the schema for input validation - must match the form schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Initialize your email client (only once)
// **IMPORTANT: YOU NEED TO CONFIGURE AN EMAIL PROVIDER HERE**
// Choose a provider like Resend, Nodemailer (with an SMTP service like Gmail, SendGrid, etc.), or another email service.
// 1. Install the necessary package: `npm install resend` or `npm install nodemailer`
// 2. Configure environment variables (e.g., RESEND_API_KEY, SMTP_HOST, SMTP_USER, etc.) in your .env.local file.
// 3. Uncomment and adapt one of the examples below or implement your chosen provider's logic.

/* Example using Resend:
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not found. Email sending will fail.");
}
*/

/* Example using Nodemailer:
import nodemailer from 'nodemailer';
let transporter: nodemailer.Transporter | null = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587), // Default to 587 if not set
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
} else {
    console.warn("SMTP configuration missing. Email sending will fail.");
}
*/

interface ActionResult {
  success: boolean;
  message?: string;
}

export async function sendContactEmail(values: ContactFormValues): Promise<ActionResult> {
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
  const primaryEmail = process.env.CONTACT_EMAIL_PRIMARY;
  const secondaryEmail = process.env.CONTACT_EMAIL_SECONDARY;

  if (!primaryEmail || !secondaryEmail) {
      console.error('Recipient email addresses not configured in environment variables (CONTACT_EMAIL_PRIMARY, CONTACT_EMAIL_SECONDARY).');
      return { success: false, message: 'Server configuration error: Recipient emails missing.' };
  }

  const recipients = [primaryEmail, secondaryEmail];
  const emailSubject = `Contact Form Submission: ${subject || 'No Subject'}`;
  const emailHtml = `
    <h1>New Contact Form Submission</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;
   const emailText = `
    New Contact Form Submission
    Name: ${name}
    Email: ${email}
    Subject: ${subject || 'N/A'}
    Message:
    ${message}
  `;

  // ** ACTUAL EMAIL SENDING LOGIC NEEDS TO BE IMPLEMENTED HERE **
  // The code below provides examples. You MUST uncomment and configure one,
  // or replace it with your chosen email provider's implementation.
  // If no actual email sending code is active, the form will appear to succeed
  // but no email will be sent.

  try {
    // ** UNCOMMENT AND CONFIGURE ONE OF THE FOLLOWING BLOCKS **

    /* Example using Resend (ensure 'resend' is initialized above):
    if (!resend) throw new Error("Resend client not initialized.");
    const { data, error } = await resend.emails.send({
      from: 'Mathenge Inc Contact Form <noreply@yourverifieddomain.com>', // Replace with YOUR verified sender domain with Resend
      to: recipients,
      subject: emailSubject,
      reply_to: email,
      html: emailHtml,
      text: emailText, // Optional plain text version
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, message: 'Failed to send message via email service.' };
    }
    console.log('Email sent successfully via Resend:', data);
    */

    /* Example using Nodemailer (ensure 'transporter' is initialized above):
    if (!transporter) throw new Error("Nodemailer transporter not initialized.");
     const info = await transporter.sendMail({
       from: '"Mathenge Inc Contact Form" <noreply@yourdomain.com>', // Replace with YOUR sender address
       to: recipients.join(','), // list of receivers
       subject: emailSubject, // Subject line
       replyTo: email,
       text: emailText, // plain text body
       html: emailHtml, // html body
     });
     console.log("Message sent via Nodemailer: %s", info.messageId);
    */

    // ** --- END OF EXAMPLE BLOCKS --- **


    // ** IF NO EMAIL PROVIDER IS CONFIGURED, THROW AN ERROR **
    // Remove this block once you have configured an email provider above.
    if (true) { // Replace 'true' with check if provider is configured e.g. !resend && !transporter
       console.error("!!! Email sending not configured !!! Implement email sending logic in src/actions/send-contact-email.ts");
       return { success: false, message: 'Email sending is not configured on the server.' };
    }


    // If email sending logic above succeeds, return success
    return { success: true, message: 'Your message has been sent successfully!' };

  } catch (error: any) {
    console.error('Email Sending Error:', error);
    // Provide a more generic error message to the user
    return { success: false, message: 'An error occurred while sending your message. Please try again later.' };
  }
}
