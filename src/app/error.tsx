
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
        <h1 className="text-3xl font-bold text-destructive mb-4">Something went wrong!</h1>
        <p className="text-lg text-muted-foreground mb-8 font-normal">
          An unexpected error occurred. We&apos;ve been notified and are looking into it.
        </p>
        {/* Optional: Display error message in development
        {process.env.NODE_ENV === 'development' && error?.message && (
          <p className="text-sm text-muted-foreground mb-8 font-mono bg-muted p-2 rounded break-all max-h-32 overflow-y-auto">
            Error: {error.message}
            {error.digest && <><br />Digest: {error.digest}</>}
          </p>
        )}
        */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            size="lg"
            variant="outline"
            className="font-semibold"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          <Button asChild size="lg" className="font-semibold btn-primary-gradient">
            {/* Using <a> tag for a hard navigation to reset potentially broken client-side state */}
            <a href="/"> 
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </a>
          </Button>
        </div>
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        If the problem persists, please contact support.
      </p>
    </div>
  );
}
