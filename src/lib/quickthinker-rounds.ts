import type { GameRound, OddOneOutData, SpeedMathData, LogicMCQData, OddOneOutOption } from '@/types/quickthinker';
import { shuffleArray } from '@/lib/utils';
import { Apple, Banana, Car, Ship, Plane, Train, Brain, Lightbulb, HelpCircle, Puzzle, Square, Circle as LucideCircle, Triangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TOTAL_ROUNDS_DEFAULT = 10;
const DEFAULT_TIME_LIMIT_MS = 15000; // Increased from 10000ms

// Helper to get unique string ID
const getUniqueId = (() => {
  let id = 0;
  return () => `round-${Date.now()}-${id++}`;
})();

// --- Round Specific Generators ---

function generateOddOneOutRound(level: number = 1): GameRound<OddOneOutData> {
  // Simpler icon set for easier differentiation
  const iconMap: { [key: string]: LucideIcon } = { Square, LucideCircle, Triangle, Car };
  const allIconNames = Object.keys(iconMap) as (keyof typeof iconMap)[];

  const numOptions = 4;
  let commonIconName: keyof typeof iconMap;
  let oddOneOutName: keyof typeof iconMap;

  // Select a common icon (3 instances) and one different icon
  const distinctIcons = shuffleArray([...allIconNames]);
  commonIconName = distinctIcons[0];
  oddOneOutName = distinctIcons[1];


  const options: OddOneOutOption[] = shuffleArray([
    { id: `option-${commonIconName}-1`, iconName: commonIconName, isOdd: false },
    { id: `option-${commonIconName}-2`, iconName: commonIconName, isOdd: false },
    { id: `option-${commonIconName}-3`, iconName: commonIconName, isOdd: false },
    { id: `option-odd-${oddOneOutName}`, iconName: oddOneOutName, isOdd: true },
  ]);

  return {
    id: getUniqueId(),
    type: 'odd-one-out',
    level,
    data: {
      title: `Level ${level}: Which one is different?`,
      options,
    },
    // The correctAnswer for OddOneOut is a boolean true if the selected option's `isOdd` is true.
    // The GameRound's correctAnswer field will store the ID of the odd one out,
    // but the `onComplete` in the component will pass `option.isOdd`.
    // For consistency, let's make `correctAnswer` the ID of the odd option.
    correctAnswer: options.find(opt => opt.isOdd)!.id,
    timeLimitMs: DEFAULT_TIME_LIMIT_MS - 5000, // Slightly less time for visual tasks
  };
}

function generateSpeedMathRound(level: number = 1): GameRound<SpeedMathData> {
  const operations = level === 1 ? ['+'] : ['+', '-', '*']; // Level 1 only addition
  const numRange = level === 1 ? 10 : (level * 3 + 7); // Level 1: up to 10, Level 2: up to 13

  let num1 = Math.floor(Math.random() * numRange) + 1;
  let num2 = Math.floor(Math.random() * numRange) + 1;
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let question: string;
  let correctAnswer: number;

  switch (operation) {
    case '+':
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      if (num1 < num2) { [num1, num2] = [num2, num1]; } // Ensure positive result for simplicity
      correctAnswer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case '*':
      num1 = Math.floor(Math.random() * (level === 1 ? 5 : 7)) + 1; // Smaller numbers for multiplication
      num2 = Math.floor(Math.random() * (level === 1 ? 5 : 7)) + 1;
      correctAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    default:
      correctAnswer = 0;
      question = 'Error';
  }

  const optionsSet = new Set<number>([correctAnswer]);
  while (optionsSet.size < 4) {
    const offsetMagnitude = Math.max(1, Math.floor(Math.abs(correctAnswer * 0.15)) + level + 1); // Easier offsets
    const offset = (Math.floor(Math.random() * (2 * offsetMagnitude + 1)) - offsetMagnitude) || (Math.random() > 0.5 ? 1 : -1);
    const newOption = correctAnswer + offset;
    if (newOption >=0) { // Keep options positive for simplicity
        optionsSet.add(newOption);
    } else {
        optionsSet.add(Math.abs(newOption) + 1); // Add a different positive number
    }
  }

  const options = shuffleArray(Array.from(optionsSet));

  return {
    id: getUniqueId(),
    type: 'speed-math',
    level,
    data: {
      question,
      options,
      answer: correctAnswer,
    },
    correctAnswer: correctAnswer,
    timeLimitMs: DEFAULT_TIME_LIMIT_MS,
  };
}

const logicMcqPool = [
  {
    question: "Which number comes next: 2, 4, 6, 8, ...?",
    options: ["9", "10", "12", "14"],
    answer: "10",
    category: 'logic',
  },
  {
    question: "A cat has 4 legs. How many legs do 2 cats have?",
    options: ["4", "6", "8", "10"],
    answer: "8",
    category: 'logic',
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
    category: 'general_knowledge',
  },
   {
    question: "If today is Monday, what day is tomorrow?",
    options: ["Sunday", "Tuesday", "Wednesday", "Friday"],
    answer: "Tuesday",
    category: 'logic',
  },
  {
    question: "Which of these is a fruit?",
    options: ["Carrot", "Broccoli", "Apple", "Potato"],
    answer: "Apple",
    category: 'general_knowledge',
  }
];

function generateLogicMCQRound(level: number = 1): GameRound<LogicMCQData> {
  // Filter pool by level if needed, or just pick randomly for simplicity now
  const questionData = logicMcqPool[Math.floor(Math.random() * logicMcqPool.length)];

  return {
    id: getUniqueId(),
    type: 'logic-mcq',
    level,
    data: {
      question: `Level ${level}: ${questionData.question}`,
      options: shuffleArray([...questionData.options]),
      answer: questionData.answer,
      category: questionData.category as 'logic' | 'riddle' | 'general_knowledge',
    },
    correctAnswer: questionData.answer,
    timeLimitMs: DEFAULT_TIME_LIMIT_MS + 5000, // More time for reading based questions
  };
}


// --- Main Round Generation Function ---
export function generateQuickThinkerRounds(
  numberOfRounds: number = TOTAL_ROUNDS_DEFAULT,
  targetLevel: number = 1
): GameRound[] {

  const roundGeneratorsForLevel = () => {
      if (targetLevel === 1) {
          return [() => generateOddOneOutRound(targetLevel)];
      } else if (targetLevel === 2) {
          return [
            () => generateSpeedMathRound(targetLevel),
            () => generateLogicMCQRound(targetLevel) // Add more variety for level 2
          ];
      }
      // Default case or for higher levels if added
      return [
        () => generateOddOneOutRound(targetLevel),
        () => generateSpeedMathRound(targetLevel),
        () => generateLogicMCQRound(targetLevel),
      ];
  }


  const selectedGenerators = roundGeneratorsForLevel();
  const generatedRounds: GameRound[] = [];
  const usedQuestionSignatures = new Set<string>();

  // Ensure enough variety or allow repeats if pool is small for the requested number of rounds
  const maxUniqueAttempts = selectedGenerators.length * 5; // Attempt to get unique questions
  let attempts = 0;

  while (generatedRounds.length < numberOfRounds && attempts < maxUniqueAttempts * 2) {
    const generatorIndex = Math.floor(Math.random() * selectedGenerators.length);
    const newRound = selectedGenerators[generatorIndex]();

    let questionSignature = `${newRound.type}-${newRound.data.question || (newRound.data as OddOneOutData).title}`;
    if(newRound.type === 'odd-one-out'){
        questionSignature += (newRound.data as OddOneOutData).options.map(o => o.iconName).sort().join(',');
    } else if (newRound.type === 'speed-math'){
        questionSignature += (newRound.data as SpeedMathData).options.sort((a,b)=>a-b).join(',');
    } else if (newRound.type === 'logic-mcq') {
        questionSignature += (newRound.data as LogicMCQData).options.sort().join(',');
    }


    if (!usedQuestionSignatures.has(questionSignature) || attempts > maxUniqueAttempts) { // Allow repeats if struggling to find unique
      generatedRounds.push(newRound);
      usedQuestionSignatures.add(questionSignature);
    }
    attempts++;
  }
  
  // If not enough unique rounds were generated, fill with potentially non-unique ones
  while (generatedRounds.length < numberOfRounds) {
    const generatorIndex = Math.floor(Math.random() * selectedGenerators.length);
    const fallbackRound = selectedGenerators[generatorIndex]();
    fallbackRound.id = getUniqueId() + "-fallback"; // Ensure ID is still unique
    generatedRounds.push(fallbackRound);
  }
  
  return shuffleArray(generatedRounds).slice(0, numberOfRounds);
}

export const getIconComponent = (iconName?: keyof typeof import('lucide-react')): LucideIcon | null => {
  if (!iconName) return HelpCircle;
  // Updated iconMap to include the new icons
  const iconMap: { [key: string]: LucideIcon } = {
    Apple, Banana, Car, Ship, Plane, Train, Brain, Lightbulb, HelpCircle, Puzzle,
    Square, Circle: LucideCircle, Triangle // Aliased Circle to LucideCircle to avoid naming conflict
  };
  return iconMap[iconName] || HelpCircle;
};