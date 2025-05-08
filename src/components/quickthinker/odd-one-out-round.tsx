
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OddOneOutData, OddOneOutOption } from '@/types/quickthinker';
import { getIconComponent } from '@/lib/quickthinker-rounds';

interface OddOneOutRoundProps {
  roundData: OddOneOutData;
  onComplete: (isCorrect: boolean) => void;
}

export const OddOneOutRound: FC<OddOneOutRoundProps> = ({ roundData, onComplete }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setIsAnswered(false);
  }, [roundData]);

  const handleSelect = (option: OddOneOutOption) => {
    if (isAnswered) return;

    setSelectedId(option.id);
    setIsAnswered(true);

    const isCorrect = option.isOdd;
    // Short delay for visual feedback before calling onComplete
    requestAnimationFrame(() => {
      setTimeout(() => {
        onComplete(isCorrect);
      }, 250); // Adjusted to 250ms for quicker feedback
    });
  };

  const optionsToRender = roundData.options;

  return (
    <div className="flex flex-col items-center w-full max-w-md p-4 md:p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6 text-center">{roundData.title}</h3>
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        {optionsToRender.map((option) => {
          const IconComponent = getIconComponent(option.iconName);
          const isSelected = selectedId === option.id;
          const isCorrectChoice = isSelected && option.isOdd;
          const isIncorrectChoice = isSelected && !option.isOdd;

          return (
            <Button
              key={`${roundData.title}-option-${option.id}`}
              variant="outline"
              className={cn(
                "aspect-square h-28 w-full md:h-32 flex items-center justify-center rounded-[var(--radius)] transition-all duration-300 ease-out",
                "bg-background/50 border-primary/20 hover:bg-primary/10",
                isAnswered ? 'cursor-not-allowed' : 'hover:scale-105 hover:shadow-primary/20',
                isAnswered && !isSelected && "opacity-50",
                isSelected && "scale-105 shadow-lg",
                isCorrectChoice && "bg-green-500/20 border-green-500 ring-2 ring-green-500/50",
                isIncorrectChoice && "bg-red-500/20 border-red-500 ring-2 ring-red-500/50 animate-shake"
              )}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              aria-label={`Option ${option.id}`}
            >
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "h-12 w-12 md:h-16 md:w-16 transition-colors",
                    isSelected && isAnswered ? "text-white" : "text-primary"
                  )}
                  strokeWidth={1.5}
                />
              )}
            </Button>
          );
        })}
      </div>

      {/* Placed style jsx block inside the main returned div */}
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
