import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // Add any specific props if needed
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 40" // Adjusted viewBox for a wider logo
      className={cn('h-8 w-auto text-foreground', className)} // Adjust size as needed, use foreground color
      {...props}
      aria-label="Mathenge Inc. Logo"
    >
      {/* Futuristic 'M' Shape */}
      <path
        d="M10 35 L20 5 L30 35 L40 5 L50 35" // Simple jagged 'M'
        stroke="hsl(var(--primary))" // Use primary color for the stroke
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 'Inc.' Text - smaller and positioned next to the 'M' */}
      <text
        x="58" // Position text to the right of the 'M'
        y="28" // Vertically align text
        fontFamily="var(--font-inter), sans-serif" // Use the app's font
        fontSize="18" // Adjust font size
        fontWeight="bold" // Bold text
        fill="currentColor" // Inherit text color (foreground)
        letterSpacing="1" // Add some letter spacing
      >
        inc.
      </text>
       {/* Optional: Add a subtle glow or element */}
       {/* <filter id="glow">
         <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
         <feMerge>
           <feMergeNode in="coloredBlur"/>
           <feMergeNode in="SourceGraphic"/>
         </feMerge>
       </filter>
       <use href="#mShape" filter="url(#glow)" /> */}
    </svg>
  );
}
