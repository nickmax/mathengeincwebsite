
import { useState, useEffect } from "react"; // Use useState, useEffect directly

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize state based on window width if available, otherwise undefined
  const [isMobile, setIsMobile] = useState<boolean | undefined>(() => {
      if (typeof window !== 'undefined') {
          return window.innerWidth < MOBILE_BREAKPOINT;
      }
      return undefined; // Initial state on server
  });

  useEffect(() => {
      if (typeof window === 'undefined') return; // Guard against server-side execution

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches); // Use mql.matches directly
    };

    mql.addEventListener("change", onChange);
    // Initial check in case the component mounted after initial render
    onChange();

    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array means this runs once on mount client-side

  return isMobile; // Return boolean or undefined
}
