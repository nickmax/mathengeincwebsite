
import type { GameRound, ChallengeType } from '@/types/quickthinker';
import { Square, Circle, Triangle, Star, Heart, Cloud } from 'lucide-react'; // Import necessary icons

// Helper to get a random element from an array
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Round Generation Functions ---

// 1. Odd One Out
const generateOddOneOut = (): GameRound => {
  const icons = [Square, Circle, Triangle, Star, Heart, Cloud];
  const baseIcon = getRandomElement(icons);
  // Filter out the base icon to select a different one as the 'odd one'
  const oddIcon = getRandomElement(icons.filter(icon => icon !== baseIcon));

  // Create 3 options with the base icon and 1 with the odd icon
  const options = [
    { id: 1, icon: baseIcon, isOdd: false },
    { id: 2, icon: baseIcon, isOdd: false },
    { id: 3, icon: baseIcon, isOdd: false },
    { id: 4, icon: oddIcon, isOdd: true }, // The odd one out
  ];

  // Note: Rotation/slight difference logic could be added here if using SVGs directly

  return {
    type: 'odd-one-out',
    data: {
      options: options,
      title: "Which shape is different?",
    },
    correctAnswer: options.find(opt => opt.isOdd)?.id, // The ID of the odd option
  };
};

// 2. Speed Math (Placeholder)
const generateSpeedMath = (): GameRound => {
  // Placeholder - Implement actual math generation logic
   const num1 = Math.floor(Math.random() * 10) + 1;
   const num2 = Math.floor(Math.random() * 5) + 1;
   const num3 = Math.floor(Math.random() * 5) + 1;
   const correctAnswer = num1 + (num2 * num3);
   const equation = `${num1} + (${num2} × ${num3})`;
   // Generate distractors
   const options = Array.from({ length: 3 }, () => correctAnswer + Math.floor(Math.random() * 10) - 5)
                      .filter(opt => opt !== correctAnswer) // Ensure distractors are different
                      .concat(correctAnswer) // Add correct answer
                      .slice(0, 4); // Take first 4 unique options
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

  return {
    type: 'speed-math',
    data: { equation: equation, options: options, title: "Quick Math!" }, // Pass options here
    correctAnswer: correctAnswer,
    options: options, // Ensure options array is included
    timeLimitMs: 10000, // Example time limit
  };
};

// ... Add generation functions for other round types (ColorCatch, MemoryFlash, etc.) ...
// const generateColorCatch = (): GameRound => { ... };
// const generateMemoryFlash = (): GameRound => { ... };
// etc.


// --- Main Generation Function ---

export const generateGameRounds = (numberOfRounds: number): GameRound[] => {
  const availableRoundTypes: ChallengeType[] = [
    'odd-one-out',
    // 'speed-math', // Uncomment when implemented
    // 'color-catch',
    // 'memory-flash',
    // 'pattern-tap',
    // 'quick-logic',
    // 'final-reflex',
  ];

  const rounds: GameRound[] = [];

  // Ensure we don't request more rounds than available types if we want unique types per game
  const numToGenerate = Math.min(numberOfRounds, availableRoundTypes.length);

  // Simple strategy: pick random types, ensuring variety if possible
  const selectedTypes: ChallengeType[] = [];
  while (selectedTypes.length < numToGenerate) {
      const randomType = getRandomElement(availableRoundTypes);
      if (!selectedTypes.includes(randomType)) { // Prefer unique types for short games
          selectedTypes.push(randomType);
      } else if (selectedTypes.length >= availableRoundTypes.length) {
          // If we've used all unique types and still need more rounds, allow repeats
          selectedTypes.push(randomType);
      }
       // Safety break if something goes wrong
       if (selectedTypes.length > numberOfRounds * 2) break;
  }


  for (let i = 0; i < numToGenerate; i++) {
     const type = selectedTypes[i]; // Use the selected types
    switch (type) {
      case 'odd-one-out':
        rounds.push(generateOddOneOut());
        break;
      case 'speed-math':
         // rounds.push(generateSpeedMath()); // Uncomment when implemented
         // For now, add another odd-one-out as placeholder if speed-math selected
         rounds.push(generateOddOneOut());
        break;
      // Add cases for other implemented types
      // case 'color-catch': rounds.push(generateColorCatch()); break;
      default:
         // Fallback to odd-one-out if type generation fails
         console.warn(`Round type "${type}" not implemented, using fallback.`);
         rounds.push(generateOddOneOut());
         break;
    }
  }

   // Shuffle the final list of rounds for variety each game
   return rounds.sort(() => Math.random() - 0.5);
};
