
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SpeedMathData } from '@/types/quickthinker'; // Import specific data type

interface SpeedMathRoundProps {
  roundData: SpeedMathData;
  onComplete: (isCorrect: boolean) => void;
}

export const SpeedMathRound: FC<SpeedMathRoundProps> = ({ roundData, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: number) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === roundData.answer;
    setTimeout(() => {
      onComplete(isCorrect);
    }, 300); // Short delay for feedback
  };

   // Reset state when roundData changes (new round starts)
   useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
   }, [roundData]);


  return (
    <div className="flex flex-col items-center w-full max-w-md p-6">
      <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">{roundData.question}</h3>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {roundData.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectChoice = isSelected && option === roundData.answer;
          const isIncorrectChoice = isSelected && option !== roundData.answer;

          return (
            <Button
              key={option}
              variant="outline"
              className={cn(
                "h-20 w-full text-xl md:text-2xl font-bold flex items-center justify-center rounded-[var(--radius)] transition-all duration-300 ease-out",
                "bg-background/50 border-primary/20 hover:bg-primary/10", // Base style
                isAnswered && !isSelected && "opacity-50 cursor-not-allowed", // Fade out others
                isSelected && "scale-105 shadow-lg", // Highlight selected
                isCorrectChoice && "bg-green-500/20 border-green-500 ring-2 ring-green-500/50 text-white", // Correct feedback
                isIncorrectChoice && "bg-red-500/20 border-red-500 ring-2 ring-red-500/50 text-white animate-shake", // Incorrect feedback + shake
                !isAnswered && "hover:scale-105 hover:shadow-primary/20" // Hover effect
              )}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
            >
              {option}
            </Button>
          );
        })}
      </div>

      {/* Re-include shake animation styles if not globally defined */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
