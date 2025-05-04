
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, Egg } from 'lucide-react'; // Changed Puzzle to Egg
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react'; // Import useCallback
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
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [easterEggClickCount, setEasterEggClickCount] = useState(0); // State for easter egg clicks
  const [showEasterEggHint, setShowEasterEggHint] = useState(false); // State for hint visibility
  const router = useRouter(); // Initialize router

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Easter egg trigger on dedicated button click
  const handleEasterEggClick = useCallback(() => {
    const newClickCount = easterEggClickCount + 1;
    setEasterEggClickCount(newClickCount);
    setShowEasterEggHint(true); // Show hint on first click
    console.log(`Easter egg click count: ${newClickCount}`); // Debugging

    if (newClickCount >= 5) {
      console.log('Navigating to easter egg!'); // Debugging
      router.push('/easter-egg/tic-tac-toe'); // Navigate to the game page
      setEasterEggClickCount(0); // Reset count after navigation
      setShowEasterEggHint(false); // Hide hint after navigation
    } else {
        // Reset hint visibility after a delay if threshold not met
        const timer = setTimeout(() => {
            setShowEasterEggHint(false);
            // console.log('Hide Easter egg hint'); // Debugging
        }, 2000); // Hide hint after 2 seconds

        // Clean up the timer if the component unmounts or the count progresses
        return () => clearTimeout(timer);
    }

  }, [easterEggClickCount, router]); // Include dependencies

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
         {/* Logo is no longer clickable for easter egg */}
        <div
            className="mr-6 flex items-center space-x-2"
            aria-label="Mathenge Inc. Home"
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
        <div className="flex flex-1 items-center justify-end space-x-2"> {/* Reduced space for more icons */}
            {/* Easter Egg Trigger Button with Tooltip */}
            {mounted && (
              <TooltipProvider>
                <Tooltip open={showEasterEggHint}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEasterEggClick}
                      aria-label="Easter Egg Trigger"
                      className="text-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Egg className="h-5 w-5" /> {/* Changed icon */}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click 5 times for a special surprise!</p>
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
                       className="mb-4 flex items-center space-x-2"
                       aria-label="Mathenge Inc. Home"
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
                            const closeButton = document.querySelector('[aria-label="Close"]');
                            if (closeButton instanceof HTMLElement) {
                              closeButton.click();
                            }
                         }}
                      >
                        {item.label}
                      </Link>
                    ))}
                     {/* Add Easter Egg trigger inside mobile menu too - Wrap with Tooltip */}
                     <TooltipProvider>
                        <Tooltip open={showEasterEggHint}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              onClick={handleEasterEggClick}
                              aria-label="Easter Egg Trigger"
                              className="flex items-center gap-2 px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground justify-start mt-4"
                            >
                              <Egg className="h-5 w-5" /> {/* Changed icon */}
                              <span>Surprise?</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start">
                             <p>Click 5 times for a special surprise!</p>
                          </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
        </div>
      </div>
    </header>
  );
}
