
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { ScrollHighlightCard } from '@/components/scroll-highlight-card';

export const metadata: Metadata = {
  title: 'Our Portfolio - Mathenge Inc.',
  description: 'Explore the impressive portfolio of websites and digital solutions developed by Mathenge Inc. for various clients.',
};

interface PortfolioItem {
  id: string;
  clientName: string;
  previewLink: string;
  description: string;
  imageUrl: string;
  imageAiHint: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    clientName: 'Prime Variable Covers',
    previewLink: 'https://primevariablecovers.com',
    description: 'A professional website for industrial and protective cover solutions, showcasing products and services.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'industrial manufacturing'
  },
  {
    id: '2',
    clientName: 'Cuesmiths Ke',
    previewLink: 'https://cuesmiths.co.ke',
    description: 'An e-commerce site for pool tables, cues, and accessories, designed for a premium user experience.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'ecommerce sports'
  },
  {
    id: '3',
    clientName: 'Elimux Group',
    previewLink: 'https://elimux.com',
    description: 'A corporate website for a diversified group of companies, highlighting their various ventures.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'corporate group'
  },
  {
    id: '4',
    clientName: 'Furaha Initiative',
    previewLink: 'https://furaha.netlify.app/',
    description: 'A non-profit organization website focused on community impact, donations, and event updates.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'nonprofit community'
  },
   {
    id: '5',
    clientName: 'Sikukuu',
    previewLink: 'https://sikukuu.co.ke',
    description: 'An event planning and management platform, offering services for various occasions.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'event planning'
  },
  {
    id: '6',
    clientName: 'Animix LTD',
    previewLink: 'https://www.animix.co.ke',
    description: 'A creative animation and multimedia studio website, showcasing their portfolio and services.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'animation studio'
  }
];

export default function PortfolioPage() {
  return (
    <section id="portfolio" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h1 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Work</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            We take pride in the solutions we've delivered. Explore some of our recent projects below.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {portfolioItems.map((item) => (
            <ScrollHighlightCard key={item.id} threshold={0.3}>
              <Card className={cn(
                "flex flex-col h-full", // Ensure cards in a row have same height and content is flexible
                "glass-card-glow"
              )}>
                <CardHeader className="pb-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-[var(--radius)] mb-4">
                    <Image
                      src={item.imageUrl}
                      alt={`Screenshot of ${item.clientName} project`}
                      fill
                      className="object-cover"
                      data-ai-hint={item.imageAiHint}
                    />
                  </div>
                  <CardTitle className="text-xl text-center">{item.clientName}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <CardDescription className="text-sm text-muted-foreground font-normal mb-4 text-center flex-grow">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild variant="outline" className="w-full font-semibold">
                    <Link href={item.previewLink} target="_blank" rel="noopener noreferrer">
                      Live Preview
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </ScrollHighlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
