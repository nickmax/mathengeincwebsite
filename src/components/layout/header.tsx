
"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, Egg } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
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
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Access the current path

  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const handleEasterEggClick = useCallback(() => {
    const newClickCount = easterEggClicks + 1;
    setEasterEggClicks(newClickCount);

    if (newClickCount === 1) {
      setShowEasterEggHint(true);
      // Tooltip will show the message, no need for separate timer to hide it here
      // as Tooltip visibility is controlled by `showEasterEggHint`
    } else if (newClickCount < 5) {
        setShowEasterEggHint(true); // Keep showing hint if clicks < 5
    }


    if (newClickCount >= 5) {
      router.push('/quickthinker');
      setEasterEggClicks(0); // Reset clicks
      setShowEasterEggHint(false); // Hide hint after navigating
    }
  }, [easterEggClicks, router]);


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
    <div className="h-10 w-10" /> // Placeholder for SSR
  );

  const EasterEggButton = mounted ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={showEasterEggHint} onOpenChange={setShowEasterEggHint}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEasterEggClick}
            aria-label="Surprise Game"
            className="text-foreground hover:text-primary hover:bg-primary/10"
          >
            <Egg className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
           <p>Click {Math.max(0, 5 - easterEggClicks)} more times for a surprise!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div className="h-10 w-10" /> // Placeholder for SSR
  );


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2"
          aria-label="Mathenge Inc. Home"
        >
          <Logo className="h-9" /> {/* Increased logo size */}
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {staticNavItems.map((item) => (
            <Link
              key={item.href}
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

          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={cn(
                  "w-[300px] sm:w-[400px]",
                  "bg-background/90 backdrop-blur-xl border-l border-white/10"
                )}
              >
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle> {/* Added SheetTitle for accessibility */}
                <nav className="flex flex-col gap-4 mt-8">
                  <div
                    className="mb-4 flex items-center space-x-2 cursor-default"
                    aria-label="Mathenge Inc. Home"
                  >
                    <Logo className="h-10" /> {/* Increased logo size */}
                  </div>
                  {staticNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                      onClick={() => {
                        const closeButton = document.querySelector('[aria-label="Close"]');
                        if (closeButton instanceof HTMLElement) {
                            closeButton.click();
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                   <Button
                    variant="ghost"
                    onClick={() => {
                        handleEasterEggClick();
                        const closeButton = document.querySelector('[aria-label="Close"]');
                        if (closeButton instanceof HTMLElement) {
                            closeButton.click();
                        }
                    }}
                    className="mt-4 flex items-center justify-start gap-2 px-2 py-1 text-lg hover:bg-primary/10 rounded-md text-primary font-semibold"
                  >
                    <Egg className="h-5 w-5" />
                    <span>Surprise?</span>
                  </Button>
                  {showEasterEggHint && easterEggClicks > 0 && easterEggClicks < 5 && (
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
