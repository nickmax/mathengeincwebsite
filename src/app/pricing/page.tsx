
'use client'; // Ensure this is a client component

import { useRef } from 'react';
import { PricingSection } from '@/components/sections/pricing-section';
import { useScrollHighlight } from '@/hooks/use-scroll-highlight'; // Import the hook

export default function PricingPage() {
    const pageRef = useRef<HTMLDivElement>(null); // Ref for the page container
    useScrollHighlight(pageRef, '.pricing-card', 'scroll-highlighted'); // Apply hook to pricing cards

    return (
        // Wrap the content in a div with the ref
        <div ref={pageRef}>
            <PricingSection />
        </div>
    );
}
