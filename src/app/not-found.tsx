
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div
        className={cn(
          "w-full max-w-md text-center p-8 md:p-12 rounded-[var(--radius)]",
          "glass-card-glow border border-destructive/40 shadow-xl shadow-destructive/20",
          "bg-background/75 backdrop-blur-xl"
        )}
      >
        <AlertTriangle className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-destructive mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 font-normal">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild size="lg" className="font-semibold btn-primary-gradient">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>
        </Button>
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
}
