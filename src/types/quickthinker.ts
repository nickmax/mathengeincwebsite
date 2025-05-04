
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
  // level: number; // Level progression removed, now flat 10 rounds
}

// Define possible challenge types
export type ChallengeType =
  | 'odd-one-out'
  | 'speed-math'
  | 'multiple-choice' // Generic type for text-based MCQs
  | 'logic-mcq'; // Specific type for logic questions
  // Add future types here:
  // | 'color-catch'
  // | 'memory-flash'
  // | 'pattern-tap'
  // | 'quick-logic' // Could be MCQ or true/false
  // | 'final-reflex';

// --- Specific Data Types for Each Round ---

// 1. Odd One Out (Visual)
export interface OddOneOutOption {
  id: number;
  icon: LucideIcon; // Use LucideIcon type for clarity
  isOdd: boolean;
}
export interface OddOneOutData {
  options: OddOneOutOption[];
  title: string; // e.g., "Which shape is different?"
}

// 2. Speed Math (Calculation)
export interface SpeedMathData {
    question: string; // e.g., "What is 9 + (3 × 4)?"
    options: number[]; // Array of possible answers, e.g., [21, 16, 24, 18]
    answer: number; // The correct numerical answer, e.g., 21
}

// 3. Multiple Choice Question (Generic Text-based)
export interface MultipleChoiceData {
    question: string;
    options: string[]; // Array of possible answers (strings)
    answer: string; // The correct answer string
    category?: string; // e.g., "General Knowledge", "Logic"
}
// Note: This is a general structure. We might use a more specific one for Logic.

// 4. Logic MCQ (Specific for Logic/Riddle questions)
export interface LogicMCQData extends MultipleChoiceData {
    category: 'logic' | 'riddle'; // Enforce category
}

// Add data interfaces for other challenge types here...
// export interface ColorCatchData { ... }
// export interface MemoryFlashData { ... }
// ... etc.


// --- Generic GameRound Structure ---

// Union type for all possible round data structures
export type GameRoundData = OddOneOutData | SpeedMathData | MultipleChoiceData | LogicMCQData; // | ColorCatchData | MemoryFlashData ... etc.

// Generic GameRound interface using specific data types
export interface GameRound<T extends GameRoundData = any> {
  id: number; // Unique ID for each question instance in the pool
  type: ChallengeType; // Specifies which kind of challenge it is
  data: T; // Holds the specific data needed for this round type
  correctAnswer: any; // The correct answer for validation (can be ID, number, string, etc.)
  timeLimitMs?: number; // Optional: Time limit for this specific round in milliseconds (defaults to global limit if not set)
}
