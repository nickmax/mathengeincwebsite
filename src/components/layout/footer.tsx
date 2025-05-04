
"use client"; // Required for useState and useEffect

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
// Removed Link import as it's no longer needed here

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  // Removed state related to Easter egg trigger and link visibility

  useEffect(() => {
    // Set the year only on the client-side after hydration
    setCurrentYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

  // Removed Easter egg reveal logic (handleYearClick and related state)

  return (
    // Make footer slightly distinct or transparent, use muted text
    <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 bg-background/50 backdrop-blur-sm mt-16 relative"> {/* Added relative positioning */}
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          {/* Year is no longer clickable for Easter egg */}
          ©{' '}
           <span
             className="font-medium px-1" // Basic styling for year
            >
                {currentYear || ''}
            </span>
           {' '}Mathenge Inc. All rights reserved.
           {/* Removed explicit Easter Egg hint */}
        </p>
        {/* Removed Easter Egg Link - Navigation now happens directly from Header */}

        {/* Optional: Add social links or other footer elements here */}
      </div>
    </footer>
  );
}
