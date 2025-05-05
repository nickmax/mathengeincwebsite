'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import GlobalLoader from '../global-loader'; // Import the loader component

const PageTransitionLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Store the previous path and search params to detect changes
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    const currentFullUrl = `${pathname}?${searchParams}`;

    // If the path ref is null (initial load) or different from the current URL
    if (previousPathRef.current !== null && previousPathRef.current !== currentFullUrl) {
      setIsLoading(true);
      
      // Optional: Add a minimum loading time for smoother transitions
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Update the ref *after* the loading state is set
        previousPathRef.current = currentFullUrl;
      }, 500); // Adjust delay as needed (e.g., 500ms)

      return () => clearTimeout(timer); // Cleanup timer on unmount or next effect run

    } else if (previousPathRef.current === null) {
       // On initial load, set the ref without triggering loading state
       previousPathRef.current = currentFullUrl;
       setIsLoading(false); // Ensure loader is off initially
    } else {
        // If the path is the same, ensure loading is off
        // This handles cases like client-side updates without full navigation
        setIsLoading(false);
    }

  }, [pathname, searchParams]);

  return isLoading ? <GlobalLoader /> : null;
};

export default PageTransitionLoader;
