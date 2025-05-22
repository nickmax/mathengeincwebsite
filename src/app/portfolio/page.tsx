
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
    id: '3',
    clientName: 'ElimuX',
    previewLink: 'https://elimux.co.ke',
    description: `Premier college admissions consultancy in Africa, guiding students to Ivy League and top U.S. colleges.`,
    imageUrl: 'https://elimux.co.ke/images/leadphoto.jpg',
    imageAiHint: 'education consultancy'
  },

  
  {
    id: '4',
    clientName: 'Furaha Initiative',
    previewLink: 'https://furahainitiative.org',
    description: `Empowering youth for positive community impact through funding and volunteering for a brighter future.`,
    imageUrl: 'https://furahainitiative.org/images/furaha_group.jpeg',
    imageAiHint: 'nonprofit community'
  },
  {
    id: '7',
    clientName: 'People Dialogue Festival',
    previewLink: 'https://peopledialoguefestival.org',
    description: `CMD-Kenya's flagship initiative promoting inclusive dialogue for Kenya's sustainable development.`,
    imageUrl: 'https://peopledialoguefestival.org/images/Dialogue.jpg',
    imageAiHint: 'event festival'
  },

  {
    id: '1',
    clientName: 'Prime Variable Covers',
    previewLink: 'https://primevariablecovers.com',
    description: `Leading supplier of HDPE Dam Liners in East Africa, offering advanced and sustainable aquaculture solutions.`,
    imageUrl: 'https://primevariablecovers.com/images/pvclogo.png',
    imageAiHint: 'industrial aquaculture'
  }
];

export default function PortfolioPage() {
  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-wide sm:text-5xl mb-4">Our Work</h1>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Our portfolio is currently being updated. Please check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-14">
          <h1 className="text-3xl font-bold tracking-wide sm:text-5xl">Our Work</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-normal">
            We take pride in the solutions we've delivered. Explore some of our recent projects below.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {portfolioItems.map((item) => (
            <ScrollHighlightCard key={item.id} threshold={0.3}>
              <Card className={cn(
                "flex flex-col h-full", 
                "glass-card-glow p-4" 
              )}>
                <CardHeader className="p-3 pb-2"> 
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-[var(--radius)] mb-3"> 
                    <Image
                      src={item.imageUrl}
                      alt={`Screenshot of ${item.clientName} project`}
                      fill
                      className="object-cover"
                      data-ai-hint={item.imageAiHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
                    />
                  </div>
                  <CardTitle className="text-lg text-center">{item.clientName}</CardTitle> 
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-3 pt-0"> 
                  <CardDescription className="text-xs text-muted-foreground font-normal mb-3 text-center flex-grow line-clamp-4"> 
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="mt-auto p-3 pt-2"> 
                  <Button asChild variant="outline" size="sm" className="w-full font-semibold"> 
                    <Link href={item.previewLink} target="_blank" rel="noopener noreferrer">
                      Live Preview
                      <ExternalLink className="ml-2 h-3 w-3" /> 
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
