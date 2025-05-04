
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStart } from '@/components/quickthinker/game-start';
import { GameResults } from '@/components/quickthinker/game-results';
import { OddOneOutRound } from '@/components/quickthinker/odd-one-out-round';
import { SpeedMathRound } from '@/components/quickthinker/speed-math-round';
import { LogicMCQRound } from '@/components/quickthinker/logic-mcq-round'; // Assuming you create this component
// Import other round components as needed

import type { GameState, RoundResult, GameRound, GameStatus, ChallengeType } from '@/types/quickthinker';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Utility to generate game rounds from the master pool
import { generateGameRounds } from '@/lib/quickthinker-rounds';

const TOTAL_ROUNDS = 10; // Now fixed at 10 rounds from the pool
const ROUND_TIME_LIMIT_MS = 10000; // 10 seconds per round default

export default function QuickThinkerPage() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    score: 0,
    totalTimeMs: 0,
    results: [],
    startTime: null,
    // level removed
  });
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startRoundTimer = useCallback(() => {
    clearTimers();
    const currentRoundData = gameRounds[gameState.currentRound];
    const timeLimit = currentRoundData?.timeLimitMs ?? ROUND_TIME_LIMIT_MS;
    setTimeLeft(timeLimit);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prevTime - 100;
      });
    }, 100);

    timerRef.current = setTimeout(() => {
      toast({
        title: "Time's Up!",
        description: "Moving to the next round.",
        variant: "destructive",
      });
      handleRoundComplete(false); // Timeout means incorrect/no answer
    }, timeLimit);
  }, [clearTimers, toast, gameRounds, gameState.currentRound]); // Include dependencies


  // Generate rounds when the game starts
  useEffect(() => {
    if (gameState.status === 'playing' && gameRounds.length === 0) {
      const newRounds = generateGameRounds(TOTAL_ROUNDS);
      setGameRounds(newRounds);
    } else if (gameState.status === 'idle') {
        setGameRounds([]); // Clear rounds when idle
    }
  }, [gameState.status, gameRounds.length]);

  // Start timer when a new round begins and game is playing
  useEffect(() => {
    if (gameState.status === 'playing' && !isLoading && gameRounds.length > 0) {
      startRoundTimer();
    } else {
      clearTimers();
    }
    return () => clearTimers(); // Cleanup
  }, [gameState.status, gameState.currentRound, startRoundTimer, clearTimers, isLoading, gameRounds]); // Added gameRounds


  const startGame = useCallback(() => {
     setIsLoading(true); // Show loader briefly while generating rounds
     const newRounds = generateGameRounds(TOTAL_ROUNDS);
     setGameRounds(newRounds);
     setGameState({
        status: 'playing',
        currentRound: 0,
        totalRounds: TOTAL_ROUNDS,
        score: 0,
        totalTimeMs: 0,
        results: [],
        startTime: Date.now(), // Set start time for the first round
     });
     setTimeout(() => setIsLoading(false), 100); // Short delay then hide loader
  }, []);

  const handleRoundComplete = useCallback((isCorrect: boolean) => {
    if (gameState.status !== 'playing' || isLoading) return;

    clearTimers();
    setIsLoading(true);

    const endTime = Date.now();
    const currentRoundData = gameRounds[gameState.currentRound];
    const timeLimit = currentRoundData?.timeLimitMs ?? ROUND_TIME_LIMIT_MS;
    // Ensure startTime is not null, calculate time taken, capped at the limit
    const timeTaken = gameState.startTime ? Math.min(endTime - gameState.startTime, timeLimit) : timeLimit;

    const newResult: RoundResult = {
      roundIndex: gameState.currentRound,
      correct: isCorrect,
      timeTakenMs: timeTaken,
    };

    setGameState(prev => {
      const nextRoundIndex = prev.currentRound + 1;
      const newScore = prev.score + (isCorrect ? 1 : 0);
      const newTotalTime = prev.totalTimeMs + newResult.timeTakenMs;

      // Logic for game finished or next round
      if (nextRoundIndex < prev.totalRounds) {
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            currentRound: nextRoundIndex,
            score: newScore,
            totalTimeMs: newTotalTime,
            results: [...current.results, newResult],
            startTime: Date.now(), // Set start time for the next round
          }));
          setIsLoading(false);
          // Timer restarted by useEffect
        }, 300); // Short delay for feedback

        return { ...prev }; // Return intermediate state while loading
      } else {
        // Game Finished
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            status: 'finished',
            score: newScore,
            totalTimeMs: newTotalTime,
            results: [...current.results, newResult],
            startTime: null,
          }));
          setIsLoading(false);
        }, 300);

        return { ...prev }; // Return intermediate state
      }
    });
  }, [gameState, gameRounds, clearTimers, isLoading]); // Added gameRounds

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
    });
    setGameRounds([]); // Clear rounds
    setIsLoading(false);
  }, [clearTimers]);

  const renderCurrentRound = () => {
    if (isLoading || gameRounds.length === 0 || gameState.currentRound >= gameRounds.length) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      );
    }

    const currentRoundData = gameRounds[gameState.currentRound];

    if (!currentRoundData || !currentRoundData.data) {
      console.error("Missing data for round:", gameState.currentRound, currentRoundData);
      setTimeout(() => handleRoundComplete(false), 100); // Skip round
      return <p className="text-destructive">Error: Loading next challenge...</p>;
    }

    // Render component based on round type
    switch (currentRoundData.type) {
      case 'odd-one-out':
        return <OddOneOutRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      case 'speed-math':
        return <SpeedMathRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      case 'logic-mcq':
      case 'multiple-choice': // Handle generic multiple choice if needed, or use specific component
         return <LogicMCQRound roundData={currentRoundData.data} onComplete={handleRoundComplete} />;
      // Add cases for other round types here
      // case 'color-catch': return <ColorCatchRound ... />;
      // case 'memory-flash': return <MemoryFlashRound ... />;
      default:
        console.error("Unknown round type:", currentRoundData.type);
        setTimeout(() => handleRoundComplete(false), 100); // Skip unknown round
        return <p className="text-destructive">Error: Unknown challenge type.</p>;
    }
  };

  const currentRoundTimeLimit = gameRounds[gameState.currentRound]?.timeLimitMs ?? ROUND_TIME_LIMIT_MS;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen p-4",
      "bg-background text-foreground" // Ensure background and text colors are set
    )}>
      {gameState.status === 'idle' && (
        <h1 className="text-4xl font-bold tracking-wide mb-12 text-center">
          QuickThinker Challenge
        </h1>
      )}

      {gameState.status === 'idle' && <GameStart onStartGame={startGame} />}

      {gameState.status === 'playing' && (
        <div className="w-full flex flex-col items-center max-w-2xl">
          <div className="w-full mb-8 space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Round {gameState.currentRound + 1} of {gameState.totalRounds}</span>
               {/* Display Score During Game */}
               <span>Score: {gameState.score}</span>
            </div>
             {/* Progress bar for rounds */}
            <Progress value={((gameState.currentRound + 1) / gameState.totalRounds) * 100} className="h-2 bg-primary/20" />
             {/* Timer countdown bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/70 transition-all duration-100 ease-linear"
                style={{ width: `${(timeLeft / currentRoundTimeLimit) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-center w-full">
            {renderCurrentRound()}
          </div>
        </div>
      )}

      {gameState.status === 'finished' && <GameResults gameState={gameState} onRestart={restartGame} />}

      <p className="mt-12 text-muted-foreground text-xs font-normal absolute bottom-4">
        (A QuickThinker game by Mathenge Inc.)
      </p>
    </div>
  );
}
