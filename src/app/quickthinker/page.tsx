
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next'; // Import Metadata type if needed for client-side updates

import { GameStart } from '@/components/quickthinker/game-start';
import { GameResults } from '@/components/quickthinker/game-results';
// Import specific round components
import { OddOneOutRound } from '@/components/quickthinker/odd-one-out-round';
import { SpeedMathRound } from '@/components/quickthinker/speed-math-round'; // Import SpeedMathRound
// Import other round components as they are created
// import { ColorCatchRound } from '@/components/quickthinker/color-catch-round';
// ... etc.

import type { GameState, RoundResult, GameRound, GameStatus } from '@/types/quickthinker';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Utility to generate game rounds
import { generateGameRounds, generateSpeedMath } from '@/lib/quickthinker-rounds'; // Import generateSpeedMath

// Metadata (Consider moving to layout or making this a Server Component if SEO is crucial)
// Static metadata for Client Components might not be fully effective for SEO.
/*
export const metadata: Metadata = {
  title: 'QuickThinker Test - Challenge Your Mind',
  description: 'Test your logic, memory, and reflexes with the QuickThinker challenge by Mathenge Inc. Fast-paced fun for everyone!',
};
*/
// TODO: Consider Server Component for better metadata handling

const TOTAL_ROUNDS = 5; // Define the total number of rounds
const LEVEL_2_THRESHOLD_MS = 3000; // 3 seconds threshold for Level 2

export default function QuickThinkerPage() {
  const { toast } = useToast(); // Initialize toast
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    score: 0,
    totalTimeMs: 0,
    results: [],
    startTime: null,
    level: 1, // Initialize level
  });
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For loading state between rounds

  // Generate rounds when the component mounts or game restarts
  useEffect(() => {
    if (gameState.status === 'idle') {
      setGameRounds(generateGameRounds(TOTAL_ROUNDS));
    }
  }, [gameState.status]);

  const startGame = useCallback(() => {
    // Ensure rounds are generated before starting
     const initialRounds = generateGameRounds(TOTAL_ROUNDS);
     setGameRounds(initialRounds);
    setGameState({
      status: 'playing',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      totalTimeMs: 0,
      results: [],
      startTime: Date.now(), // Start timer for the first round
      level: 1, // Reset level
    });
    setIsLoading(false);
  }, []);

  const handleRoundComplete = useCallback((isCorrect: boolean) => {
    setIsLoading(true); // Show loader

    const endTime = Date.now();
    const timeTaken = gameState.startTime ? endTime - gameState.startTime : 0;

    const newResult: RoundResult = {
      roundIndex: gameState.currentRound,
      correct: isCorrect,
      timeTakenMs: timeTaken,
    };

    const nextRoundIndex = gameState.currentRound + 1;
    const newScore = gameState.score + (isCorrect ? 1 : 0);
    const newTotalTime = gameState.totalTimeMs + timeTaken;
    let nextLevel = gameState.level;
    let proceedToNextRound = true;

    // --- Level Progression Logic ---
    if (gameState.level === 1 && gameState.currentRound === 0) { // Check after the first round (odd-one-out)
      if (isCorrect && timeTaken <= LEVEL_2_THRESHOLD_MS) {
        nextLevel = 2;
        // Replace remaining rounds with Level 2 (speed-math) rounds
        const level2Rounds = [gameRounds[0]]; // Keep the first round result
        for (let i = 1; i < TOTAL_ROUNDS; i++) {
            level2Rounds.push(generateSpeedMath());
        }
        setGameRounds(level2Rounds);
        toast({
          title: "Level Up!",
          description: "Impressive speed! Get ready for Level 2: Speed Math!",
          // variant: "success" // Optional: Add success variant if defined
        });
      } else if (!isCorrect || timeTaken > LEVEL_2_THRESHOLD_MS) {
        // Player didn't qualify for Level 2
        toast({
          title: "Challenge Update",
          description: isCorrect
            ? "Good job, but try to be faster next time to unlock Level 2!"
            : "Keep practicing! Accuracy and speed unlock the next level.",
          variant: "default",
        });
         // Continue with the originally generated Level 1 rounds
      }
    }
    // --- End Level Progression Logic ---


    // Reduce delay for faster transition
    setTimeout(() => {
       if (proceedToNextRound && nextRoundIndex < gameState.totalRounds) {
        setGameState((prev) => ({
          ...prev,
          currentRound: nextRoundIndex,
          score: newScore,
          totalTimeMs: newTotalTime,
          results: [...prev.results, newResult],
          startTime: Date.now(), // Start timer for the next round
          level: nextLevel, // Update level
        }));
        setIsLoading(false);
      } else {
        // Game Finished
        setGameState((prev) => ({
          ...prev,
          status: 'finished',
          score: newScore,
          totalTimeMs: newTotalTime,
          results: [...prev.results, newResult],
          startTime: null, // Game finished
          level: nextLevel,
        }));
        setIsLoading(false);
      }
    }, 200); // Reduced delay

  }, [gameState, toast]); // Added toast to dependencies

  const restartGame = useCallback(() => {
     // Reset state and generate new rounds
    setGameState({
      status: 'idle',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      totalTimeMs: 0,
      results: [],
      startTime: null,
      level: 1, // Reset level
    });
    setIsLoading(false);
     // Regeneration of rounds is handled by the useEffect hook based on 'idle' status
  }, []);

  const renderCurrentRound = () => {
    if (isLoading || gameRounds.length === 0 || gameState.currentRound >= gameRounds.length) {
      return (
         <div className="flex items-center justify-center h-64">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
         </div>
      );
    }

    const currentRoundData = gameRounds[gameState.currentRound];

    switch (currentRoundData.type) {
      case 'odd-one-out':
        // Ensure we pass the correct data structure
        return <OddOneOutRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      case 'speed-math':
         // Ensure we pass the correct data structure
        return <SpeedMathRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // Add cases for other round types here as they are implemented
      // case 'color-catch':
      //   return <ColorCatchRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // ... etc.
      default:
         console.error("Unknown round type:", currentRoundData.type);
        // Handle unknown type gracefully, maybe skip round or show error
         setTimeout(() => handleRoundComplete(false), 100); // Mark as incorrect and move on
        return <p className="text-destructive">Error: Loading next challenge...</p>;
    }
  };

  return (
    <div className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        "bg-background" // Ensure theme background is applied
        )}>
      {/* Game Title - only shown on start */}
       {gameState.status === 'idle' && (
            <h1 className="text-4xl font-bold tracking-wide mb-12 text-center text-foreground">
             QuickThinker Challenge
            </h1>
       )}

        {/* Conditional Rendering based on Game Status */}
        {gameState.status === 'idle' && <GameStart onStartGame={startGame} />}

        {gameState.status === 'playing' && (
             <div className="w-full flex flex-col items-center max-w-2xl"> {/* Constrain width */}
                {/* Progress Indicator */}
                <div className="w-full mb-8">
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                       <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((gameState.currentRound + 1) / gameState.totalRounds) * 100}%` }}
                       />
                    </div>
                     <p className="text-center text-sm text-muted-foreground mt-2">
                        Level {gameState.level} - Round {gameState.currentRound + 1} of {gameState.totalRounds}
                    </p>
                </div>
                 {/* Centered container for the round content */}
                 <div className="flex justify-center w-full">
                   {renderCurrentRound()}
                 </div>
             </div>
        )}

        {gameState.status === 'finished' && <GameResults gameState={gameState} onRestart={restartGame} />}

       {/* Footer Info */}
       <p className="mt-12 text-muted-foreground text-xs font-normal absolute bottom-4">
           (A QuickThinker game by Mathenge Inc.)
       </p>
    </div>
  );
}
