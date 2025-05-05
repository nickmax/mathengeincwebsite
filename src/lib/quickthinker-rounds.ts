import { MathRound, OddOneOutOption, QuickThinkerRound } from "../types/quickthinker";
import { shuffleArray } from "./utils";

// Logic for Speed Math Round
export function generateSpeedMathRound(level: number = 1): MathRound {
    // Define possible operations and number ranges based on level
    const operations = ['+', '-', '*'];
    const numRange = level * 5;

    // Randomly select two numbers and an operation
    const num1 = Math.floor(Math.random() * numRange) + 1;
    const num2 = Math.floor(Math.random() * numRange) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let question, answer;
    switch (operation) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
        case '*':
            question = `${num1} * ${num2}`;
            answer = num1 * num2;
            break;
        default:
            question = 'Invalid operation';
            answer = NaN;
    }

    return {
        type: 'speed-math',
        level,
        question,
        answer,
    };
}

// Logic for Logic MCQ Round
export function generateLogicMCQRound(level: number = 1) {
    // Simplified example - replace with actual logic questions
    const question = `What is the capital of France? (Level ${level})`;
    const options = ['Berlin', 'Paris', 'London', 'Rome'];
    const correctAnswer = 'Paris';

    return {
        type: 'logic-mcq',
        level,
        question,
        options,
        correctAnswer,
    };
}

// Logic for Odd One Out Round
export function generateOddOneOutRound(level: number = 1): QuickThinkerRound {
    const animals = [
        { id: 'dog', name: 'Dog', category: 'mammal' },
        { id: 'cat', name: 'Cat', category: 'mammal' },
        { id: 'elephant', name: 'Elephant', category: 'mammal' },
        { id: 'eagle', name: 'Eagle', category: 'bird' },
    ];

    // Randomly select the odd one out (always an 'eagle' for simplicity)
    const oddOneOut = animals.find(animal => animal.category === 'bird')!;

    // Create options, ensuring the odd one out is always included
    const options = animals.map(animal => ({
        id: animal.id,
        name: animal.name,
        isOdd: animal.id === oddOneOut.id,
    }));

    return {
        type: 'odd-one-out',
        level,
        question: `Which one is the odd one out? (Level ${level})`,
        data: { options },
        correctAnswer: oddOneOut.id, // Ensure correctAnswer matches the actual ID of the odd one out
    };
}


export function generateQuickThinkerRounds(numberOfRounds: number = 5): QuickThinkerRound[] {
    // Define question pool based on different round types
    const questionPool: QuickThinkerRound[] = [
        generateSpeedMathRound(),
        generateLogicMCQRound(),
        generateOddOneOutRound(),
    ];

    // Function to shuffle array (Durstenfeld shuffle algorithm)
    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateDistractors(answer: number): number[] {
        const options = new Set<number>([answer]);
        let attempts = 0;
        while (options.size < 4 && attempts < 100) {
            attempts++;
            const offsetRange = Math.max(3, Math.abs(Math.round(answer * 0.2)) + 1);
            const distractorOffset = Math.floor(Math.random() * (2 * offsetRange + 1)) - offsetRange;
            let distractor = Math.round(answer + distractorOffset); // Keep distractors as integers

            // Ensure distractor is different
            if (distractor !== answer) {
                options.add(distractor);
            }
        }
        // If the set still doesn't have 4 options, add some simple offsets.
        while (options.size < 4) {
            let offset = 1;
            while (options.has(answer + offset) && options.size < 4) {
                offset++;
            }
            options.add(answer + offset);
        }
        return Array.from(options).slice(0, 4);
    }


    // Pre-generate rounds and update options for speed-math
    questionPool.forEach((round, index) => {
        if (round.type === 'speed-math') {
            const answer = round.answer as number;
            const distractors = generateDistractors(answer);
            const options = shuffleArray([answer, ...distractors.slice(0, 3)]).map(num => num.toString());
            questionPool[index] = { ...round, options, correctAnswer: answer.toString() };
        }
    });

    // Function to ensure options are shuffled and correctAnswer is updated for 'odd-one-out'
    const updateOddOneOutRound = (round: QuickThinkerRound): QuickThinkerRound => {
        if (round.data && Array.isArray(round.data.options)) {
            const shuffledOptions = shuffleArray(round.data.options);
            const updatedData = { ...round.data, options: shuffledOptions };

            // Update correctAnswer for OddOneOut after shuffling options
            if (round.type === 'odd-one-out') {
                // Find the option that is odd
                const correctOption = shuffledOptions.find((opt: OddOneOutOption) => opt.isOdd);
                // If a correct option is found, update the round with the new correct answer. Otherwise, keep the existing one.
                return { ...round, data: updatedData, correctAnswer: correctOption ? correctOption.id : round.correctAnswer };
            }

            return { ...round, data: updatedData };
        }
        return round;
    };

    // Shuffle the pool and take the first 'numberOfRounds' items
    const shuffledPool = shuffleArray(questionPool);
    const selectedRounds = shuffledPool.slice(0, numberOfRounds);

    // Re-shuffle options within each selected round and update correctAnswer for OddOneOut
    return selectedRounds.map(updateOddOneOutRound);
}



