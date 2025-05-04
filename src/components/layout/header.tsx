
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Need router for easter egg nav
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, Egg } from 'lucide-react'; // Added Egg icon
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Logo } from '@/components/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
    // Removed 'Play' from main nav, it's now the Easter Egg
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);
  const router = useRouter();

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Easter Egg Trigger Logic
  const handleEasterEggClick = useCallback(() => {
    const newClickCount = easterEggClicks + 1;
    setEasterEggClicks(newClickCount);

    if (newClickCount === 1) {
      setShowEasterEggHint(true);
      // Hide hint after a few seconds
      setTimeout(() => setShowEasterEggHint(false), 3000);
    }

    if (newClickCount >= 5) {
      router.push('/quickthinker'); // Navigate to the game page
      setEasterEggClicks(0); // Reset clicks after triggering
      setShowEasterEggHint(false); // Hide hint immediately
    }
  }, [easterEggClicks, router]);

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
         {/* Logo is NOT clickable for Easter egg */}
        <div
            className="mr-6 flex items-center space-x-2 cursor-default" // Make logo non-interactive visually
            aria-label="Mathenge Inc. Home"
        >
          <Logo className="h-7" />
           {/* Removed hint span from here */}
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  "transition-colors hover:text-foreground text-muted-foreground"
                  // No special styling needed now
                   )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Easter Egg Trigger Button with Tooltip */}
            {mounted && (
                <TooltipProvider delayDuration={100}>
                    <Tooltip open={showEasterEggHint}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleEasterEggClick}
                                aria-label="Surprise"
                                className="text-foreground hover:text-primary hover:bg-primary/10"
                            >
                                <Egg className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                            <p>Click {5 - easterEggClicks} more times for a surprise!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

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
             {/* Mobile Menu Trigger */}
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
                    {/* Mobile logo - not clickable */}
                    <div
                       className="mb-4 flex items-center space-x-2 cursor-default" // Make logo non-interactive
                       aria-label="Mathenge Inc. Home"
                     >
                       <Logo className="h-8" />
                     </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                         className={cn(
                             "block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                             // No special highlight needed
                         )}
                        // Close sheet on link click
                        onClick={() => {
                            // Find the close button and click it programmatically
                            const closeButton = document.querySelector('[aria-label="Close"]');
                            if (closeButton instanceof HTMLElement) {
                              closeButton.click();
                            }
                         }}
                      >
                        {item.label}
                      </Link>
                    ))}
                     {/* Easter Egg trigger also in mobile menu */}
                      <Button
                         variant="ghost"
                         onClick={() => {
                             handleEasterEggClick();
                              // Optionally close sheet if not navigating immediately
                              // const closeButton = document.querySelector('[aria-label="Close"]');
                              // if (closeButton instanceof HTMLElement) { closeButton.click(); }
                          }}
                         className="mt-4 flex items-center justify-start gap-2 px-2 py-1 text-lg hover:bg-primary/10 rounded-md text-primary font-semibold"
                       >
                         <Egg className="h-5 w-5" />
                         <span>Surprise?</span>
                       </Button>
                       {showEasterEggHint && (
                         <p className="text-sm text-primary px-2">Click {5 - easterEggClicks} more times!</p>
                       )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
        </div>
      </div>
    </header>
  );
}

