
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LogicMCQData } from '@/types/quickthinker';

interface LogicMCQRoundProps {
  roundData: LogicMCQData;
  onComplete: (selectedAnswer: string) => void; // Pass the chosen string answer
}

export const LogicMCQRound: FC<LogicMCQRoundProps> = ({ roundData, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [roundData.question]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        onComplete(option); // Pass the selected string answer
      }, 300); 
    });
  };

  const optionsToRender = roundData.options;

  return (
    <div className="flex flex-col items-center w-full max-w-lg p-4 md:p-6">
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-8 text-center leading-relaxed">
        {roundData.question}
      </h3>
      <div className="grid grid-cols-1 gap-3 md:gap-4 w-full max-w-sm">
        {optionsToRender.map((option, index) => {
          const isSelected = selectedAnswer === option;
          // Correctness is determined by comparing the selected option with roundData.answer
          const isCorrectChoice = isSelected && option === roundData.answer;
          const isIncorrectChoice = isSelected && option !== roundData.answer;

          return (
            <Button
              key={`${roundData.question}-option-${index}`}
              variant="outline"
              className={cn(
                "h-auto min-h-[3.5rem] md:min-h-[4rem] w-full text-sm md:text-base font-medium flex items-center justify-center rounded-[var(--radius)] transition-all duration-300 ease-out py-2.5 md:py-3 px-4 text-left whitespace-normal",
                "bg-background/50 border-primary/20",
                isAnswered ? 'cursor-not-allowed' : 'hover:bg-primary/10 hover:scale-105 hover:shadow-primary/20',
                isAnswered && !isSelected && "opacity-50",
                isSelected && "scale-105 shadow-lg",
                isSelected && isAnswered && "text-white", // White text for answered selected option
                isCorrectChoice && "bg-green-500/20 border-green-500 ring-2 ring-green-500/50",
                isIncorrectChoice && "bg-red-500/20 border-red-500 ring-2 ring-red-500/50 animate-shake"
              )}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              aria-label={`Answer: ${option}`}
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
