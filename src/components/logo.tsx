
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  src?: string; // Allow passing src if not using default /logo.png
}

// Updated Logo component using next/image
export function Logo({ className, src = "/logo.png" }: LogoProps) {
  return (
    <Image
      src={src} // Use passed src or default to /logo.png
      alt="Mathenge Inc. Logo"
      width={160} // Increased default width
      height={53} // Increased default height (maintaining aspect ratio approx 3:1)
      className={cn('h-10 w-auto', className)} // Default size increased
      priority // Add priority if the logo is above the fold (LCP)
    />
  );
}

export default Logo;
