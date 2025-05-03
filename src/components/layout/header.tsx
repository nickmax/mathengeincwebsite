import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  const navItems = [
    { label: 'Home', href: '/#home' },
    { label: 'Services', href: '/#services' },
    { label: 'Products', href: '/products' }, // Added Products link
    { label: 'Pricing', href: '/pricing' }, // Added Pricing link
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Placeholder for logo if needed */}
          {/* <Command className="h-6 w-6" /> */}
          {/* Apply font-sans to brand name */}
          <span className="font-bold inline-block font-sans">Mathenge Inc</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           {/* Add CTA button if needed */}
           {/* <Button>Get Started</Button> */}
        </div>
        {/* Mobile Menu */}
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur">
              <nav className="flex flex-col gap-4 mt-8">
                 <Link href="/" className="mb-4 flex items-center space-x-2">
                    {/* Apply font-sans to brand name in mobile menu */}
                  <span className="font-bold text-lg font-sans">Mathenge Inc</span>
                 </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg hover:bg-accent rounded-md"
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
