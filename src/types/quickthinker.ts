
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
}

export type ChallengeType =
  | 'odd-one-out'
  | 'speed-math'
  | 'color-catch'
  | 'memory-flash'
  | 'pattern-tap'
  | 'quick-logic'
  | 'final-reflex';

// Example structure for a round - specific data will vary
export interface GameRound {
  type: ChallengeType;
  data: any; // Data specific to the challenge type (e.g., shapes, equation, words)
  correctAnswer: any; // The correct answer for validation
  options?: any[]; // Options for multiple choice rounds
  timeLimitMs?: number; // Optional time limit per round
}
