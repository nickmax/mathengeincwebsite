
'use client';

import { useEffect, useRef, type RefObject } from 'react';

// Throttle function to limit the rate at which a function can fire.
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let lastFunc: ReturnType<typeof setTimeout> | undefined;
  let lastRan: number;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  } as T;
}


export function useScrollHighlight(
  containerRef: RefObject<HTMLElement>,
  cardSelector: string = '.card', // Selector for the cards within the container
  highlightClassName: string = 'scroll-highlighted',
  throttleLimit: number = 100 // Throttle scroll handler calls to every 100ms
) {
  const highlightedElementRef = useRef<Element | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.querySelectorAll(cardSelector));
      if (!cards.length) return;

      const viewportCenterY = window.scrollY + window.innerHeight / 2;
      let closestCard: Element | null = null;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = window.scrollY + rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenterY - cardCenterY);

        // Basic check: if the card is at least partially in view
        const isPartiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isPartiallyVisible && distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      // If the highlighted element hasn't changed, do nothing
      if (highlightedElementRef.current === closestCard) {
        return;
      }

      // Remove highlight from the previously highlighted element
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(highlightClassName);
      }

      // Add highlight to the new closest card
      if (closestCard) {
        closestCard.classList.add(highlightClassName);
        highlightedElementRef.current = closestCard;
      } else {
        highlightedElementRef.current = null; // No card is highlighted
      }
    };

    const throttledScrollHandler = throttle(handleScroll, throttleLimit);

    // Initial call to highlight on load
    throttledScrollHandler();

    window.addEventListener('scroll', throttledScrollHandler);
    window.addEventListener('resize', throttledScrollHandler); // Also handle resize

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
      // Clean up: remove highlight from the last element when unmounting
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(highlightClassName);
      }
    };
  }, [containerRef, cardSelector, highlightClassName, throttleLimit]); // Re-run effect if refs or class names change
}
