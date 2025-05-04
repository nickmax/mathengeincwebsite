
'use client';

import React, { useMemo } from 'react'; // Import useMemo
import { Building, Globe, Zap, Layers, GitBranch, Cloud } from 'lucide-react';

// Define logos array outside the component if it's static
const staticLogos = [
  { name: 'Company A', icon: Building },
  { name: 'Company B', icon: Globe },
  { name: 'Company C', icon: Zap },
  { name: 'Company D', icon: Layers },
  { name: 'Company E', icon: GitBranch },
  { name: 'Company F', icon: Cloud },
  // Add more unique logos if available, repeating less is better for visual variety
];

export function TrustedBySection() {
  // Memoize the extended logos array to prevent recalculation on every render
  const extendedLogos = useMemo(() => {
    const logosToExtend = staticLogos.length >= 4 ? staticLogos : [...staticLogos, ...staticLogos]; // Ensure enough logos for loop
    return [...logosToExtend, ...logosToExtend]; // Duplicate for seamless loop
  }, []); // Empty dependency array as staticLogos is constant

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-wide sm:text-4xl text-foreground">
            Trusted by Leading Companies
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg font-normal">
            Join the growing list of businesses that rely on Mathenge Inc.
          </p>
        </div>

        {/* Marquee Container - use overflow-x-hidden? */}
        <div className="relative w-full overflow-hidden group mask-gradient"> {/* Added mask-gradient class */}
          {/* Inner container for logos */}
          <div className="flex w-max animate-scroll group-hover:paused">
            {extendedLogos.map((logo, index) => (
              <div
                // Use a more stable key if possible, e.g., logo.name + index if names can repeat
                key={`${logo.name}-${index}`}
                className="flex flex-col items-center justify-center mx-8 md:mx-12 lg:mx-16 flex-shrink-0" // Added flex-shrink-0
                style={{ minWidth: '120px' }} // Increased minWidth slightly
              >
                <logo.icon aria-hidden="true" className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground transition-colors group-hover:text-primary" />
                {/* Use aria-hidden for decorative icons */}
                <span className="mt-2 text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
           {/* Gradient fades removed as mask handles it */}
        </div>
      </div>
      {/* Add CSS for mask-gradient if not globally defined */}
       <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
       `}</style>
    </section>
  );
}
