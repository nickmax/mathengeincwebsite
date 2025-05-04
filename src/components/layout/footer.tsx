
"use client"; // Required for useState and useEffect

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import { cn } from '@/lib/utils';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Set the year only on the client-side after hydration
    setCurrentYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

   // Easter egg reveal logic
  const handleYearClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    console.log(`Click count: ${newClickCount}`); // Debugging
    // Reveal after 5 clicks on the year
    if (newClickCount >= 5) {
      setShowEasterEgg(true);
      console.log('Easter egg revealed!'); // Debugging
    }
    // Reset counter after a short delay if not revealed yet
    setTimeout(() => {
        if (clickCount < 4) setClickCount(0); // Only reset if not revealed
    }, 1500);
  };


  return (
    // Make footer slightly distinct or transparent, use muted text
    <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 bg-background/50 backdrop-blur-sm mt-16 relative"> {/* Added relative positioning */}
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          {/* Make the year clickable */}
          ©{' '}
           <span
             onClick={handleYearClick}
             className="cursor-pointer select-none hover:text-primary transition-colors"
             title="What could this be?"
            >
                {currentYear || ''}
            </span>
           {' '}Mathenge Inc. All rights reserved.
        </p>
        {/* Easter Egg Link - Initially hidden */}
         {showEasterEgg && (
            <Link
                href="/easter-egg/dino" // Link to the dino game page
                className={cn(
                    "absolute bottom-1 right-1 md:bottom-auto md:right-4", // Position discreetly
                    "text-xs text-primary/50 hover:text-primary transition-all duration-500",
                    "opacity-100 fade-in" // Ensure it's visible and fades in
                 )}
                 style={{ animation: 'fadeIn 0.5s ease-out' }} // Simple fade-in animation
            >
                [Runner]
            </Link>
         )}

        {/* Optional: Add social links or other footer elements here */}
      </div>
    </footer>
  );
}

// Add simple fade-in keyframes if not already in globals.css
// Consider adding this to globals.css instead for better organization
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
*/
