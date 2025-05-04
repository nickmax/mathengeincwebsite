
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, Egg } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback, useMemo } from 'react'; // Added useMemo
import { Logo } from '@/components/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Memoize navItems outside the component function if they are static
const staticNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];


export function Header() {
  // Use the memoized array
  const navItems = useMemo(() => staticNavItems, []);

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    // No need for mounted check here, as resolvedTheme depends on it implicitly via useTheme
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]); // Add dependencies

  const handleEasterEggClick = useCallback(() => {
    const newClickCount = easterEggClicks + 1;
    setEasterEggClicks(newClickCount);

    if (newClickCount === 1) {
      setShowEasterEggHint(true);
      const timer = setTimeout(() => setShowEasterEggHint(false), 3000);
      // Cleanup timer if component unmounts or clicks happen fast
      return () => clearTimeout(timer);
    }

    if (newClickCount >= 5) {
      router.push('/quickthinker');
      setEasterEggClicks(0);
      setShowEasterEggHint(false);
    }
  }, [easterEggClicks, router]);

  // Conditional rendering based on mounted state
  const ThemeToggleButton = mounted ? (
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
       <div className="h-10 w-10" /> // Placeholder to prevent layout shift
    );

  const EasterEggButton = mounted ? (
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
                {/* Ensure click count updates correctly */}
                <p>Click {Math.max(0, 5 - easterEggClicks)} more times for a surprise!</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  ) : null; // No placeholder needed if it's just an icon


  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
        <div
            className="mr-6 flex items-center space-x-2 cursor-default"
            aria-label="Mathenge Inc. Home"
        >
          <Logo className="h-7" />
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href} // Use href as key if unique
              href={item.href}
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {EasterEggButton}
            {ThemeToggleButton}

             {/* Mobile Menu Trigger */}
            {mounted && ( // Only render Sheet components once mounted
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
                   <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <nav className="flex flex-col gap-4 mt-8">
                    <div
                       className="mb-4 flex items-center space-x-2 cursor-default"
                       aria-label="Mathenge Inc. Home"
                     >
                       <Logo className="h-8" />
                     </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.href} // Use href as key
                        href={item.href}
                         className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                        onClick={() => {
                            // Programmatic close - consider using Sheet internal state if possible
                            const closeButton = document.querySelector<HTMLElement>('[aria-label="Close"]');
                            closeButton?.click();
                         }}
                      >
                        {item.label}
                      </Link>
                    ))}
                      <Button
                         variant="ghost"
                         onClick={handleEasterEggClick} // Reuse the same handler
                         className="mt-4 flex items-center justify-start gap-2 px-2 py-1 text-lg hover:bg-primary/10 rounded-md text-primary font-semibold"
                       >
                         <Egg className="h-5 w-5" />
                         <span>Surprise?</span>
                       </Button>
                       {showEasterEggHint && (
                         <p className="text-sm text-primary px-2">Click {Math.max(0, 5 - easterEggClicks)} more times!</p>
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
