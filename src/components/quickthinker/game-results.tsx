
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Award, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameState } from '@/types/quickthinker';

interface GameResultsProps {
  gameState: GameState;
  onRestart: () => void;
}

// New Scoring Logic (combines accuracy and speed)
const calculateScore = (correctAnswers: number, totalRounds: number, totalTimeMs: number): number => {
  if (totalRounds === 0) return 0;
  const accuracyRatio = correctAnswers / totalRounds;
  // Max time influence: assumes average 10s per round max = 100s for 10 rounds
  const maxTotalTime = totalRounds * 10000;
  // Time penalty factor: less time = higher factor (closer to 1), more time = lower factor (closer to 0)
  // Ensure time factor doesn't go below 0 if time exceeds max somehow
  const timeFactor = Math.max(0, (maxTotalTime - totalTimeMs) / maxTotalTime);

  // Weighted score: e.g., 70% accuracy, 30% speed bonus
  const score = Math.round((accuracyRatio * 70) + (accuracyRatio * timeFactor * 30)) * 10; // Scale to ~1000 max
  return Math.min(1000, score); // Cap score at 1000
};


// Simplified rating based on the new score
const getRating = (finalScore: number): string => {
  if (finalScore >= 900) return "Almost Genius!";
  if (finalScore >= 750) return "Fast & Focused";
  if (finalScore >= 600) return "Quick Thinker";
  if (finalScore >= 400) return "Brainstormer";
  return "Keep Practicing!";
};

// Simplified placeholder percentile based on score
const getPercentile = (finalScore: number): number => {
   // Map score (0-1000) to percentile (0-99.9) roughly, more precise now
   const percentile = Math.min(99.9, Math.max(0, (finalScore / 1000) * 99.9));
   return percentile;
}


export const GameResults: FC<GameResultsProps> = ({ gameState, onRestart }) => {
  const { score: correctAnswers, totalRounds, totalTimeMs } = gameState;
  const finalScore = calculateScore(correctAnswers, totalRounds, totalTimeMs);
  const accuracy = totalRounds > 0 ? (correctAnswers / totalRounds) * 100 : 0;
  const averageTime = totalRounds > 0 ? (totalTimeMs / totalRounds / 1000).toFixed(1) : '0.0';
  const rating = getRating(finalScore);
  const percentile = getPercentile(finalScore);
  const topRankPercentage = (100 - percentile).toFixed(1); // Calculate Top % and format to one decimal place


  return (
    <div className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-[var(--radius)] w-full max-w-lg",
        "glass-card-glow border border-primary/30 shadow-xl shadow-primary/15",
        "bg-background/75 backdrop-blur-xl"
        )}>
      <Award className="h-16 w-16 text-primary mb-5" />
      <h2 className="text-3xl font-bold tracking-wide mb-3 text-foreground">
        Test Complete!
      </h2>
      <p className="text-xl font-semibold text-primary mb-6">{rating}</p>

       {/* Display Final Score */}
       <div className="mb-8">
          <p className="text-sm text-muted-foreground font-normal mb-1">Your Score</p>
          <p className="text-5xl font-bold text-primary">{finalScore}</p>
       </div>


      <div className="grid grid-cols-2 gap-4 w-full mb-8 text-left">
         {/* Accuracy */}
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-foreground">{accuracy.toFixed(0)}%</p>
             <p className="text-xs text-muted-foreground/80">({correctAnswers}/{totalRounds} correct)</p>
         </div>
         {/* Average Time */}
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground font-normal mb-1">Avg. Time</p>
             <p className="text-2xl font-bold text-foreground">{averageTime}s</p>
             <p className="text-xs text-muted-foreground/80">per question</p>
         </div>
         {/* Rank */}
         <div className="glass-card bg-background/30 p-4 rounded-lg border border-white/10 col-span-2 text-center">
            <p className="text-sm text-muted-foreground font-normal mb-1">Rank (Approx.)</p>
            {/* Updated to display rank percentage to the nearest tenth */}
            <p className="text-2xl font-bold text-foreground">Top {topRankPercentage}%</p>
             <p className="text-xs text-muted-foreground/80">compared to other players</p>
         </div>
      </div>

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

