'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import GameStart from '@/components/quickthinker/game-start';
import GameResults from '@/components/quickthinker/game-results';
import SpeedMathRound from '@/components/quickthinker/speed-math-round';
import LogicMCQRound from '@/components/quickthinker/logic-mcq-round';
import OddOneOutRound from '@/components/quickthinker/odd-one-out-round';
import { QuickThinkerRound, GameState } from '@/types/quickthinker';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trophy } from 'lucide-react';

// Utility to generate game rounds from the master pool
import { generateQuickThinkerRounds } from '@/lib/quickthinker-rounds'; // Corrected import name

const TOTAL_ROUNDS = 10; // Now fixed at 10 rounds from the pool
const ROUND_TIME_LIMIT_MS = 10000; // 10 seconds per round default

export default function QuickThinkerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [gameState, setGameState] = useState<GameState>('start');
    const [rounds, setRounds] = useState<QuickThinkerRound[]>([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT_MS);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

    const startGame = useCallback(() => {
        // Generate unique rounds from the pool
        const generatedRounds = generateQuickThinkerRounds(TOTAL_ROUNDS);
        setRounds(generatedRounds);
        setCurrentRoundIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setGameState('playing');
    }, []); // No dependencies needed if generateQuickThinkerRounds is stable

    const resetTimer = useCallback(() => {
        if (timerId) {
            clearInterval(timerId);
        }
        setTimeLeft(ROUND_TIME_LIMIT_MS);
        const newTimerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1000) {
                    clearInterval(newTimerId);
                    handleRoundEnd(false); // Time ran out
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);
        setTimerId(newTimerId);
    }, [timerId]); // Depend on timerId

    const handleAnswerSubmit = useCallback((answer: string) => {
        if (isAnswerSubmitted) return; // Prevent multiple submissions

        if (timerId) clearInterval(timerId);
        setIsAnswerSubmitted(true);
        setSelectedAnswer(answer);

        const currentRound = rounds[currentRoundIndex];
        const isCorrect = answer === currentRound.correctAnswer;

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            toast({
                title: "Correct!",
                description: `+1 point! Score: ${score + 1}`, // Show updated score
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

        // Delay before moving to the next round or results
        setTimeout(() => {
            handleRoundEnd(isCorrect);
        }, 1500); // Show feedback for 1.5 seconds

    }, [currentRoundIndex, rounds, score, timerId, toast, isAnswerSubmitted]);


    const handleRoundEnd = useCallback((wasCorrect: boolean | null) => {
        if (currentRoundIndex < rounds.length - 1) {
            setCurrentRoundIndex((prevIndex) => prevIndex + 1);
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
        } else {
            setGameState('results');
        }
    }, [currentRoundIndex, rounds.length]);

    // Effect to start timer when game state is playing or round changes
    useEffect(() => {
        if (gameState === 'playing' && !isAnswerSubmitted) {
            resetTimer();
        }
        // Cleanup timer on component unmount or when round ends
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [gameState, currentRoundIndex, isAnswerSubmitted, resetTimer, timerId]); // Add timerId here

    const renderRound = () => {
        if (gameState !== 'playing' || currentRoundIndex >= rounds.length) {
            return null;
        }

        const round = rounds[currentRoundIndex];

        switch (round.type) {
            case 'speed-math':
                return <SpeedMathRound round={round} onSubmit={handleAnswerSubmit} selectedAnswer={selectedAnswer} isSubmitted={isAnswerSubmitted} />;
            case 'logic-mcq':
                return <LogicMCQRound round={round} onSubmit={handleAnswerSubmit} selectedAnswer={selectedAnswer} isSubmitted={isAnswerSubmitted} />;
            case 'odd-one-out':
                return <OddOneOutRound round={round} onSubmit={handleAnswerSubmit} selectedAnswer={selectedAnswer} isSubmitted={isAnswerSubmitted} />;
            default:
                return <p>Unknown round type</p>;
        }
    };

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-8">QuickThinker Challenge</h1>

            {gameState === 'start' && (
                <GameStart onStartGame={startGame} />
            )}

            {gameState === 'playing' && rounds.length > 0 && (
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Round {currentRoundIndex + 1} / {rounds.length}</span>
                        <span className="text-lg font-semibold">Score: {score}</span>
                    </div>
                    <Progress value={(timeLeft / ROUND_TIME_LIMIT_MS) * 100} className="w-full mb-4 h-3" />
                    <span className="text-sm text-muted-foreground">Time Left: {Math.ceil(timeLeft / 1000)}s</span>
                    <div className="mt-6">
                        {renderRound()}
                    </div>
                </div>
            )}

            {gameState === 'results' && (
                <GameResults score={score} totalRounds={rounds.length} onRestart={startGame} />
            )}
        </div>
    );
}
