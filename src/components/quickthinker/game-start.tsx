
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameStartProps {
  onStartGame: () => void;
}

export const GameStart: FC<GameStartProps> = ({ onStartGame }) => {
  return (
    <div className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-[var(--radius)]",
        "glass-card-glow border border-primary/20 shadow-lg shadow-primary/10",
         "bg-background/70 backdrop-blur-xl" // Apply glass effect
        )}>
      <BrainCircuit className="h-16 w-16 text-primary mb-6 animate-pulse" />
      <h2 className="text-3xl font-bold tracking-wide mb-3 text-foreground">
        QuickThinker Test
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm font-normal">
        Challenge your logic, memory, and reflexes in a series of fast-paced mini-games. Ready to test your brainpower?
      </p>
      <Button
        size="lg"
        onClick={onStartGame}
        className="font-semibold btn-primary-gradient shadow-[0_0_24px_hsl(var(--primary)/0.6)]"
      >
        Start Test
      </Button>
      <p className="text-xs text-muted-foreground/70 mt-6 font-normal">
        (Takes about 60-90 seconds)
      </p>
    </div>
  );
};
