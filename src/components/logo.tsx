
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // Add any specific props if needed
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // Adjusted viewBox to be taller to accommodate text below
      viewBox="0 0 120 60"
      className={cn('h-10 w-auto', className)} // Adjust default size if needed
      {...props}
      aria-label="Mathenge Inc. Logo"
    >
      {/* Stylized 'M' Symbol - Simplified representation */}
      {/* Using fill instead of stroke, adjusted paths for boldness */}
      <path
        // Simplified path for left part of M - make thicker/rounder if possible
        d="M20 10 C 15 10, 15 35, 30 35 S 45 10, 40 10 C 50 10, 50 35, 35 35 S 25 10, 20 10 Z"
        fill="hsl(var(--primary))" // Use primary color fill
        stroke="none" // No stroke
      />
      <path
        // Simplified path for right part of M - make thicker/rounder if possible
         d="M50 10 C 45 10, 45 35, 60 35 S 75 10, 70 10 C 80 10, 80 35, 65 35 S 55 10, 50 10 Z"
        fill="hsl(var(--primary))" // Use primary color fill
        stroke="none" // No stroke
      />

      {/* 'Mathenge Inc.' Text */}
      <text
        x="60" // Centered horizontally (half of viewBox width 120)
        y="52" // Positioned below the 'M' symbol
        fontFamily="var(--font-inter), sans-serif" // Use the app's font
        fontSize="12" // Adjusted font size
        fontWeight="bold" // Bold text
        fill="hsl(var(--primary))" // Use primary color fill
        textAnchor="middle" // Center the text horizontally
        letterSpacing="1" // Keep letter spacing consistent
      >
        Mathenge Inc.
      </text>
    </svg>
  );
}

