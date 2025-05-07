'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { GameStart } from '@/components/quickthinker/game-start';
import { GameResults } from '@/components/quickthinker/game-results';
import { SpeedMathRound } from '@/components/quickthinker/speed-math-round';
import { LogicMCQRound } from '@/components/quickthinker/logic-mcq-round';
import { OddOneOutRound } from '@/components/quickthinker/odd-one-out-round';
import type { GameRound, GameState, RoundResult, OddOneOutData, SpeedMathData, LogicMCQData } from '@/types/quickthinker';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trophy } from 'lucide-react';
import { generateQuickThinkerRounds } from '@/lib/quickthinker-rounds';
import { cn } from '@/lib/utils';

const TOTAL_ROUNDS = 10;
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
    
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);
    const roundStartTimeRef = useRef<number | null>(null);
    const isAnswerSubmittedRef = useRef(false);

    const handleRoundEnd = useCallback((isCorrect: boolean | null, timeTaken: number) => {
        setGameState(prev => {
            if (prev.status !== 'playing') return prev;

            const newResult: RoundResult = { roundIndex: prev.currentRound, correct: !!isCorrect, timeTakenMs: timeTaken };
            const newScore = isCorrect ? prev.score + 1 : prev.score;
            const newTotalTimeMs = prev.totalTimeMs + timeTaken;
            const newResults = [...prev.results, newResult];

            if (prev.currentRound < rounds.length - 1) {
                isAnswerSubmittedRef.current = false;
                // setRoundStartTime will be handled by the useEffect for the new round
                return {
                    ...prev,
                    score: newScore,
                    totalTimeMs: newTotalTimeMs,
                    results: newResults,
                    currentRound: prev.currentRound + 1,
                };
            } else {
                // Game finished
                if (timerIdRef.current) {
                    clearInterval(timerIdRef.current);
                    timerIdRef.current = null;
                }
                return {
                    ...prev,
                    status: 'finished',
                    score: newScore,
                    totalTimeMs: newTotalTimeMs,
                    results: newResults,
                    currentRound: prev.currentRound + 1, // currentRound will be totalRounds
                };
            }
        });
    }, [rounds.length]);


    const startGame = useCallback(() => {
        const generatedRounds = generateQuickThinkerRounds(TOTAL_ROUNDS);
        setRounds(generatedRounds);
        setGameState({
            status: 'playing',
            currentRound: 0,
            totalRounds: generatedRounds.length,
            score: 0,
            totalTimeMs: 0,
            results: [],
            startTime: Date.now(),
        });
        isAnswerSubmittedRef.current = false;
        // roundStartTimeRef and timer will be set by useEffect
    }, []);

    useEffect(() => {
        if (gameState.status === 'playing' && !isAnswerSubmittedRef.current && gameState.currentRound < rounds.length) {
            const currentRoundData = rounds[gameState.currentRound];
            const timeLimit = currentRoundData?.timeLimitMs || ROUND_TIME_LIMIT_MS;
            
            setTimeLeft(timeLimit);
            roundStartTimeRef.current = Date.now();

            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
            }

            const newTimerId = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 100) {
                        clearInterval(newTimerId);
                        timerIdRef.current = null;
                        const elapsed = Date.now() - (roundStartTimeRef.current || Date.now());
                        handleRoundEnd(false, Math.min(elapsed, timeLimit));
                        return 0;
                    }
                    return prevTime - 100;
                });
            }, 100);
            timerIdRef.current = newTimerId;

            return () => {
                if (timerIdRef.current) {
                     clearInterval(timerIdRef.current);
                     timerIdRef.current = null;
                }
            };
        } else if (gameState.status !== 'playing' && timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
    }, [gameState.status, gameState.currentRound, rounds, handleRoundEnd]);


    const handleComplete = useCallback((isCorrect: boolean) => {
        if (isAnswerSubmittedRef.current || gameState.status !== 'playing' || gameState.currentRound >= rounds.length) return;

        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
        isAnswerSubmittedRef.current = true; // Mark as submitted

        const timeTaken = Date.now() - (roundStartTimeRef.current || Date.now());
        const currentRound = rounds[gameState.currentRound];

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
                description: `Answer: ${currentRound.correctAnswer}`, // Ensure correctAnswer is displayable
                className: "border-red-500",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            });
        }

        setTimeout(() => {
            handleRoundEnd(isCorrect, timeTaken);
        }, 1200);
    }, [gameState.status, gameState.currentRound, gameState.score, rounds, toast, handleRoundEnd]);
    

    const renderRound = () => {
        if (gameState.status !== 'playing' || gameState.currentRound >= rounds.length || !rounds[gameState.currentRound]) {
            return null;
        }

        const round = rounds[gameState.currentRound];

        switch (round.type) {
            case 'speed-math':
                return <SpeedMathRound roundData={round.data as SpeedMathData} onComplete={handleComplete} />;
            case 'logic-mcq':
                return <LogicMCQRound roundData={round.data as LogicMCQData} onComplete={handleComplete} />;
            case 'odd-one-out':
                return <OddOneOutRound roundData={round.data as OddOneOutData} onComplete={handleComplete} />;
            default:
                console.warn("Unknown round type:", (round as any).type);
                const timeTaken = Date.now() - (roundStartTimeRef.current || Date.now());
                handleRoundEnd(null, timeTaken); // Skip unknown round
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
                        "glass-card" 
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

    