"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo'; // Import the Logo component

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/#solutions' }, // Ensured link works from other pages
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' }, // Ensured link works from other pages
    { label: 'Contact', href: '/#contact' },       // Ensured link works from other pages
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-background/80 backdrop-blur-lg"
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Mathenge Inc. Home">
          {/* Use the Logo component */}
          <Logo className="h-7" />
          {/* Remove the text span */}
          {/* <span className="font-bold inline-block text-lg">Mathenge Inc</span> */}
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
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="mb-4 flex items-center space-x-2" aria-label="Mathenge Inc. Home">
                   {/* Use the Logo component in mobile menu too */}
                   <Logo className="h-8" />
                   {/* Remove the text span */}
                  {/* <span className="font-bold text-xl">Mathenge Inc</span> */}
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
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
