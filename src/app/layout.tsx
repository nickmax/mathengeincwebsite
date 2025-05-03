import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Correct import
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"

// Correctly configure the fonts
const geistSans = Geist({ // Use Geist font loader
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Use Geist_Mono font loader
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mathenge Inc',
  description: 'Professional Services for Your Business Needs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add 'dark' class to html for dark theme
    // Ensure font variables are passed correctly
    <html lang="en" className={cn('dark', geistSans.variable, geistMono.variable)}>
      <body
        className={cn(
          'min-h-screen bg-background font-mono antialiased', // Set default font to mono
          // Font variables are now on <html>, no need to repeat here
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
