
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Keep globals.css
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from 'next-themes';

// Configure Inter font correctly
const inter = Inter({
  variable: '--font-inter', // Ensure this matches the variable used in CSS
  subsets: ['latin'],
  display: 'swap', // Optional: Improve font loading perception
});

export const metadata: Metadata = {
  title: {
      default: 'Mathenge Inc.',
      template: '%s | Mathenge Inc.',
  },
  description: 'Mathenge Inc. offers innovative solutions including expert consulting, SaaS platforms, custom software development, and graphic design services to elevate your business.',
  keywords: ['Mathenge Inc', 'Software Development', 'SaaS', 'Consulting', 'Graphic Design', 'Web Development', 'Magari360', 'QuickThinker', 'AutoCommerce'],
  icons: {
    icon: '/logo.png', // Use the logo as the favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variable to html tag for global scope
    <html lang="en" className={cn(inter.variable)} suppressHydrationWarning>
      <body
        className={cn(
          // Apply base styles to body
          'min-h-screen bg-background font-sans antialiased', // font-sans uses the variable defined in globals.css/tailwind config
        )}
        suppressHydrationWarning={true} // Add this prop to ignore extension attributes
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange // Recommended for next-themes
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
