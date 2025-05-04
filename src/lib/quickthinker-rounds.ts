
import type { GameRound, ChallengeType, OddOneOutData, SpeedMathData, LogicMCQData } from '@/types/quickthinker';
import { Square, Circle, Triangle, Star, Heart, Cloud, Brain, Lightbulb, Feather, Puzzle, Calculator, Scale, Target, Anchor } from 'lucide-react';

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

// Expanded pool of questions covering different types
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
    correctAnswer: 4,
    timeLimitMs: 10000
  },
  {
    id: 2,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Triangle, isOdd: false },
        { id: 2, icon: Star, isOdd: true }, // Star is odd one out
        { id: 3, icon: Triangle, isOdd: false },
        { id: 4, icon: Triangle, isOdd: false },
      ]),
      title: "Which shape doesn't belong?",
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
        { id: 2, icon: Heart, isOdd: false },
        { id: 3, icon: Puzzle, isOdd: true },
        { id: 4, icon: Heart, isOdd: false },
      ]),
      title: "Which one doesn't belong?",
    },
    correctAnswer: 3,
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
  {
    id: 5,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Calculator, isOdd: true },
        { id: 2, icon: Feather, isOdd: false },
        { id: 3, icon: Feather, isOdd: false },
        { id: 4, icon: Feather, isOdd: false },
      ]),
      title: "Spot the difference.",
    },
    correctAnswer: 1,
    timeLimitMs: 10000
  },
   {
    id: 6,
    type: 'odd-one-out',
    data: {
      options: shuffleArray([
        { id: 1, icon: Target, isOdd: false },
        { id: 2, icon: Target, isOdd: false },
        { id: 3, icon: Target, isOdd: false },
        { id: 4, icon: Anchor, isOdd: true },
      ]),
      title: "Which icon is out of place?",
    },
    correctAnswer: 4,
    timeLimitMs: 10000
  },

  // --- Speed Math ---
  {
    id: 10,
    type: 'speed-math',
    data: { question: "5 + 8 = ?", options: [13, 12, 14, 3], answer: 13 },
    correctAnswer: 13, timeLimitMs: 10000
  },
  {
    id: 11,
    type: 'speed-math',
    data: { question: "15 - 6 = ?", options: [9, 11, 8, 21], answer: 9 },
    correctAnswer: 9, timeLimitMs: 10000
  },
  {
    id: 12,
    type: 'speed-math',
    data: { question: "7 × 6 = ?", options: [42, 36, 48, 49], answer: 42 },
    correctAnswer: 42, timeLimitMs: 10000
  },
  {
    id: 13,
    type: 'speed-math',
    data: { question: "24 ÷ 4 = ?", options: [6, 8, 4, 12], answer: 6 },
    correctAnswer: 6, timeLimitMs: 10000
  },
   {
    id: 14,
    type: 'speed-math',
    data: { question: "3 + 5 x 2 = ?", options: [13, 16, 10, 11], answer: 13 }, // Order of operations
    correctAnswer: 13, timeLimitMs: 10000
  },
   {
    id: 15,
    type: 'speed-math',
    data: { question: "(10 - 4) x 3 = ?", options: [18, 30, 6, 22], answer: 18 }, // Parentheses first
    correctAnswer: 18, timeLimitMs: 10000
  },
  {
    id: 16,
    type: 'speed-math',
    data: { question: "9 + 12 = ?", options: [21, 20, 22, 11], answer: 21 },
    correctAnswer: 21, timeLimitMs: 10000
  },
  {
    id: 17,
    type: 'speed-math',
    data: { question: "18 / 3 = ?", options: [6, 9, 5, 7], answer: 6 },
    correctAnswer: 6, timeLimitMs: 10000
  },
   {
    id: 18,
    type: 'speed-math',
    data: { question: "4 x 4 - 4 = ?", options: [12, 16, 0, 8], answer: 12 },
    correctAnswer: 12, timeLimitMs: 10000
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
      options: ["USA", "Canada", "Nowhere"],
      answer: "Nowhere", // Corrected answer
      category: 'riddle',
    },
    correctAnswer: "Nowhere", timeLimitMs: 10000
  },
   {
    id: 23,
    type: 'logic-mcq',
    data: {
      question: "What comes next in the sequence: J, F, M, A, M, ...?",
      options: ["J", "A", "S", "O"], // J, J, A, S, O, N, D (Months)
      answer: "J",
      category: 'logic',
    },
    correctAnswer: "J", timeLimitMs: 15000
  },
  {
    id: 24,
    type: 'logic-mcq',
    data: {
      question: "If you rearrange the letters 'CIFAIPC', you get the name of a what?",
      options: ["City", "Animal", "Ocean", "Country"], // PACIFIC
      answer: "Ocean",
      category: 'logic',
    },
    correctAnswer: "Ocean", timeLimitMs: 15000
  },
   {
    id: 25,
    type: 'logic-mcq',
    data: {
      question: "What has an eye, but cannot see?",
      options: ["A needle", "A potato", "A storm", "A hurricane"],
      answer: "A needle",
      category: 'riddle',
    },
    correctAnswer: "A needle", timeLimitMs: 10000
  },

  // Add more questions of different types here...
];


// --- Main Generation Function ---

// Function to select 'numberOfRounds' unique random rounds from the pool
export const generateGameRounds = (numberOfRounds: number = 10): GameRound[] => {
  // Ensure the pool is large enough
  if (questionPool.length < numberOfRounds) {
    console.warn(`Warning: Question pool has only ${questionPool.length} questions, but ${numberOfRounds} were requested. Using all available questions.`);
    const roundsNeeded = numberOfRounds;
    let extendedPool = [...questionPool];
    // If still not enough, duplicate from pool until we have enough
    while(extendedPool.length < roundsNeeded) {
        extendedPool.push(...shuffleArray(questionPool).slice(0, Math.min(questionPool.length, roundsNeeded - extendedPool.length)));
    }
    // Shuffle the extended pool and take the required number
    return shuffleArray(extendedPool).slice(0, numberOfRounds).map(round => {
        // Re-shuffle options within each selected round for extra randomness
        if (round.data && Array.isArray(round.data.options)) {
            const shuffledOptions = shuffleArray(round.data.options);
            const updatedData = { ...round.data, options: shuffledOptions };

            // Update correctAnswer for OddOneOut after shuffling options
             if (round.type === 'odd-one-out') {
                 const correctOption = shuffledOptions.find((opt: OddOneOutOption) => opt.isOdd);
                 return { ...round, data: updatedData, correctAnswer: correctOption ? correctOption.id : round.correctAnswer };
             }
             return { ...round, data: updatedData };
        }
        return round;
    });
  }

  // Shuffle the pool and take the first 'numberOfRounds' items
  const shuffledPool = shuffleArray(questionPool);
  const selectedRounds = shuffledPool.slice(0, numberOfRounds);

   // Re-shuffle options within each selected round and update correctAnswer for OddOneOut
   return selectedRounds.map(round => {
        if (round.data && Array.isArray(round.data.options)) {
            const shuffledOptions = shuffleArray(round.data.options);
            const updatedData = { ...round.data, options: shuffledOptions };

             if (round.type === 'odd-one-out') {
                 const correctOption = shuffledOptions.find((opt: OddOneOutOption) => opt.isOdd);
                 return { ...round, data: updatedData, correctAnswer: correctOption ? correctOption.id : round.correctAnswer };
             }
            return { ...round, data: updatedData };
        }
        return round;
    });
};

// --- Specific Generators (kept for potential direct use or testing, but not exported) ---

// Odd One Out
const generateOddOneOutInternal = (): GameRound<OddOneOutData> => {
  const icons = [Square, Circle, Triangle, Star, Heart, Cloud, Puzzle, Anchor, Target];
  const baseIcon = getRandomElement(icons);
  let oddIcon = getRandomElement(icons.filter(icon => icon !== baseIcon));
  if (!oddIcon) oddIcon = icons.length > 1 ? icons[1] : Circle; // Fallback

  const options = [
    { id: 1, icon: baseIcon, isOdd: false },
    { id: 2, icon: baseIcon, isOdd: false },
    { id: 3, icon: baseIcon, isOdd: false },
    { id: 4, icon: oddIcon, isOdd: true },
  ];

  const shuffledOptions = shuffleArray(options);
  const correctOptionId = shuffledOptions.find(opt => opt.isOdd)?.id ?? 1; // Find correct ID after shuffling

  return {
    id: Math.floor(Math.random() * 1000), // Temporary random ID
    type: 'odd-one-out',
    data: {
      options: shuffledOptions,
      title: "Which one is different?",
    },
    correctAnswer: correctOptionId,
    timeLimitMs: 10000
  };
};

// Speed Math
const generateSpeedMathInternal = (): GameRound<SpeedMathData> => {
    const num1 = Math.floor(Math.random() * 12) + 1; // Range 1-12
    const num2 = Math.floor(Math.random() * 12) + 1; // Range 1-12
    const operators = ['+', '-', '*', '/'];
    let op = getRandomElement(operators);
    let question = '';
    let answer = 0;

     // Ensure division results in an integer and avoid division by zero
    if (op === '/') {
        // Regenerate numbers until num1 is divisible by num2
        let tempNum1 = num1 * num2; // Ensure divisibility
        let tempNum2 = num2;
         if (tempNum2 === 0) tempNum2 = 1; // Avoid division by zero
         question = `${tempNum1} ${op} ${tempNum2}`;
         answer = tempNum1 / tempNum2;
    } else {
         question = `${num1} ${op} ${num2}`;
         switch (op) {
             case '+': answer = num1 + num2; break;
             case '-': answer = num1 - num2; break;
             case '*': answer = num1 * num2; break;
         }
    }

     // Generate distractors
     const options = new Set<number>([answer]);
     while (options.size < 4) {
         const offsetRange = Math.max(3, Math.abs(Math.round(answer * 0.2)) + 1);
         const distractorOffset = Math.floor(Math.random() * (2 * offsetRange + 1)) - offsetRange;
         let distractor = Math.round(answer + distractorOffset); // Keep distractors as integers

         // Ensure distractor is different and non-negative if answer is non-negative
         if (distractor !== answer && (answer < 0 || distractor >= 0)) {
             options.add(distractor);
         } else if (options.size < 3) { // Add a simple offset if generation fails
            options.add(answer + (options.size % 2 === 0 ? options.size + 1 : -(options.size + 1)));
         }
     }

    return {
        id: Math.floor(Math.random() * 1000) + 1000, // Temp ID
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
const generateLogicMCQInternal = (): GameRound<LogicMCQData> => {
     const logicQuestions = questionPool.filter(q => q.type === 'logic-mcq');
     if (logicQuestions.length === 0) {
         return { // Fallback
            id: 9999,
            type: 'logic-mcq',
            data: {
                question: "Placeholder: A is B, B is C. Is A = C?",
                options: ["Yes", "No", "Maybe"], answer: "Yes", category: 'logic',
            }, correctAnswer: "Yes", timeLimitMs: 10000
         }
     }
     const selectedQuestion = getRandomElement(logicQuestions);
     const data = selectedQuestion.data as LogicMCQData;

     return {
        ...selectedQuestion,
        data: { ...data, options: shuffleArray(data.options) }
     } as GameRound<LogicMCQData>;
};
