'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { GameStart } from '@/components/quickthinker/game-start'; // Assuming named export
import { GameResults } from '@/components/quickthinker/game-results'; // Changed to named import
import { SpeedMathRound } from '@/components/quickthinker/speed-math-round'; // Assuming named export
import { LogicMCQRound } from '@/components/quickthinker/logic-mcq-round'; // Assuming named export
import { OddOneOutRound } from '@/components/quickthinker/odd-one-out-round'; // Assuming named export
import type { GameRound, GameState, RoundResult } from '@/types/quickthinker'; // Updated import for GameRound
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trophy } from 'lucide-react';

// Utility to generate game rounds from the master pool
import { generateQuickThinkerRounds } from '@/lib/quickthinker-rounds'; // Assuming named export

const TOTAL_ROUNDS = 10; // Fixed number of rounds
const ROUND_TIME_LIMIT_MS = 10000; // 10 seconds per round default

export default function QuickThinkerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [gameState, setGameState] = useState<GameState>({
        status: 'idle',
        currentRound: 0,
        totalRounds: TOTAL_ROUNDS,
        score: 0,
        totalTimeMs: 0,
        results: [],
        startTime: null,
    });
    const [rounds, setRounds] = useState<GameRound[]>([]);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT_MS);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null); // Allow number for math
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [roundStartTime, setRoundStartTime] = useState<number | null>(null);

    const startGame = useCallback(() => {
        const generatedRounds = generateQuickThinkerRounds(TOTAL_ROUNDS);
        setRounds(generatedRounds);
        setGameState({
            status: 'playing',
            currentRound: 0,
            totalRounds: generatedRounds.length, // Use actual length
            score: 0,
            totalTimeMs: 0,
            results: [],
            startTime: Date.now(),
        });
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setRoundStartTime(Date.now()); // Start time for the first round
    }, []);

    const handleRoundEnd = useCallback((isCorrect: boolean | null, timeTaken: number) => {
        if (gameState.status !== 'playing') return;

        const currentRoundIndex = gameState.currentRound;
        const newResult: RoundResult = { roundIndex: currentRoundIndex, correct: !!isCorrect, timeTakenMs: timeTaken };

        setGameState(prev => ({
            ...prev,
            score: isCorrect ? prev.score + 1 : prev.score,
            totalTimeMs: prev.totalTimeMs + timeTaken,
            results: [...prev.results, newResult],
            currentRound: prev.currentRound + 1,
        }));

        // Move to next round or finish
        if (currentRoundIndex < rounds.length - 1) {
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
            setRoundStartTime(Date.now()); // Start time for the next round
        } else {
            setGameState(prev => ({ ...prev, status: 'finished' }));
            if (timerId) clearInterval(timerId); // Stop timer at the end
        }
    }, [gameState.status, gameState.currentRound, rounds.length, timerId]);

    const resetTimer = useCallback(() => {
        if (timerId) {
            clearInterval(timerId);
        }
        const currentRoundData = rounds[gameState.currentRound];
        const timeLimit = currentRoundData?.timeLimitMs || ROUND_TIME_LIMIT_MS;
        setTimeLeft(timeLimit);

        const newTimerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1000) { // Give a tiny buffer
                    clearInterval(newTimerId);
                     const elapsed = Date.now() - (roundStartTime || Date.now());
                    handleRoundEnd(false, elapsed > timeLimit ? timeLimit : elapsed); // Time ran out
                    return 0;
                }
                return prevTime - 100; // Update every 100ms for smoother progress bar
            });
        }, 100);
        setTimerId(newTimerId);
    }, [timerId, rounds, gameState.currentRound, roundStartTime, handleRoundEnd]);


    const handleAnswerSubmit = useCallback((answer: string | number) => {
        if (isAnswerSubmitted || gameState.status !== 'playing') return;

        if (timerId) clearInterval(timerId);
        setIsAnswerSubmitted(true);
        setSelectedAnswer(answer);

        const timeTaken = Date.now() - (roundStartTime || Date.now());
        const currentRound = rounds[gameState.currentRound];
        // Ensure type consistency for comparison, especially for math rounds
        const isCorrect = String(answer) === String(currentRound.correctAnswer);

        if (isCorrect) {
            toast({
                title: "Correct!",
                description: `+1 point! Score: ${gameState.score + 1}`,
                className: "border-green-500",
                icon: <Trophy className="h-4 w-4 text-green-500" />,
            });
        } else {
            toast({
                title: "Incorrect!",
                description: `The correct answer was: ${currentRound.correctAnswer}`,
                className: "border-red-500",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            });
        }

        setTimeout(() => {
            handleRoundEnd(isCorrect, timeTaken);
        }, 1200); // Shortened delay

    }, [gameState.currentRound, gameState.status, gameState.score, rounds, timerId, toast, isAnswerSubmitted, roundStartTime, handleRoundEnd]);

    useEffect(() => {
        if (gameState.status === 'playing' && !isAnswerSubmitted) {
            resetTimer();
        }
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [gameState.status, gameState.currentRound, isAnswerSubmitted, resetTimer, timerId]);

    const renderRound = () => {
        if (gameState.status !== 'playing' || gameState.currentRound >= rounds.length) {
            return null;
        }

        const round = rounds[gameState.currentRound];
        const timeLimit = round.timeLimitMs || ROUND_TIME_LIMIT_MS;

        const handleComplete = (isCorrect: boolean) => {
            if (isAnswerSubmitted) return; // Prevent double submissions from component
            setIsAnswerSubmitted(true);
            if (timerId) clearInterval(timerId);
            const timeTaken = Date.now() - (roundStartTime || Date.now());
            setSelectedAnswer(isCorrect ? round.correctAnswer : null); // Show correct answer if wrong? Maybe just feedback.

             if (isCorrect) {
                 toast({ title: "Correct!", description: `+1 point! Score: ${gameState.score + 1}`, className: "border-green-500", icon: <Trophy className="h-4 w-4 text-green-500" /> });
             } else {
                 toast({ title: "Incorrect!", description: `Answer: ${round.correctAnswer}`, className: "border-red-500", icon: <AlertCircle className="h-4 w-4 text-red-500" /> });
             }

            setTimeout(() => {
                 handleRoundEnd(isCorrect, timeTaken);
            }, 1200);
        };

        switch (round.type) {
            case 'speed-math':
                return <SpeedMathRound roundData={round.data as any} onComplete={handleComplete} />;
            case 'logic-mcq':
                 // Casting data because TS might not infer correctly from the union type
                return <LogicMCQRound roundData={round.data as any} onComplete={handleComplete} />;
            case 'odd-one-out':
                return <OddOneOutRound roundData={round.data as any} onComplete={handleComplete} />;
            // Add cases for other round types here
            // case 'memory-recall':
            //     return <MemoryRecallRound roundData={round.data} onComplete={handleComplete} />;
            default:
                console.warn("Unknown round type:", round.type);
                // Skip round or show error? Skipping for now.
                // Directly call handleRoundEnd to skip this unknown round
                const timeTaken = Date.now() - (roundStartTime || Date.now());
                handleRoundEnd(null, timeTaken);
                return <p>Loading next round...</p>;
        }
    };

    const currentRoundData = rounds[gameState.currentRound];
    const timeLimitForProgress = currentRoundData?.timeLimitMs || ROUND_TIME_LIMIT_MS;


    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">


            {gameState.status === 'idle' && (
                <GameStart onStartGame={startGame} />
            )}

            {gameState.status === 'playing' && rounds.length > 0 && gameState.currentRound < rounds.length && (
                <div className="w-full max-w-md text-center">
                     <div className="mb-8">
                         <h1 className="text-3xl font-bold mb-2">QuickThinker Challenge</h1>
                         <p className="text-muted-foreground font-normal">Round {gameState.currentRound + 1} of {gameState.totalRounds}</p>
                     </div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-lg font-semibold tabular-nums">Score: {gameState.score}</span>
                        <span className="text-sm text-muted-foreground tabular-nums">Time: {(timeLeft / 1000).toFixed(1)}s</span>
                    </div>
                    <Progress value={(timeLeft / timeLimitForProgress) * 100} className="w-full mb-6 h-2" />
                    <div className={cn(
                        "rounded-[var(--radius)] border bg-card text-card-foreground shadow-sm p-6 md:p-8",
                        "glass-card" // Apply glass effect
                        )}>
                        {renderRound()}
                    </div>
                </div>
            )}

            {gameState.status === 'finished' && (
                <GameResults gameState={gameState} onRestart={startGame} />
            )}
        </div>
    );
}
