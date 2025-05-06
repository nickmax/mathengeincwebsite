
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  // Add any other props you might need, or remove if unnecessary
}

// Updated Logo component using next/image
export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logo.png" // Path relative to the 'public' directory
      alt="Your Company Logo" // Update alt text if needed
      width={120} // Specify the desired width
      height={40} // Specify the desired height (adjust aspect ratio)
      className={cn('h-10 w-auto', className)} // Keep or adjust styling
      priority // Add priority if the logo is above the fold (LCP)
    />
  );
}

export default Logo; // Assuming default export might be used elsewhere

