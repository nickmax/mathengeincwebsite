import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // Add any specific props if needed
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 40" // Adjusted viewBox for a slightly wider logo and spacing
      className={cn('h-8 w-auto text-foreground', className)} // Adjust size as needed, use foreground color
      {...props}
      aria-label="Mathenge Inc. Logo"
    >
      {/* Geometric 'M' Shape - Two interlocking triangles/chevrons */}
      <path
        d="M10 35 L25 5 L40 35" // First part of M (left triangle/chevron)
        stroke="hsl(var(--primary))" // Use primary color for the stroke
        strokeWidth="5" // Slightly thicker stroke
        fill="none"
        strokeLinecap="round" // Rounded caps
        strokeLinejoin="round" // Rounded joins
      />
      <path
        d="M35 35 L50 5 L65 35" // Second part of M (right triangle/chevron, slightly overlapping/connected)
        stroke="hsl(var(--primary))" // Use primary color for the stroke
        strokeWidth="5" // Slightly thicker stroke
        fill="none"
        strokeLinecap="round" // Rounded caps
        strokeLinejoin="round" // Rounded joins
      />

      {/* 'inc.' Text - positioned next to the 'M', using theme font */}
      <text
        x="75" // Position text to the right of the 'M' with some space
        y="29" // Vertically align text slightly lower to match base of M
        fontFamily="var(--font-inter), sans-serif" // Use the app's font (Inter)
        fontSize="18" // Keep font size
        fontWeight="bold" // Bold text
        fill="currentColor" // Inherit text color (foreground)
        letterSpacing="1" // Keep letter spacing
      >
        inc.
      </text>
    </svg>
  );
}
