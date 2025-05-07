
import type { GameRound, OddOneOutData, SpeedMathData, LogicMCQData, OddOneOutOption } from '@/types/quickthinker';
import { shuffleArray, cn } from '@/lib/utils'; // Assuming cn is not needed here, removed if so.
import { Apple, Banana, Car, Ship, Plane, Train, Brain, Lightbulb, HelpCircle, Puzzle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TOTAL_ROUNDS_DEFAULT = 10;
const DEFAULT_TIME_LIMIT_MS = 10000;

// Helper to get unique string ID
const getUniqueId = (() => {
  let id = 0;
  return () => `round-${Date.now()}-${id++}`;
})();

// --- Round Specific Generators ---

function generateOddOneOutRound(level: number = 1): GameRound<OddOneOutData> {
  const iconMap: { [key: string]: LucideIcon } = { Apple, Banana, Car, Ship, Plane, Train };
  const allIconNames = Object.keys(iconMap) as (keyof typeof iconMap)[];

  const numOptions = 4;
  const selectedIconNames = shuffleArray([...allIconNames]).slice(0, numOptions -1);
  
  let oddOneOutName: keyof typeof iconMap;
  let commonCategory: string;

  // Example categories (can be expanded)
  const categories: {[key: string]: string[]} = {
    fruit: ['Apple', 'Banana'],
    vehicle: ['Car', 'Ship', 'Plane', 'Train'],
  };

  // Determine a common category for the "normal" items
  if (Math.random() > 0.5 && selectedIconNames.some(name => categories.vehicle.includes(name))) {
    commonCategory = 'vehicle';
    // Pick an odd one out from fruit or ensure it's different enough
    const fruitNames = categories.fruit;
    oddOneOutName = fruitNames[Math.floor(Math.random() * fruitNames.length)];
    // Ensure the selectedIconNames are from the commonCategory
    const vehicleNames = shuffleArray([...categories.vehicle]);
    for(let i=0; i<selectedIconNames.length; i++){
        if(!categories.vehicle.includes(selectedIconNames[i])){
            selectedIconNames[i] = vehicleNames.find(vn => !selectedIconNames.includes(vn) && vn !== oddOneOutName) || vehicleNames[0];
        }
    }

  } else {
    commonCategory = 'fruit';
    const vehicleNames = categories.vehicle;
    oddOneOutName = vehicleNames[Math.floor(Math.random() * vehicleNames.length)];
    const fruitNames = shuffleArray([...categories.fruit]);
     for(let i=0; i<selectedIconNames.length; i++){
        if(!categories.fruit.includes(selectedIconNames[i])){
           selectedIconNames[i] = fruitNames.find(fn => !selectedIconNames.includes(fn) && fn !== oddOneOutName) || fruitNames[0];
        }
    }
  }
   // Ensure oddOneOutName is not already in selectedIconNames
   if(selectedIconNames.includes(oddOneOutName)){
    const availableIcons = allIconNames.filter(name => !selectedIconNames.includes(name));
    if(availableIcons.length > 0){
      oddOneOutName = availableIcons[Math.floor(Math.random() * availableIcons.length)];
    } else {
      // Fallback if all icons are somehow selected (shouldn't happen with slice)
      oddOneOutName = selectedIconNames.pop() as keyof typeof iconMap; // remove one to make space
    }
  }


  const options: OddOneOutOption[] = shuffleArray([
    ...selectedIconNames.map((name, index) => ({
      id: `option-${name}-${index}`,
      iconName: name as keyof typeof import('lucide-react'),
      isOdd: false,
    })),
    {
      id: `option-odd-${oddOneOutName}`,
      iconName: oddOneOutName as keyof typeof import('lucide-react'),
      isOdd: true,
    },
  ]);

  return {
    id: getUniqueId(),
    type: 'odd-one-out',
    level,
    data: {
      title: `Level ${level}: Which one is different?`,
      options,
    },
    correctAnswer: options.find(opt => opt.isOdd)!.id,
    timeLimitMs: DEFAULT_TIME_LIMIT_MS,
  };
}

function generateSpeedMathRound(level: number = 1): GameRound<SpeedMathData> {
  const operations = ['+', '-', '*'];
  const numRange = level * 4 + 5; // e.g. level 1: 9, level 2: 13
  
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
      // Ensure positive result for simplicity in early levels
      if (num1 < num2 && level <=2) { [num1, num2] = [num2, num1]; }
      correctAnswer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case '*':
      num1 = Math.floor(Math.random() * (level === 1 ? 5 : 9)) + 1; // Smaller numbers for multiplication
      num2 = Math.floor(Math.random() * (level === 1 ? 5 : 9)) + 1;
      correctAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    default: // Should not happen
      correctAnswer = 0;
      question = 'Error';
  }

  const optionsSet = new Set<number>([correctAnswer]);
  while (optionsSet.size < 4) {
    const offsetMagnitude = Math.max(1, Math.floor(Math.abs(correctAnswer * 0.2)) + level);
    const offset = (Math.floor(Math.random() * (2 * offsetMagnitude + 1)) - offsetMagnitude) || (Math.random() > 0.5 ? 1 : -1);
    optionsSet.add(correctAnswer + offset);
  }
  
  const options = shuffleArray(Array.from(optionsSet));

  return {
    id: getUniqueId(),
    type: 'speed-math',
    level,
    data: {
      question,
      options,
      answer: correctAnswer, // Storing the numerical answer for internal use
    },
    correctAnswer: correctAnswer, // The GameRound's correctAnswer
    timeLimitMs: DEFAULT_TIME_LIMIT_MS,
  };
}

const logicMcqPool = [
  {
    question: "If all Bloops are Zorgs, and some Zorgs are Flibs, are all Bloops Flibs?",
    options: ["Yes", "No", "Cannot Be Determined"],
    answer: "Cannot Be Determined",
    category: 'logic',
  },
  {
    question: "A farmer has 17 sheep. All but 9 die. How many are left?",
    options: ["8", "9", "17", "26"],
    answer: "9",
    category: 'riddle',
  },
  {
    question: "Which number comes next in the sequence: 2, 4, 8, 16, ...?",
    options: ["24", "30", "32", "64"],
    answer: "32",
    category: 'logic',
  },
  {
    question: "What has an eye, but cannot see?",
    options: ["A potato", "A needle", "A storm", "A hurricane"],
    answer: "A needle",
    category: 'riddle',
  },
   {
    question: "Which of the following is a prime number?",
    options: ["4", "9", "17", "21"],
    answer: "17",
    category: 'logic',
  },
  {
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    options: ["A dream", "A map", "A computer", "A book"],
    answer: "A map",
    category: 'riddle',
  }
];

function generateLogicMCQRound(level: number = 1): GameRound<LogicMCQData> {
  const questionData = logicMcqPool[Math.floor(Math.random() * logicMcqPool.length)];
  
  return {
    id: getUniqueId(),
    type: 'logic-mcq',
    level,
    data: {
      question: `Level ${level}: ${questionData.question}`,
      options: shuffleArray([...questionData.options]), // Shuffle options for variety
      answer: questionData.answer,
      category: questionData.category as 'logic' | 'riddle',
    },
    correctAnswer: questionData.answer,
    timeLimitMs: DEFAULT_TIME_LIMIT_MS + (level > 1 ? 5000 : 0), // Slightly more time for higher levels
  };
}


// --- Main Round Generation Function ---
export function generateQuickThinkerRounds(
  numberOfRounds: number = TOTAL_ROUNDS_DEFAULT,
  targetLevel: number = 1 // Can be used to influence difficulty
): GameRound[] {
  
  const roundGenerators = [
    () => generateOddOneOutRound(targetLevel),
    () => generateSpeedMathRound(targetLevel),
    () => generateLogicMCQRound(targetLevel),
  ];

  const generatedRounds: GameRound[] = [];
  const usedQuestionSignatures = new Set<string>(); // To track unique questions

  while (generatedRounds.length < numberOfRounds) {
    const generatorIndex = Math.floor(Math.random() * roundGenerators.length);
    const newRound = roundGenerators[generatorIndex]();

    // Create a signature for the question to check for uniqueness (can be simple for now)
    let questionSignature = `${newRound.type}-${newRound.data.question || (newRound.data as OddOneOutData).title}`;
    if(newRound.type === 'odd-one-out'){
        questionSignature += (newRound.data as OddOneOutData).options.map(o => o.iconName).sort().join(',');
    } else if (newRound.type === 'speed-math'){
        questionSignature += (newRound.data as SpeedMathData).options.sort((a,b)=>a-b).join(',');
    }


    if (!usedQuestionSignatures.has(questionSignature)) {
      generatedRounds.push(newRound);
      usedQuestionSignatures.add(questionSignature);
    }
    
    // Safety break if we can't find enough unique questions (e.g., small generator pool)
    if (usedQuestionSignatures.size >= roundGenerators.length * 5 && generatedRounds.length < numberOfRounds) { 
      // If we've tried many times and still not enough, fill with potentially non-unique ones to meet count
      // This indicates the pool of unique questions might be too small for numberOfRounds
      const fallbackRound = roundGenerators[generatorIndex]();
      fallbackRound.id = getUniqueId() + "-fallback"; // Ensure ID is still unique
      generatedRounds.push(fallbackRound);
    }
  }
  
  return shuffleArray(generatedRounds);
}

// Example of how to get an icon component from its name
export const getIconComponent = (iconName?: keyof typeof import('lucide-react')): LucideIcon | null => {
  if (!iconName) return HelpCircle; // Default or null
  const icons = import('lucide-react');
  // This is a simplified way; dynamic imports might be needed for true tree-shaking if using many icons
  // For now, ensure used icons are directly imported or handle this map carefully.
  const iconMap: { [key: string]: LucideIcon } = {
    Apple, Banana, Car, Ship, Plane, Train, Brain, Lightbulb, HelpCircle, Puzzle
    // Add all icons you might use by name here
  };
  return iconMap[iconName] || HelpCircle;
};
