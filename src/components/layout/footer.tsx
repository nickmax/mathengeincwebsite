
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
      // Optionally reset count immediately after reveal if desired
      // setClickCount(0);
    }
    // Reset counter after a short delay if not revealed yet or if already shown
     // Shorten timeout to make it feel more responsive if miss-clicked
     setTimeout(() => {
        // Only reset if not exactly 5 clicks OR if already revealed
        // Don't reset if it just hit 5 and revealed
        if (newClickCount > 5 || showEasterEgg) {
           setClickCount(0);
        }
     }, 1000); // Reset after 1 second
  };


  return (
    // Make footer slightly distinct or transparent, use muted text
    <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 bg-background/50 backdrop-blur-sm mt-16 relative"> {/* Added relative positioning */}
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          {/* Make the year clickable and more obvious */}
          ©{' '}
           <span
             onClick={handleYearClick}
             className="cursor-pointer select-none hover:text-primary transition-colors font-medium px-1 py-0.5 rounded bg-muted/50 hover:bg-muted" // Added slight background on hover
             title="Click me 5 times!" // Updated title
            >
                {currentYear || ''}
            </span>
           {' '}Mathenge Inc. All rights reserved.
           {/* Explicit Easter Egg hint */}
           <span className="ml-2 text-primary/80 font-semibold">(Pssst... click the year 5 times!)</span>
        </p>
        {/* Easter Egg Link - Initially hidden */}
         {showEasterEgg && (
            <Link
                href="/easter-egg/tic-tac-toe" // Link to the Tic Tac Toe game page
                className={cn(
                    "absolute bottom-2 right-2 md:bottom-auto md:right-4 p-2 rounded-lg bg-primary/10 border border-primary/30", // Position discreetly, add padding and visual cue
                    "text-sm font-semibold text-primary hover:text-primary/80 hover:bg-primary/20 transition-all duration-300", // Adjusted styles
                    "opacity-100 fade-in shadow-lg shadow-primary/20" // Ensure it's visible and fades in with shadow
                 )}
                 style={{ animation: 'fadeIn 0.5s ease-out' }} // Simple fade-in animation
            >
                Play Tic Tac Toe! 🕹️ {/* Updated Link Text */}
            </Link>
         )}

        {/* Optional: Add social links or other footer elements here */}
      </div>
    </footer>
  );
}

// Add simple fade-in keyframes if not already in globals.css
// Ensure this is present in src/app/globals.css
/*
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
*/
