
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Progress } from '@/components/ui/progress'; // Import Progress component

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
const ROUND_TIME_LIMIT_MS = 10000; // 10 seconds per round

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
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT_MS); // Timer state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the round timer
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for the countdown interval


  // Function to clear existing timers
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
     if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function to start the round timer
  const startRoundTimer = useCallback(() => {
    clearTimers(); // Clear any existing timers
    setTimeLeft(ROUND_TIME_LIMIT_MS); // Reset time left

    // Start countdown interval for visual feedback
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 100) { // Stop interval near 0
           if (intervalRef.current) clearInterval(intervalRef.current);
           return 0;
        }
        return prevTime - 100;
      });
    }, 100);


    // Set timeout for the round limit
    timerRef.current = setTimeout(() => {
       toast({
            title: "Time's Up!",
            description: "Moving to the next round.",
            variant: "destructive",
       });
      handleRoundComplete(false); // Mark as incorrect if time runs out
    }, ROUND_TIME_LIMIT_MS);
  }, []); // Empty dependency array for useCallback


  // Generate rounds when the component mounts or game restarts
  useEffect(() => {
    if (gameState.status === 'idle') {
      const initialRounds = generateGameRounds(TOTAL_ROUNDS);
      setGameRounds(initialRounds);
    }
  }, [gameState.status]);

   // Start timer when a new round begins
   useEffect(() => {
    if (gameState.status === 'playing') {
      startRoundTimer();
    } else {
      clearTimers(); // Clear timers if game is not playing
    }

    // Cleanup function to clear timers on component unmount or status change
    return () => {
      clearTimers();
    };
  }, [gameState.status, gameState.currentRound, startRoundTimer]); // Depend on status and currentRound

  const startGame = useCallback(() => {
    const initialRounds = generateGameRounds(TOTAL_ROUNDS);
    setGameRounds(initialRounds);
    setGameState({
      status: 'playing',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      totalTimeMs: 0,
      results: [],
      startTime: Date.now(),
      level: 1,
    });
    setIsLoading(false);
     // Timer is started by the useEffect hook based on gameState.status
  }, []);

  const handleRoundComplete = useCallback((isCorrect: boolean) => {
    if (gameState.status !== 'playing') return; // Prevent multiple calls

    clearTimers(); // Stop the timer immediately
    setIsLoading(true); // Show loader

    const endTime = Date.now();
    const timeTaken = gameState.startTime ? endTime - gameState.startTime : 0;

    const newResult: RoundResult = {
      roundIndex: gameState.currentRound,
      correct: isCorrect,
      timeTakenMs: Math.min(timeTaken, ROUND_TIME_LIMIT_MS), // Cap time taken at the limit
    };

    const nextRoundIndex = gameState.currentRound + 1;
    const newScore = gameState.score + (isCorrect ? 1 : 0);
     // Add the capped time taken for this round to the total
    const newTotalTime = gameState.totalTimeMs + newResult.timeTakenMs;
    let nextLevel = gameState.level;
    let roundsToSet = gameRounds; // Use current rounds by default

    // --- Level Progression Logic ---
    if (gameState.level === 1 && gameState.currentRound === 0) { // Check after the first round (index 0)
      if (isCorrect && timeTaken <= LEVEL_2_THRESHOLD_MS) {
        nextLevel = 2;
        // Generate Level 2 rounds (speed-math)
        const level2Rounds = [gameRounds[0]]; // Keep the first round data
        for (let i = 1; i < TOTAL_ROUNDS; i++) {
            level2Rounds.push(generateSpeedMath());
        }
        roundsToSet = level2Rounds; // Update the rounds for level 2
        // setGameRounds(level2Rounds); // Set immediately or in the final state update
        toast({
          title: "Level Up!",
          description: "Impressive speed! Get ready for Level 2: Speed Math!",
        });
      } else { // Player didn't qualify for Level 2 after round 0
          // Level stays 1, continue with existing (potentially mixed) rounds
         toast({
          title: "Challenge Update",
          description: isCorrect
            ? "Good job! Try to be faster on the first round next time to unlock Level 2!"
            : "Keep practicing! Accuracy and speed on the first round unlock the next level.",
          variant: "default",
        });
      }
    }
    // --- End Level Progression Logic ---

    // Use a short delay for visual feedback before transitioning
    setTimeout(() => {
       if (nextRoundIndex < gameState.totalRounds) {
        setGameRounds(roundsToSet); // Update rounds if they changed for level 2
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
         // Timer is restarted by the useEffect hook
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
    }, 300); // Short delay for showing correctness feedback

  }, [gameState, toast, gameRounds]);

  const restartGame = useCallback(() => {
    clearTimers();
    setGameState({
      status: 'idle',
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      totalTimeMs: 0,
      results: [],
      startTime: null,
      level: 1,
    });
    setIsLoading(false);
     // Regeneration of rounds is handled by the useEffect hook based on 'idle' status
  }, []);

  const renderCurrentRound = () => {
     // Check if still loading or if rounds/data are unavailable
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
      case 'speed-math':
        return <SpeedMathRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // Add cases for other round types here
      default:
         console.error("Unknown round type:", currentRoundData.type);
         // Skip round automatically if type is unknown
         setTimeout(() => handleRoundComplete(false), 100);
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
                 {/* Progress Indicator & Timer */}
                <div className="w-full mb-8 space-y-2">
                     {/* Round Progress */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                         <span>Level {gameState.level} - Round {gameState.currentRound + 1} of {gameState.totalRounds}</span>
                         {/* Optionally show score: <span>Score: {gameState.score}</span> */}
                    </div>
                    <Progress value={((gameState.currentRound + 1) / gameState.totalRounds) * 100} className="h-2 bg-primary/20" />
                    {/* Time Left Progress Bar */}
                     <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                       <div
                        className="h-full bg-primary/70 transition-all duration-100 ease-linear" // Timer bar
                        style={{ width: `${(timeLeft / ROUND_TIME_LIMIT_MS) * 100}%` }}
                       />
                    </div>
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
