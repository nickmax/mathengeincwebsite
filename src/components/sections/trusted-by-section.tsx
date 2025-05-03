'use client';

import React from 'react';
import { Building, Globe, Zap, Layers, GitBranch, Cloud } from 'lucide-react'; // Example icons

const logos = [
  { name: 'Company A', icon: Building },
  { name: 'Company B', icon: Globe },
  { name: 'Company C', icon: Zap },
  { name: 'Company D', icon: Layers },
  { name: 'Company E', icon: GitBranch },
  { name: 'Company F', icon: Cloud },
  { name: 'Company G', icon: Building }, // Repeat for seamless loop
  { name: 'Company H', icon: Globe },
];

// Duplicate the logos array to create a seamless loop effect
const extendedLogos = [...logos, ...logos];

export function TrustedBySection() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-secondary"> {/* Consistent background */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-wide sm:text-4xl text-foreground"> {/* Adjusted size */}
            Trusted by Leading Companies
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg font-normal"> {/* Adjusted size */}
            Join the growing list of businesses that rely on Mathenge Inc.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden group"> {/* group for hover pause */}
          {/* Inner container for logos - uses flex and animation */}
          <div className="flex w-max animate-scroll group-hover:paused">
            {/* Render logos twice for seamless loop */}
            {extendedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center mx-8 md:mx-12 lg:mx-16" // Adjust spacing
                style={{ minWidth: '100px' }} // Ensure minimum width for spacing
              >
                <logo.icon className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground transition-colors group-hover:text-primary" /> {/* Icon styling */}
                <span className="mt-2 text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"> {/* Show name on hover */}
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
           {/* Gradient Fades for edges */}
           <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}