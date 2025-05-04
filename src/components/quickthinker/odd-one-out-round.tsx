
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Removed unused icon imports: Square, Circle, Triangle, Star
import { cn } from '@/lib/utils';

interface OddOneOutRoundProps {
  roundData: {
    options: { id: number; icon: React.ElementType; isOdd: boolean }[];
    title: string;
  };
  onComplete: (isCorrect: boolean) => void;
}

// Basic shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


export const OddOneOutRound: FC<OddOneOutRoundProps> = ({ roundData, onComplete }) => {
  const [shuffledOptions, setShuffledOptions] = useState<typeof roundData.options>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

   // Shuffle options on mount
  useEffect(() => {
    setShuffledOptions(shuffleArray([...roundData.options]));
  }, [roundData.options]);


  const handleSelect = (option: typeof roundData.options[0]) => {
     if (isAnswered) return; // Prevent selecting after answering

    setSelectedId(option.id);
    setIsAnswered(true);

    // Check if correct and notify parent after a short delay for visual feedback
    const isCorrect = option.isOdd;
    setTimeout(() => {
       onComplete(isCorrect);
    }, 300); // Reduced delay from 800ms to 300ms
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">{roundData.title}</h3>
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        {shuffledOptions.map((option) => {
           const IconComponent = option.icon;
           const isSelected = selectedId === option.id;
           const isCorrectChoice = isSelected && option.isOdd;
           const isIncorrectChoice = isSelected && !option.isOdd;

           return (
             <Button
                key={option.id}
                variant="outline"
                className={cn(
                  "aspect-square h-28 w-full md:h-32 flex items-center justify-center rounded-[var(--radius)] transition-all duration-300 ease-out",
                  "bg-background/50 border-primary/20 hover:bg-primary/10", // Base glass-like style
                  isAnswered && !isSelected && "opacity-50 cursor-not-allowed", // Fade out unselected options
                  isSelected && "scale-105 shadow-lg", // Highlight selected
                  isCorrectChoice && "bg-green-500/20 border-green-500 ring-2 ring-green-500/50", // Correct feedback
                  isIncorrectChoice && "bg-red-500/20 border-red-500 ring-2 ring-red-500/50 animate-shake", // Incorrect feedback + shake animation
                  !isAnswered && "hover:scale-105 hover:shadow-primary/20" // Hover effect before answering
                 )}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
             >
               <IconComponent className={cn(
                    "h-12 w-12 md:h-16 md:w-16 transition-colors",
                    isSelected ? "text-white" : "text-primary" // Change icon color on select feedback
                    )} strokeWidth={2} />
            </Button>
           );
          })}
      </div>

      {/* Basic keyframe for shake animation */}
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
