'use client';

import React, { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface ScrollHighlightCardProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number; // Allow customizing threshold per card if needed
  // Pass any other props needed by the underlying Card or wrapper div
  [key: string]: any;
}

export function ScrollHighlightCard({
  children,
  className,
  threshold = 0.5, // Default threshold
  ...props
}: ScrollHighlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Using 0.3 threshold for earlier activation as element scrolls into view
  const isVisible = useIntersectionObserver(cardRef, { threshold: threshold });

  // We need to clone the child (expected to be a Card) and add the ref and dynamic class
  // This assumes the child accepts a `ref` and `className`
  // Use React.Children.only to ensure only one child is passed
  const child = React.Children.only(children) as React.ReactElement;

  // Clone the element and merge props
  const clonedChild = React.cloneElement(child, {
    ref: cardRef, // Pass the ref to the actual Card component
    className: cn(
      child.props.className, // Keep original classes
      'transition-all duration-500 ease-out', // Add transition for smooth effect
      isVisible
        ? 'scroll-highlighted shadow-primary/40 scale-105' // Highlight style when visible
        : 'opacity-70 scale-100', // Dimmed style when not visible
      className // Allow overriding from props
    ),
    ...props // Spread any other props
  });


  return clonedChild; // Return the modified Card component directly
}
