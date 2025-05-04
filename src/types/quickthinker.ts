
import type { LucideIcon } from 'lucide-react';

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface RoundResult {
  roundIndex: number;
  correct: boolean;
  timeTakenMs: number; // Time taken for this specific round
}

export interface GameState {
  status: GameStatus;
  currentRound: number;
  totalRounds: number;
  score: number; // Based on accuracy
  totalTimeMs: number; // Total time for all rounds played
  results: RoundResult[];
  startTime: number | null; // Timestamp when the current round started
  level: number; // Current game level
}

export type ChallengeType =
  | 'odd-one-out'
  | 'speed-math'
  | 'color-catch'
  | 'memory-flash'
  | 'pattern-tap'
  | 'quick-logic'
  | 'final-reflex';

// Specific data types for rounds
export interface OddOneOutOption {
  id: number;
  icon: LucideIcon;
  isOdd: boolean;
}
export interface OddOneOutData {
  options: OddOneOutOption[];
  title: string;
}

export interface SpeedMathData {
    question: string;
    options: number[];
    answer: number;
}


// Generic GameRound structure using specific data types
export type GameRoundData = OddOneOutData | SpeedMathData | any; // Add other data types as needed

export interface GameRound<T extends GameRoundData = any> {
  type: ChallengeType;
  data: T;
  correctAnswer: any; // The correct answer for validation
  // Options might be part of the data structure itself, like in OddOneOutData
  timeLimitMs?: number; // Optional time limit per round - ADDED
}
