
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Award, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameState, RoundResult } from '@/types/quickthinker';

interface GameResultsProps {
  gameState: GameState;
  onRestart: () => void;
}

// Simple function to get a rating based on score and time
const getRating = (score: number, totalRounds: number, totalTimeMs: number): string => {
  const accuracy = score / totalRounds;
  const averageTimePerRound = totalTimeMs / totalRounds / 1000; // in seconds

  if (accuracy >= 0.9 && averageTimePerRound < 5) return "Almost Genius!";
  if (accuracy >= 0.8 && averageTimePerRound < 7) return "Fast & Focused";
  if (accuracy >= 0.6) return "Quick Thinker";
  if (accuracy >= 0.4) return "Brainstormer";
  return "Needs Practice";
};

// Function to calculate percentage better than (example placeholder)
const getPercentile = (score: number, totalTimeMs: number): number => {
    // Placeholder logic: Higher score and lower time = better percentile
    // This would ideally compare against stored results or a distribution
    const timeFactor = Math.max(0, 100 - (totalTimeMs / 1000)); // Penalize longer times
    const scoreFactor = score * 10;
    let percentile = Math.min(99, Math.round((timeFactor + scoreFactor) / 2));
    // Add some randomness for demo purposes
    percentile = Math.min(99, percentile + Math.floor(Math.random() * 5));
    return percentile;
}

export const GameResults: FC<GameResultsProps> = ({ gameState, onRestart }) => {
  const { score, totalRounds, totalTimeMs, results } = gameState;
  const accuracy = totalRounds > 0 ? (score / totalRounds) * 100 : 0;
  const averageTime = totalRounds > 0 ? (totalTimeMs / totalRounds / 1000).toFixed(1) : 0;
  const rating = getRating(score, totalRounds, totalTimeMs);
  const percentile = getPercentile(score, totalTimeMs);


  return (
    <div className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-[var(--radius)] w-full max-w-lg",
        "glass-card-glow border border-primary/30 shadow-xl shadow-primary/15",
        "bg-background/75 backdrop-blur-xl" // Apply glass effect
        )}>
      <Award className="h-16 w-16 text-primary mb-5" />
      <h2 className="text-3xl font-bold tracking-wide mb-3 text-foreground">
        Test Complete!
      </h2>
      <p className="text-xl font-semibold text-primary mb-6">{rating}</p>

      <div className="grid grid-cols-2 gap-4 w-full mb-8 text-left">
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Score</p>
            <p className="text-2xl font-bold text-foreground">{score}/{totalRounds}</p>
         </div>
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-foreground">{accuracy.toFixed(0)}%</p>
         </div>
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Avg. Time</p>
             <p className="text-2xl font-bold text-foreground">{averageTime}s</p>
         </div>
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Rank</p>
            <p className="text-2xl font-bold text-foreground">Top {100 - percentile}%</p>
         </div>
      </div>

      {/* Optional: Share button
      <Button variant="outline" className="mb-4 w-full font-semibold">
         Share Your Brainpower
      </Button>
      */}

      <Button
        size="lg"
        onClick={onRestart}
        className="w-full font-semibold btn-primary-gradient"
      >
        <RefreshCw className="mr-2 h-5 w-5" />
        Try Again
      </Button>
    </div>
  );
};
