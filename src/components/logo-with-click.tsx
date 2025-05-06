
"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Egg } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function LogoWithClick() {
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);
  const router = useRouter();

  const handleEasterEggClick = useCallback(() => {
    const newClickCount = easterEggClicks + 1;
    setEasterEggClicks(newClickCount);

    if (newClickCount === 1) {
      setShowEasterEggHint(true);
      const timer = setTimeout(() => setShowEasterEggHint(false), 3000);
      return () => clearTimeout(timer);
    }

    if (newClickCount >= 5) {
      router.push('/quickthinker');
      setEasterEggClicks(0);
      setShowEasterEggHint(false);
    }
  }, [easterEggClicks, router]);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={showEasterEggHint}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEasterEggClick}
            aria-label="Surprise"
            className="text-foreground hover:text-primary hover:bg-primary/10 p-0 h-auto w-auto" // Adjusted size to fit logo naturally
          >
            <Logo className="h-8" /> {/* Increased logo size from h-7 to h-8 */}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {easterEggClicks < 5 ? (
            <p>Click {Math.max(0, 5 - easterEggClicks)} more times for a surprise!</p>
          ) : (
            <p>Surprise awaits!</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
