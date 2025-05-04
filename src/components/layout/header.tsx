
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { Logo } from '@/components/logo';

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0); // State for logo clicks
  const router = useRouter(); // Initialize router

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Easter egg trigger on logo click
  const handleLogoClick = useCallback(() => {
    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);
    console.log(`Logo click count: ${newClickCount}`); // Debugging

    if (newClickCount >= 5) {
      console.log('Navigating to easter egg!'); // Debugging
      router.push('/easter-egg/tic-tac-toe'); // Navigate to the game page
      setLogoClickCount(0); // Reset count after navigation
    }

    // Optional: Reset count after a delay if threshold not met
    setTimeout(() => {
      // Only reset if count is less than 5 and hasn't just triggered navigation
      if (newClickCount < 5) {
           setLogoClickCount(0);
      }
    }, 1500); // Reset after 1.5 seconds of inactivity

  }, [logoClickCount, router]); // Include dependencies

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
         {/* Make the logo wrapper clickable for the easter egg */}
        <div
            onClick={handleLogoClick}
            className="mr-6 flex items-center space-x-2 cursor-pointer" // Add cursor-pointer
            aria-label="Mathenge Inc. Home (Click 5 times for a surprise!)" // Update aria-label
            title="Psst... Click me 5 times!" // Add explicit title hint
        >
          <Logo className="h-7" />
        </div>
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
            {/* Dark Mode Toggle Button */}
            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="text-foreground hover:text-primary hover:bg-primary/10"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            ) : (
                 <div className="h-10 w-10" /> // Placeholder
            )}
        </div>
        {/* Mobile Menu */}
        {mounted && (
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
               {/* Add accessible title for the sheet */}
               <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {/* Also make mobile logo clickable */}
                <div
                   onClick={handleLogoClick}
                   className="mb-4 flex items-center space-x-2 cursor-pointer"
                   aria-label="Mathenge Inc. Home (Click 5 times for a surprise!)"
                   title="Psst... Click me 5 times!" // Add explicit title hint
                 >
                   <Logo className="h-8" />
                 </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                    // Close sheet on link click
                    onClick={() => {
                        // Find the close button and click it programmatically
                        // This is a common pattern but might need adjustment based on Sheet implementation details
                        const closeButton = document.querySelector('[aria-label="Close"]');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                     }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
