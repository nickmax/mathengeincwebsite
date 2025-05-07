
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SpeedMathData } from '@/types/quickthinker';

interface SpeedMathRoundProps {
  roundData: SpeedMathData;
  onComplete: (selectedAnswer: number) => void; // Pass the chosen number
}

export const SpeedMathRound: FC<SpeedMathRoundProps> = ({ roundData, onComplete }) => {
  const [selectedOptionValue, setSelectedOptionValue] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOptionValue(null);
    setIsAnswered(false);
  }, [roundData.question]);


  const handleSelect = (optionValue: number) => {
    if (isAnswered) return;

    setSelectedOptionValue(optionValue);
    setIsAnswered(true);

    requestAnimationFrame(() => {
        setTimeout(() => {
          onComplete(optionValue); // Pass the selected numerical answer
        }, 250);
    });
  };

   const optionsToRender = roundData.options; // These are numbers

  return (
    <div className="flex flex-col items-center w-full max-w-md p-4 md:p-6">
      <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">{roundData.question}</h3>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {optionsToRender.map((option) => {
          const isSelected = selectedOptionValue === option;
          // Correctness is determined by comparing the selected option with roundData.answer
          const isCorrectChoice = isSelected && option === roundData.answer;
          const isIncorrectChoice = isSelected && option !== roundData.answer;

          return (
            <Button
              key={`${roundData.question}-option-${option}`}
              variant="outline"
              className={cn(
                "h-20 w-full text-xl md:text-2xl font-bold flex items-center justify-center rounded-[var(--radius)] transition-all duration-300 ease-out",
                "bg-background/50 border-primary/20",
                isAnswered ? 'cursor-not-allowed' : 'hover:bg-primary/10 hover:scale-105 hover:shadow-primary/20',
                isAnswered && !isSelected && "opacity-50",
                isSelected && "scale-105 shadow-lg",
                isSelected && isAnswered && "text-white",
                isCorrectChoice && "bg-green-500/20 border-green-500 ring-2 ring-green-500/50",
                isIncorrectChoice && "bg-red-500/20 border-red-500 ring-2 ring-red-500/50 animate-shake"
              )}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              aria-label={`Answer ${option}`}
            >
              {option}
            </Button>
          );
        })}
      </div>

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
