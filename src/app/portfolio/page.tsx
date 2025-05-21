
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
    description: `Your Partner in Sustainable Aquaculture. PVC is the leading Dam Liners supplier in East Africa, a one-stop-shop especially for the HDPE Dam liners polythene sector. We supply a full range of technologically advanced, scientifically proven and environmentally sustainable products. The combination of our technical, consulting and innovative products ensure customers are provided solutions specifically tailored to meet their requirements.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'industrial aquaculture'
  },
  {
    id: '2',
    clientName: 'Cuesmiths Ke',
    previewLink: 'https://cuesmiths.co.ke',
    description: `An e-commerce site for pool tables, cues, and accessories, designed for a premium user experience.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'ecommerce sports'
  },
  {
    id: '3',
    clientName: 'ElimuX',
    previewLink: 'https://elimux.co.ke',
    description: `ElimuX is Africa’s premier college admissions consultancy, dedicated to helping students in Kenya and across the continent gain admission to Ivy League schools and other top U.S. colleges. With a personalized approach and unmatched success rates, we equip students with the tools, strategies, and confidence to stand out in competitive application pools. Whether it’s crafting compelling essays, navigating the admissions process, or building your profile, ElimuX empowers you to rise above the ordinary and achieve the extraordinary. Your future starts here—let’s make it happen!`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'education consultancy'
  },
  {
    id: '4',
    clientName: 'Furaha Initiative',
    previewLink: 'https://furahainitiative.org',
    description: `Creating a brighter future through happiness and hope, one smile at a time. Our mission is to empower young people to make a positive impact in their communities and beyond by contributing funds and volunteering our time and resources to initiatives that promote happiness and hope. We believe that by investing in the well-being of individuals and communities, we can create a brighter, more inclusive future for all.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'nonprofit community'
  },
   {
    id: '5',
    clientName: 'Sikukuu',
    previewLink: 'https://sikukuu.co.ke',
    description: `An event planning and management platform, offering services for various occasions.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'event planning'
  },
  {
    id: '6',
    clientName: 'Animix LTD',
    previewLink: 'https://www.animix.co.ke',
    description: `A creative animation and multimedia studio website, showcasing their portfolio and services.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'animation studio'
  },
  {
    id: '7',
    clientName: 'People Dialogue Festival',
    previewLink: 'https://peopledialoguefestival.org',
    description: `The People Dialogue Festival (PDF) is a flagship initiative by the Centre for Multiparty Democracy (CMD- Kenya) and stands as a beacon of inclusive dialogue and transformative engagement in Kenya. This annual event unites leaders, citizens, government institutions, civil society organizations, and private sector stakeholders to discuss pressing societal challenges, promote meaningful citizen engagement, and co-create solutions for Kenya's sustainable development.\nThe inaugural PDF was successfully convened in March 2019, with subsequent editions held in 2020, 2021, 2022, 2023, and 2024. The upcoming 7th edition, themed "Building a Collaborative Democracy for Kenya’s Sustainable Future," is set to take place from 5th to 8th March 2025 at Uhuru Park, Nairobi.\nTo deepen its impact, PDF has expanded beyond the four-day annual event in Nairobi, rolling out interschool dialogues engaging 18 schools since 2023 and piloting county-level editions across four counties in 2025. By bridging diverse perspectives and fostering innovation, CMD-Kenya ensures the PDF remains a dynamic space for citizens, experts, state and non-state actors to engage in meaningful dialogue and action.`,
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'event festival'
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
