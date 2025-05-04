
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next'; // Import Metadata type if needed for client-side updates

import { GameStart } from '@/components/quickthinker/game-start';
import { GameResults } from '@/components/quickthinker/game-results';
// Import specific round components (only OddOneOut for now)
import { OddOneOutRound } from '@/components/quickthinker/odd-one-out-round';

import type { GameState, RoundResult, GameRound, GameStatus } from '@/types/quickthinker';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Example round definitions (replace with actual game logic)
import { generateGameRounds } from '@/lib/quickthinker-rounds'; // We'll create this utility

// Metadata (Consider moving to layout or making this a Server Component if SEO is crucial)
/* export const metadata: Metadata = {
  title: 'QuickThinker Test - Challenge Your Mind',
  description: 'Test your logic, memory, and reflexes with the QuickThinker challenge by Mathenge Inc. Fast-paced fun for everyone!',
  robots: 'noindex, nofollow', // Discourage indexing for the game page itself if desired
}; */

const TOTAL_ROUNDS = 5; // Define the total number of rounds

export default function QuickThinkerPage() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    score: 0,
    totalTimeMs: 0,
    results: [],
    startTime: null,
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
    setGameState({
      status: 'playing',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      totalTimeMs: 0,
      results: [],
      startTime: Date.now(), // Start timer for the first round
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

    const nextRound = gameState.currentRound + 1;
    const newScore = gameState.score + (isCorrect ? 1 : 0);
    const newTotalTime = gameState.totalTimeMs + timeTaken;

    setTimeout(() => { // Simulate transition delay
       if (nextRound < gameState.totalRounds) {
        setGameState((prev) => ({
          ...prev,
          currentRound: nextRound,
          score: newScore,
          totalTimeMs: newTotalTime,
          results: [...prev.results, newResult],
          startTime: Date.now(), // Start timer for the next round
        }));
        setIsLoading(false);
      } else {
        setGameState((prev) => ({
          ...prev,
          status: 'finished',
          score: newScore,
          totalTimeMs: newTotalTime,
          results: [...prev.results, newResult],
          startTime: null, // Game finished
        }));
        setIsLoading(false);
      }
    }, 500); // Delay to show loader/transition

  }, [gameState]);

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
        return <OddOneOutRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // Add cases for other round types here
      // case 'speed-math':
      //   return <SpeedMathRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // ... etc.
      default:
        return <p className="text-destructive">Error: Unknown round type.</p>;
    }
  };

  return (
    <div className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        "bg-background" // Ensure theme background is applied
        )}>
      {/* Game Title */}
       {!['playing', 'finished'].includes(gameState.status) && (
            <h1 className="text-3xl font-bold tracking-wide mb-8 text-foreground">
             {/* Title shown on start screen, adjusted in GameStart component */}
            </h1>
       )}

        {/* Conditional Rendering based on Game Status */}
        {gameState.status === 'idle' && <GameStart onStartGame={startGame} />}

        {gameState.status === 'playing' && (
             <div className="w-full flex flex-col items-center">
                {/* Progress Indicator (Optional) */}
                <div className="w-full max-w-md mb-6">
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                       <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((gameState.currentRound + 1) / gameState.totalRounds) * 100}%` }}
                       />
                    </div>
                     <p className="text-center text-sm text-muted-foreground mt-2">
                        Round {gameState.currentRound + 1} of {gameState.totalRounds}
                    </p>
                </div>
                {renderCurrentRound()}
             </div>
        )}

        {gameState.status === 'finished' && <GameResults gameState={gameState} onRestart={restartGame} />}

       {/* Footer Link/Info */}
       <p className="mt-12 text-muted-foreground text-xs font-normal">
           (A QuickThinker game by Mathenge Inc.)
       </p>
    </div>
  );
}
