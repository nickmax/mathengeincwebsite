
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react'; // Import Moon and Sun icons
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Check mounted here for safety, although button rendering is conditional
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold inline-block text-lg">Mathenge Inc</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Dark Mode Toggle Button - Conditionally render only on client-side */}
            {mounted ? ( // Check if mounted
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="text-foreground hover:text-primary hover:bg-primary/10" // Style the button
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" /> // Sun icon for light mode
                ) : (
                  <Moon className="h-5 w-5" /> // Moon icon for dark mode
                )}
              </Button>
            ) : (
                 // Render a placeholder or nothing before mount to prevent hydration mismatch
                 <div className="h-10 w-10" /> // Placeholder with same size as button
            )}
           {/* Optional CTA button */}
           {/* <Button>Get Started</Button> */}
        </div>
        {/* Mobile Menu - Conditionally render the entire Sheet component only on client-side */}
        {mounted && ( // Correctly conditional rendering based on mount status
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-primary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={cn(
                "w-[300px] sm:w-[400px]",
                "bg-background/90 backdrop-blur-xl border-l border-white/10"
                )}>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="mb-4 flex items-center space-x-2">
                  <span className="font-bold text-xl">Mathenge Inc</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                  {/* Dark Mode Toggle for Mobile - Also check mounted status */}
                  {mounted ? ( // Check if mounted
                    <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex items-center justify-start space-x-2 mt-4 text-foreground hover:text-primary hover:bg-primary/10 px-2 py-1 text-lg rounded-md" // Style similar to nav links
                    >
                        {resolvedTheme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                        ) : (
                        <Moon className="h-5 w-5" />
                        )}
                        <span>Toggle Theme</span>
                    </Button>
                   ) : (
                        // Placeholder for mobile toggle
                        <div className="h-11 mt-4 px-2 py-1" /> // Placeholder matching button size/spacing
                   )}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
