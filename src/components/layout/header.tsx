import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const navItems = [
    { label: 'Home', href: '/' }, // Adjusted href for SPA-like scrolling if needed, otherwise keep as is
    { label: 'Services', href: '/#services' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    // Apply glass effect with slight transparency
    <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10", // Use subtle border color for dark mode
        "bg-background/80 backdrop-blur-lg" // Glass effect
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Use Inter font, Bold */}
          <span className="font-bold inline-block text-lg">Mathenge Inc</span>
        </Link>
        {/* Navigation Links: Use Inter font, secondary text color */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground text-muted-foreground" // Use muted foreground for secondary text
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           {/* Optional CTA button */}
           {/* <Button>Get Started</Button> */}
        </div>
        {/* Mobile Menu */}
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-primary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            {/* Mobile Sheet Content: Apply glass effect */}
            <SheetContent side="right" className={cn(
                "w-[300px] sm:w-[400px]",
                "bg-background/90 backdrop-blur-xl border-l border-white/10" // Enhanced glass for mobile menu
                )}>
              <nav className="flex flex-col gap-4 mt-8">
                 <Link href="/" className="mb-4 flex items-center space-x-2">
                    {/* Use Inter Bold for brand name */}
                  <span className="font-bold text-xl">Mathenge Inc</span>
                 </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg hover:bg-accent rounded-md text-foreground" // Ensure text color is primary
                   >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
      </div>
    </header>
  );
}
