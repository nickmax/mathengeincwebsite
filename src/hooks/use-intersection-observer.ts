'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean; // Optional: Keep highlighted once seen
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0.5, // Trigger when 50% visible
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const node = elementRef?.current; // DOM node

    if (!node || (freezeOnceVisible && isIntersecting)) {
      return;
    }

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentlyIntersecting = entry.isIntersecting;
        if (freezeOnceVisible && currentlyIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(node); // Stop observing once frozen
        } else if (!freezeOnceVisible) {
          setIsIntersecting(currentlyIntersecting);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    observerRef.current = observer;

    // Clean up on unmount
    return () => observer.disconnect();

  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]); // Added isIntersecting to dependencies for freezeOnceVisible logic

  return isIntersecting;
}
