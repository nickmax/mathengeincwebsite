
"use client";

import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // No longer needed for easter egg nav
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react'; // Removed Egg icon
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react'; // Removed useCallback
import { Logo } from '@/components/logo';
/* Removed Tooltip imports as they are no longer needed here
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
*/

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Play', href: '/quickthinker' }, // Added link to QuickThinker game
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Removed state related to easter egg clicks and hint visibility

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Removed Easter egg trigger logic (handleEasterEggClick)

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
         {/* Logo is no longer clickable */}
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
              className={cn(
                  "transition-colors hover:text-foreground text-muted-foreground",
                   item.label === 'Play' && "text-primary hover:text-primary/80 font-semibold" // Highlight Play link
                   )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Removed Easter Egg Trigger Button */}

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
                         className={cn(
                             "block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground",
                             item.label === 'Play' && "text-primary hover:bg-primary/10 font-semibold" // Highlight Play link
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
                     {/* Removed Easter Egg trigger from mobile menu */}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
        </div>
      </div>
    </header>
  );
}
