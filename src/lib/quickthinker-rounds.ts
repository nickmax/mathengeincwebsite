
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

// --- Main Generation Function ---

export const generateGameRounds = (numberOfRounds: number): GameRound[] => {
  // Currently, only 'odd-one-out' is implemented
  const availableRoundTypes: ChallengeType[] = [
    'odd-one-out',
    // Add other implemented round types here when ready
  ];

  const rounds: GameRound[] = [];

  // If only one type is available, just generate that type
  const typeToGenerate = availableRoundTypes.length > 0 ? availableRoundTypes[0] : 'odd-one-out'; // Fallback

  for (let i = 0; i < numberOfRounds; i++) {
    // For now, we only generate 'odd-one-out' rounds as it's the only implemented one.
    // If more types were available and implemented, we could use getRandomElement(availableRoundTypes)
    switch (typeToGenerate) {
      case 'odd-one-out':
        rounds.push(generateOddOneOut());
        break;
      // Add cases for other implemented types here
      default:
         console.warn(`Round type "${typeToGenerate}" not implemented or available, using fallback.`);
         rounds.push(generateOddOneOut());
         break;
    }
  }

   // Shuffle the final list of rounds (if multiple types were generated)
   // With only one type, shuffling doesn't change much but is harmless.
   return rounds.sort(() => Math.random() - 0.5);
};
