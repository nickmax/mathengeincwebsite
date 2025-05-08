'use client';

import React, { useMemo } from 'react';
import Image from 'next/image'; // Import next/image
import { Building, Globe, Zap, Layers, GitBranch, Cloud } from 'lucide-react'; // Keep for fallback or if some items are still icons
import type { LucideIcon } from 'lucide-react';

// HOW TO UPDATE LOGOS:
// 1. Add your logo images (preferably SVG) to the `public/logos/` directory (create it if it doesn't exist).
// 2. Update the `staticLogos` array below.
//    - Replace `icon` with `imgSrc` and provide the path to your logo (e.g., `/logos/company-a.svg`).
//    - Update the `name` to the company's name.
//    - The `alt` text will be automatically generated as "[Company Name] Logo".

interface LogoInfo {
  name: string;
  icon?: LucideIcon; // Optional: if you still want to use an icon for some
  imgSrc?: string;   // Optional: path to the image logo
  alt?: string;
}

const staticLogos: LogoInfo[] = [
  // Replace these with your actual company logos and paths
  { name: 'Elimux', imgSrc: '/logos/elimux.png' }, // Example: /logos/your-company-logo.svg
  { name: 'Furaha Initiative', imgSrc: '/logos/furaha.png' },
  { name: 'Peoples Dialogue Festival', imgSrc: '/logos/PDF.png' },
  { name: 'Cuesmiths Ke', imgSrc: '/logos/cuesmiths.png' },
  { name: 'Sikukuu', imgSrc: '/logos/sikukuu.png' },
  { name: 'Animix LTD', imgSrc: '/logos/animix.png' },
  // Fallback example using an icon if no imgSrc is provided
  // { name: 'Icon Fallback', icon: Building },
];


export function TrustedBySection() {
  const extendedLogos = useMemo(() => {
    const logosWithAlt = staticLogos.map(logo => ({
      ...logo,
      alt: `${logo.name} Logo`,
    }));
    // Ensure enough logos for a smooth scroll, duplicate if necessary
    const requiredLogosForLoop = 12; // Adjust based on desired visual density
    let tempLogos = [...logosWithAlt];
    while (tempLogos.length > 0 && tempLogos.length < requiredLogosForLoop) {
      tempLogos = tempLogos.concat(logosWithAlt.slice(0, requiredLogosForLoop - tempLogos.length));
    }
    if (tempLogos.length === 0) { // Handle case with no logos
        // Add some default placeholders if staticLogos is empty
        return [
            { name: 'Placeholder 1', icon: Building, alt: 'Placeholder 1 Logo'},
            { name: 'Placeholder 2', icon: Globe, alt: 'Placeholder 2 Logo'},
            { name: 'Placeholder 3', icon: Zap, alt: 'Placeholder 3 Logo'},
            { name: 'Placeholder 4', icon: Layers, alt: 'Placeholder 4 Logo'},
        ].reduce((acc, curr) => acc.concat(curr, curr), [] as LogoInfo[]); // Duplicate for scroll
    }
    return tempLogos.concat(tempLogos); // Duplicate the final list for seamless loop
  }, []);

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

        <div className="relative w-full overflow-hidden group mask-gradient">
          <div className="flex w-max animate-scroll group-hover:paused">
            {extendedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex flex-col items-center justify-center mx-8 md:mx-12 lg:mx-16 flex-shrink-0"
                style={{ minWidth: '120px' }}
              >
                {logo.imgSrc ? (
                  <Image
                    src={logo.imgSrc}
                    alt={logo.alt || `${logo.name} Logo`}
                    width={100} // Set a base width
                    height={64} // Set a base height, adjust as needed
                    className="h-12 md:h-16 w-auto object-contain text-muted-foreground transition-colors group-hover:text-primary group-hover:opacity-100 opacity-75"
                    // Using object-contain to ensure aspect ratio is maintained
                    // The parent div controls the spacing, image will fit within
                  />
                ) : logo.icon ? (
                  // Fallback to Lucide icon if imgSrc is not provided
                  <logo.icon aria-hidden="true" className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground transition-colors group-hover:text-primary" />
                ) : null}
                <span className="mt-2 text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
       <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        // Add grayscale filter for logos, and remove on hover for color pop effect
        .animate-scroll img {
          filter: grayscale(100%) opacity(0.75);
          transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        .group:hover .animate-scroll img {
          filter: grayscale(0%) opacity(1);
        }
       `}</style>
    </section>
  );
}

