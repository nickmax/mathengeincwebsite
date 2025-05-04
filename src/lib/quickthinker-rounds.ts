
import type { GameRound, ChallengeType, OddOneOutData, SpeedMathData, LogicMCQData } from '@/types/quickthinker';
import { Square, Circle, Triangle, Star, Heart, Cloud, Brain, Lightbulb, Feather } from 'lucide-react';

// --- Helper Functions ---

// Helper to get a random element from an array
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]; // Create a copy to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Master Question Pool ---

// Define a pool of questions covering different types
const questionPool: GameRound[] = [
  // --- Odd One Out (Visual) ---
  {
    id: 1,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Square, isOdd: false },
        { id: 2, icon: Square, isOdd: false },
        { id: 3, icon: Square, isOdd: false },
        { id: 4, icon: Circle, isOdd: true },
      ]),
      title: "Which shape is different?",
    },
    correctAnswer: 4, // The ID of the odd one out after shuffling
    timeLimitMs: 10000
  },
  {
    id: 2,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Triangle, isOdd: false },
        { id: 2, icon: Triangle, isOdd: true }, // Example: make one slightly rotated or styled differently if possible, else use different icon
        { id: 3, icon: Triangle, isOdd: false },
        { id: 4, icon: Triangle, isOdd: false },
      ]),
      title: "Which triangle is different?",
    },
    correctAnswer: 2,
    timeLimitMs: 10000
  },
    {
    id: 3,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Heart, isOdd: false },
        { id: 2, icon: Star, isOdd: true },
        { id: 3, icon: Heart, isOdd: false },
        { id: 4, icon: Heart, isOdd: false },
      ]),
      title: "Which one doesn't belong?",
    },
    correctAnswer: 2,
    timeLimitMs: 10000
  },
   {
    id: 4,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Cloud, isOdd: false },
        { id: 2, icon: Cloud, isOdd: false },
        { id: 3, icon: Lightbulb, isOdd: true },
        { id: 4, icon: Cloud, isOdd: false },
      ]),
      title: "Find the odd one out.",
    },
    correctAnswer: 3,
    timeLimitMs: 10000
  },

  // --- Speed Math ---
  {
    id: 10,
    type: 'speed-math',
    data: { question: "What is 5 + 8?", options: [13, 12, 14, 3], answer: 13 },
    correctAnswer: 13, timeLimitMs: 10000
  },
  {
    id: 11,
    type: 'speed-math',
    data: { question: "What is 15 - 6?", options: [9, 11, 8, 21], answer: 9 },
    correctAnswer: 9, timeLimitMs: 10000
  },
  {
    id: 12,
    type: 'speed-math',
    data: { question: "What is 7 × 6?", options: [42, 36, 48, 49], answer: 42 },
    correctAnswer: 42, timeLimitMs: 10000
  },
  {
    id: 13,
    type: 'speed-math',
    data: { question: "What is 24 ÷ 4?", options: [6, 8, 4, 12], answer: 6 },
    correctAnswer: 6, timeLimitMs: 10000
  },
   {
    id: 14,
    type: 'speed-math',
    data: { question: "What is 3 + 5 x 2?", options: [13, 16, 10, 11], answer: 13 }, // Order of operations
    correctAnswer: 13, timeLimitMs: 10000
  },
   {
    id: 15,
    type: 'speed-math',
    data: { question: "What is (10 - 4) x 3?", options: [18, 30, 6, 22], answer: 18 }, // Parentheses first
    correctAnswer: 18, timeLimitMs: 10000
  },


  // --- Logic MCQ ---
  {
    id: 20,
    type: 'logic-mcq',
    data: {
      question: "If all Bloops are Grooks, and some Grooks are Snarks, are all Bloops definitely Snarks?",
      options: ["Yes", "No", "Maybe"],
      answer: "No",
      category: 'logic',
    },
    correctAnswer: "No", timeLimitMs: 15000 // Slightly longer for logic
  },
   {
    id: 21,
    type: 'logic-mcq',
    data: {
      question: "Which weighs more: a pound of feathers or a pound of bricks?",
      options: ["Bricks", "Feathers", "They weigh the same"],
      answer: "They weigh the same",
      category: 'riddle',
    },
    correctAnswer: "They weigh the same", timeLimitMs: 10000
  },
   {
    id: 22,
    type: 'logic-mcq',
    data: {
      question: "A plane crashes on the border between the USA and Canada. Where do they bury the survivors?",
      options: ["USA", "Canada", "You don't bury survivors"],
      answer: "You don't bury survivors",
      category: 'riddle',
    },
    correctAnswer: "You don't bury survivors", timeLimitMs: 10000
  },
  // Add more questions of different types here...
  // e.g., Memory, Pattern, Color Catch, Reaction
  // Minimum 10 needed for the selection logic to work reliably.
];


// --- Main Generation Function ---

// Function to select 10 unique random rounds from the pool
export const generateGameRounds = (numberOfRounds: number = 10): GameRound[] => {
  if (questionPool.length < numberOfRounds) {
    console.warn(`Warning: Question pool has only ${questionPool.length} questions, but ${numberOfRounds} were requested. Returning all available questions.`);
    return shuffleArray(questionPool);
  }

  // Shuffle the pool and take the first 'numberOfRounds' items
  const shuffledPool = shuffleArray(questionPool);
  const selectedRounds = shuffledPool.slice(0, numberOfRounds);

  // Remap correctAnswer for OddOneOut after shuffling within the pool item
   return selectedRounds.map(round => {
        if (round.type === 'odd-one-out' && Array.isArray(round.data.options)) {
            const correctOption = round.data.options.find(opt => opt.isOdd);
            if (correctOption) {
                return { ...round, correctAnswer: correctOption.id };
            }
        }
        return round;
    });
};

// --- Specific Generators (kept for potential direct use or testing) ---

// Odd One Out
export const generateOddOneOut = (): GameRound<OddOneOutData> => {
  const icons = [Square, Circle, Triangle, Star, Heart, Cloud];
  const baseIcon = getRandomElement(icons);
  let oddIcon = getRandomElement(icons.filter(icon => icon !== baseIcon));
  if (!oddIcon) oddIcon = Circle; // Fallback if all icons are the same

  const options = [
    { id: 1, icon: baseIcon, isOdd: false },
    { id: 2, icon: baseIcon, isOdd: false },
    { id: 3, icon: baseIcon, isOdd: false },
    { id: 4, icon: oddIcon, isOdd: true },
  ];

  const shuffledOptions = shuffleArray(options);
  const correctOptionId = shuffledOptions.find(opt => opt.isOdd)?.id ?? 1; // Find correct ID after shuffling

  return {
    id: Math.floor(Math.random() * 1000), // Temporary random ID for standalone generation
    type: 'odd-one-out',
    data: {
      options: shuffledOptions,
      title: "Which shape is different?",
    },
    correctAnswer: correctOptionId,
    timeLimitMs: 10000
  };
};

// Speed Math
export const generateSpeedMath = (): GameRound<SpeedMathData> => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*']; // Basic operations
    const op1 = getRandomElement(operators);
    let question = '';
    let answer = 0;

    question = `${num1} ${op1} ${num2}`;
    switch (op1) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
    }

     // Generate distractors
     const options = new Set<number>([answer]);
     while (options.size < 4) {
         const offsetRange = Math.max(5, Math.abs(Math.round(answer * 0.3)));
         const distractorOffset = Math.floor(Math.random() * (2 * offsetRange + 1)) - offsetRange;
         const distractor = answer + distractorOffset;
         if (distractor !== answer) {
             options.add(distractor);
         }
     }

    return {
        id: Math.floor(Math.random() * 1000) + 100, // Temp ID
        type: 'speed-math',
        data: {
            question: `What is ${question}?`,
            options: shuffleArray(Array.from(options)),
            answer: answer,
        },
        correctAnswer: answer,
        timeLimitMs: 10000
    };
};

// Logic MCQ
export const generateLogicMCQ = (): GameRound<LogicMCQData> => {
    // Example: Select a random logic question from the pool (or define static ones here)
     const logicQuestions = questionPool.filter(q => q.type === 'logic-mcq');
     if (logicQuestions.length === 0) {
         // Fallback if no logic questions are defined in the pool
         return {
            id: 999,
            type: 'logic-mcq',
            data: {
                question: "Placeholder Logic: If A=B and B=C, does A=C?",
                options: ["Yes", "No", "Maybe"],
                answer: "Yes",
                category: 'logic',
            },
            correctAnswer: "Yes", timeLimitMs: 10000
         }
     }
     const selectedQuestion = getRandomElement(logicQuestions);
     // Ensure data structure matches LogicMCQData
     const data = selectedQuestion.data as LogicMCQData;

     return {
        ...selectedQuestion,
        data: {
            ...data,
            options: shuffleArray(data.options) // Shuffle options for variety
        }
     } as GameRound<LogicMCQData>; // Type assertion
};
