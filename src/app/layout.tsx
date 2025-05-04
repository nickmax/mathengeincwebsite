import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider

// Configure Inter font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
      default: 'Mathenge Inc.',
      template: '%s | Mathenge Inc.', // Template for child pages
  },
  description: 'Mathenge Inc. offers innovative solutions including expert consulting, SaaS platforms, custom software development, and graphic design services.',
  keywords: ['Mathenge Inc', 'Software Development', 'SaaS', 'Consulting', 'Graphic Design', 'Web Development', 'Magari360'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Use Inter font variable, remove explicit 'dark' class here
    <html lang="en" className={cn(inter.variable)} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased', // Set default font to sans (Inter)
          // Font variable is now on <html>
        )}
      >
        {/* Wrap everything in ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Set default theme to dark
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
