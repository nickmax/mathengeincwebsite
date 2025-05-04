
import type { GameRound, ChallengeType, OddOneOutData, SpeedMathData } from '@/types/quickthinker';
import { Square, Circle, Triangle, Star, Heart, Cloud } from 'lucide-react'; // Import necessary icons

// Helper to get a random element from an array
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


// --- Round Generation Functions ---

// 1. Odd One Out
const generateOddOneOut = (): GameRound<OddOneOutData> => {
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

  return {
    type: 'odd-one-out',
    data: {
      options: options,
      title: "Which shape is different?",
    },
    correctAnswer: options.find(opt => opt.isOdd)?.id, // The ID of the odd option
  };
};

// 2. Speed Math
// Export this function so it can be imported in page.tsx
export const generateSpeedMath = (): GameRound<SpeedMathData> => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const num3 = Math.floor(Math.random() * 5) + 1; // Smaller third number for complexity
    const operators = ['+', '-', '*'];
    const op1 = getRandomElement(operators);
    const op2 = getRandomElement(operators.filter(op => op !== '/')); // Avoid division for simplicity

    let question = '';
    let answer = 0;

    // Simple structure: num1 op1 num2
    if (Math.random() < 0.7) { // 70% chance for simpler question
        question = `${num1} ${op1} ${num2}`;
        switch (op1) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
        }
    }
    // More complex: num1 op1 (num2 op2 num3) - ensuring order of operations
    else {
         let innerCalc = 0;
         switch (op2) {
             case '+': innerCalc = num2 + num3; break;
             case '-': innerCalc = num2 - num3; break;
             case '*': innerCalc = num2 * num3; break;
         }
         question = `${num1} ${op1} (${num2} ${op2} ${num3})`;
          switch (op1) {
             case '+': answer = num1 + innerCalc; break;
             case '-': answer = num1 - innerCalc; break;
             case '*': answer = num1 * innerCalc; break;
         }
    }

     // Generate distractors
     const options = new Set<number>([answer]);
     while (options.size < 4) {
         const distractorOffset = Math.floor(Math.random() * 10) - 5; // -5 to +4
         const distractor = answer + distractorOffset;
         if (distractor !== answer) {
             options.add(distractor);
         }
     }

    return {
        type: 'speed-math',
        data: {
            question: `What's ${question}?`,
            options: shuffleArray(Array.from(options)),
            answer: answer,
        },
        correctAnswer: answer,
    };
};


// --- Main Generation Function ---

export const generateGameRounds = (numberOfRounds: number): GameRound[] => {
  // Add other implemented round types here when ready
  const availableRoundTypes: ChallengeType[] = [
    'odd-one-out',
    'speed-math',
    // 'color-catch',
    // etc.
  ];

  const rounds: GameRound[] = [];

  // Ensure the first round is always 'odd-one-out'
  rounds.push(generateOddOneOut());

  // Generate the remaining rounds randomly
  for (let i = 1; i < numberOfRounds; i++) {
    const randomType = getRandomElement(availableRoundTypes);
    switch (randomType) {
      case 'odd-one-out':
        rounds.push(generateOddOneOut());
        break;
      case 'speed-math':
        rounds.push(generateSpeedMath());
        break;
      // Add cases for other implemented types here
      // case 'color-catch': rounds.push(generateColorCatch()); break;
      default:
         console.warn(`Round type "${randomType}" generation not implemented, using fallback.`);
         rounds.push(generateOddOneOut()); // Fallback to a known type
         break;
    }
  }

   // Note: The first round is fixed, the rest are random. No need to shuffle the whole array.
   return rounds;
};

