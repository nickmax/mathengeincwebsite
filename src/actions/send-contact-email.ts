
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
// Example: const resend = new Resend(process.env.RESEND_API_KEY);
/* Example:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
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
      console.error('Recipient email addresses not configured in environment variables.');
      return { success: false, message: 'Server configuration error.' };
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


  console.log('--- Sending Email (Simulation) ---');
  console.log('To:', recipients.join(', '));
  console.log('Subject:', emailSubject);
  console.log('Body (HTML):', emailHtml);
  console.log('---------------------------------');

  try {
    // ** ACTUAL EMAIL SENDING LOGIC GOES HERE **
    // Replace the console logs above with your email sending implementation.

    /* Example using Resend:
    const { data, error } = await resend.emails.send({
      from: 'Mathenge Inc Contact Form <noreply@yourverifieddomain.com>', // Replace with your verified sender
      to: recipients,
      subject: emailSubject,
      reply_to: email,
      html: emailHtml,
      // text: emailText, // Optional plain text version
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, message: 'Failed to send message via email service.' };
    }
    console.log('Email sent successfully via Resend:', data);
    */

    /* Example using Nodemailer:
     const info = await transporter.sendMail({
       from: '"Mathenge Inc Contact Form" <noreply@yourdomain.com>', // sender address
       to: recipients.join(','), // list of receivers
       subject: emailSubject, // Subject line
       replyTo: email,
       text: emailText, // plain text body
       html: emailHtml, // html body
     });
     console.log("Message sent: %s", info.messageId);
    */

    // Simulate success for now if not implementing actual sending
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return { success: true, message: 'Your message has been sent successfully!' };

  } catch (error: any) {
    console.error('Email Sending Error:', error);
    return { success: false, message: 'An error occurred while sending the email.' };
  }
}
