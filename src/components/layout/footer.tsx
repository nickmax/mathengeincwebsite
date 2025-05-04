
"use client"; // Still needed for useEffect

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // Set year only on client-side
    setCurrentYear(new Date().getFullYear());
  }, []); // Runs once on mount

  return (
    <footer className={cn(
        "py-6 md:px-8 md:py-0 border-t border-white/10 mt-16",
        "bg-background/50 backdrop-blur-sm"
     )}>
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          ©{' '}
           <span className="font-medium px-1">
                {currentYear ?? '...'} {/* Render year or loading indicator */}
            </span>
           {' '}Mathenge Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
