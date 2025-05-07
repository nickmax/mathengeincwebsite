
import type { LucideIcon } from 'lucide-react';

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface RoundResult {
  roundIndex: number;
  correct: boolean;
  timeTakenMs: number;
}

export interface GameState {
  status: GameStatus;
  currentRound: number;
  totalRounds: number;
  score: number;
  totalTimeMs: number;
  results: RoundResult[];
  startTime: number | null;
}

// Define possible challenge types
export type ChallengeType =
  | 'odd-one-out'
  | 'speed-math'
  | 'logic-mcq' // Specific type for logic questions
  | 'color-catch' // Example, not yet implemented
  | 'memory-flash' // Example, not yet implemented
  | 'pattern-tap'; // Example, not yet implemented


// --- Specific Data Types for Each Round ---

// 1. Odd One Out (Visual)
export interface OddOneOutOption {
  id: string; // Changed to string for consistency if comparing with string answers
  iconName: keyof typeof import('lucide-react'); // Store icon name as string
  isOdd: boolean;
}
export interface OddOneOutData {
  options: OddOneOutOption[];
  title: string;
}

// 2. Speed Math (Calculation)
export interface SpeedMathData {
  question: string;
  options: number[]; // Options are numbers
  answer: number;    // Correct answer is a number
}

// 3. Logic MCQ (Specific for Logic/Riddle questions)
export interface LogicMCQData {
  question: string;
  options: string[];
  answer: string; // Correct answer is a string (one of the options)
  category: 'logic' | 'riddle';
}

// Example for a future Color Catch round
export interface ColorCatchData {
  word: string; // e.g., "RED"
  color: string; // e.g., "blue" (the CSS color the word "RED" is displayed in)
  isMatch: boolean; // True if word string and display color match (e.g. "RED" in red)
}

// Example for a future Memory Flash round
export interface MemoryFlashData {
  sequence: string; // e.g., "8253" or "ABDC"
  displayTimeMs: number;
  prompt: string; // e.g., "Recall the sequence"
}

// Example for a future Pattern Tap round
export interface PatternTapData {
  gridSize: [number, number]; // e.g., [3, 3]
  sequence: { row: number, col: number }[]; // Array of coordinates to tap in order
  prompt: string;
}


// --- Generic GameRound Structure ---

// Union type for all possible round data structures
export type GameRoundData =
  | OddOneOutData
  | SpeedMathData
  | LogicMCQData
  | ColorCatchData
  | MemoryFlashData
  | PatternTapData;

// Generic GameRound interface using specific data types
export interface GameRound<T extends GameRoundData = any> {
  id: string; // Unique ID for each question instance in the pool (string for flexibility)
  type: ChallengeType;
  data: T;
  correctAnswer: string | number | boolean; // Type depends on the round
  timeLimitMs: number; // Time limit for this specific round in milliseconds
  level: number; // Difficulty level of this specific round
}
