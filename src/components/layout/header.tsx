
"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Logo } from '@/components/logo';
import { LogoWithClick } from '@/components/logo-with-click';


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

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);


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
    <div className="h-10 w-10" />
  );


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div
          className="mr-6 flex items-center space-x-2 cursor-default"
          aria-label="Mathenge Inc. Home"
        >
          <LogoWithClick/>
        </div>
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
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                <nav className="flex flex-col gap-4 mt-8">
                  <div
                    className="mb-4 flex items-center space-x-2 cursor-default"
                    aria-label="Mathenge Inc. Home"
                  >
                    <Logo className="h-9" /> {/* Increased logo size from h-8 to h-9 */}
                  </div>
                  {staticNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground"
                      onClick={() => {
                        // Attempt to close the sheet by simulating a click on its close button
                        // This selector might need adjustment if Radix UI's close button details change
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
      </div>
    </header>
  );
}

