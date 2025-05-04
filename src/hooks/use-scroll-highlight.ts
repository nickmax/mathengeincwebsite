
'use client';

import { useEffect, useRef, type RefObject } from 'react';

// Simplified throttle function
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


export function useScrollHighlight(
  containerRef: RefObject<HTMLElement>,
  cardSelector: string = '.card',
  highlightClassName: string = 'scroll-highlighted',
  throttleLimit: number = 100
) {
  const highlightedElementRef = useRef<Element | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return; // Guard against missing container or server-side execution

    const handleScroll = () => {
      const cards = Array.from(container.querySelectorAll<HTMLElement>(cardSelector)); // Use HTMLElement for getBoundingClientRect
      if (!cards.length) return;

      const viewportCenterY = window.scrollY + window.innerHeight / 2;
      let closestCard: Element | null = null;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = window.scrollY + rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenterY - cardCenterY);

        const isPartiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isPartiallyVisible && distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      if (highlightedElementRef.current === closestCard) {
        return;
      }

      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(highlightClassName);
      }

      if (closestCard) {
        closestCard.classList.add(highlightClassName);
        highlightedElementRef.current = closestCard;
      } else {
        highlightedElementRef.current = null;
      }
    };

    const throttledScrollHandler = throttle(handleScroll, throttleLimit);

    // Initial call
    throttledScrollHandler();

    window.addEventListener('scroll', throttledScrollHandler, { passive: true }); // Use passive listener for better scroll performance
    window.addEventListener('resize', throttledScrollHandler);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(highlightClassName);
      }
    };
  }, [containerRef, cardSelector, highlightClassName, throttleLimit]);
}
