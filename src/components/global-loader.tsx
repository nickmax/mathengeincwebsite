
import React from 'react';
import { Logo } from '@/components/logo'; // Import the Logo component
import { cn } from '@/lib/utils';

const GlobalLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-label="Loading page"
      role="status"
    >
      <div className="animate-pulse"> {/* Add pulse animation to the logo container */}
        <Logo className={cn("h-12 w-auto text-primary")} /> {/* Use Logo component */}
      </div>
    </div>
  );
};

export default GlobalLoader;
