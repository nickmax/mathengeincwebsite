
'use client'; // Ensure this is a client component

import { useRef } from 'react';
import type { Metadata } from 'next';
import { PricingSection } from '@/components/sections/pricing-section';
import { useScrollHighlight } from '@/hooks/use-scroll-highlight'; // Import the hook

// Metadata for the Pricing Page (needs to be defined outside the component for client components)
// Note: For dynamic metadata in client components, consider fetching data and setting it,
// but for static descriptions, defining it here is simpler.
// However, Next.js recommends Server Components for metadata.
// This metadata might not be picked up correctly by crawlers if defined in a Client Component file.
// Consider moving the page to a Server Component if SEO is critical for this page.

// Temporary static definition (may not be fully effective for SEO in client component)
/*
export const metadata: Metadata = {
  title: 'Pricing Plans',
  description: "Discover transparent pricing plans for Mathenge Inc.'s services and products. Find the perfect fit for your business, from basic to enterprise solutions.",
};
*/
// It's better practice to handle metadata in a parent layout or make this a server component.
// For now, we'll rely on the layout's title template and description.


export default function PricingPage() {
    const pageRef = useRef<HTMLDivElement>(null); // Ref for the page container
    useScrollHighlight(pageRef, '.pricing-card', 'scroll-highlighted'); // Apply hook to pricing cards

    return (
        // Wrap the content in a div with the ref
        <div ref={pageRef}>
             {/* Add a heading specific to the pricing page for better context */}
             <h1 className="text-center text-4xl font-bold tracking-wide mt-16 mb-8 md:mt-24 md:mb-12 lg:text-5xl">
                Pricing Plans
            </h1>
            <PricingSection />
        </div>
    );
}
