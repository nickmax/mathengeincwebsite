
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { X, Circle, RotateCcw, User, Bot } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;
type GameMode = 'select' | 'pvp' | 'pvc';

const calculateWinner = (squares: SquareValue[]): Player | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isBoardFull = (squares: SquareValue[]): boolean => {
  return squares.every(square => square !== null);
};

// Helper function to find available squares
const getAvailableSquares = (squares: SquareValue[]): number[] => {
  return squares
    .map((value, index) => (value === null ? index : null))
    .filter((index): index is number => index !== null);
};

// Basic Minimax-like AI logic for the computer
const findBestMove = (squares: SquareValue[]): number => {
  const availableSquares = getAvailableSquares(squares);
  const computer = 'O';
  const player = 'X';

  // 1. Check if Computer can win in the next move
  for (const index of availableSquares) {
    const tempSquares = squares.slice();
    tempSquares[index] = computer;
    if (calculateWinner(tempSquares) === computer) {
      return index;
    }
  }

  // 2. Check if Player can win in the next move, and block them
  for (const index of availableSquares) {
    const tempSquares = squares.slice();
    tempSquares[index] = player;
    if (calculateWinner(tempSquares) === player) {
      return index;
    }
  }

  // 3. Try to take the center if it's available
  if (squares[4] === null) {
    return 4;
  }

  // 4. Try to take a corner if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(index => squares[index] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Try to take a side if available (fallback)
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(index => squares[index] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // Should not happen if board is not full, but fallback to random
  return availableSquares[Math.floor(Math.random() * availableSquares.length)];
};


export function TicTacToeGame() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true); // Player X always starts
  const [gameMode, setGameMode] = useState<GameMode>('select');
  const [isComputerTurn, setIsComputerTurn] = useState<boolean>(false);

  const winner = calculateWinner(squares);
  const isDraw = !winner && isBoardFull(squares);
  const gameOver = !!winner || isDraw;

  // --- Computer Move Logic (PvC) ---
  const computerMove = useCallback(() => {
    // Ensure this only runs in PvC, when it's O's turn, game isn't over, and it's the computer's turn flag set
    if (gameMode !== 'pvc' || xIsNext || gameOver || !isComputerTurn) return;

    const bestMoveIndex = findBestMove(squares); // Use the AI function

    // Add a small delay for "thinking" effect
    const timeoutId = setTimeout(() => {
      const newSquares = squares.slice();
      // Double-check if the game is still in PvC and it's O's turn
      if (gameMode === 'pvc' && !xIsNext && !gameOver && newSquares[bestMoveIndex] === null) {
          newSquares[bestMoveIndex] = 'O';
          setSquares(newSquares);
          setXIsNext(true); // Set back to player's turn (X)
      }
      setIsComputerTurn(false); // Computer finished turn or conditions changed
    }, 500); // 500ms delay

    // Cleanup timeout if component unmounts or state changes rapidly
    return () => clearTimeout(timeoutId);

  }, [squares, xIsNext, gameOver, gameMode, isComputerTurn]);

  // Effect to trigger computer's move when it's their turn in PvC mode
  useEffect(() => {
    // Only trigger if PvC, O's turn, not game over, and computer's turn flag is set
    if (gameMode === 'pvc' && !xIsNext && !gameOver && isComputerTurn) {
      computerMove();
    }
  }, [gameMode, xIsNext, gameOver, isComputerTurn, computerMove]); // Ensure all dependencies are listed


  // --- Handlers ---
  const handleClick = useCallback((i: number) => {
    // Check if the game is over, the square is already filled, or if it's the computer's turn in PvC mode
    if (gameOver || squares[i] || (gameMode === 'pvc' && !xIsNext)) {
      return; // Ignore click if game over, square filled, or computer is playing
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);

    const nextPlayerIsX = !xIsNext;
    setXIsNext(nextPlayerIsX); // Toggle the player turn immediately for both modes

    // Recalculate game over state *after* the move
    const currentWinner = calculateWinner(newSquares);
    const boardIsFull = isBoardFull(newSquares);
    const isGameNowOver = !!currentWinner || boardIsFull;

    // Trigger computer move ONLY if PvC mode, it's now O's turn, and the game is NOT over
    if (gameMode === 'pvc' && !nextPlayerIsX && !isGameNowOver) {
        setIsComputerTurn(true); // Set flag for the useEffect to trigger computerMove
    } else {
        setIsComputerTurn(false); // Ensure computer turn flag is off otherwise (PvP or game is over)
    }

  }, [squares, xIsNext, gameOver, gameMode]); // Removed isComputerTurn dependency as it's set within this function

  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameMode('select'); // Go back to mode selection
    setIsComputerTurn(false);
  }, []);

  const handleModeSelect = (mode: GameMode) => {
     if (mode !== 'select') {
        setSquares(Array(9).fill(null)); // Reset board when mode changes
        setXIsNext(true);
        setIsComputerTurn(false); // Reset computer turn flag
        setGameMode(mode);
     }
  };

  // --- Rendering ---
  const renderSquare = (i: number) => {
    const value = squares[i];
    // Disable square if game over, square taken, OR (PvC mode AND computer's turn)
    const isDisabled = gameOver || !!squares[i] || (gameMode === 'pvc' && !xIsNext && isComputerTurn);
    return (
      <Button
        variant="outline"
        className={cn(
          "aspect-square h-20 w-20 md:h-24 md:w-24 text-4xl font-bold rounded-lg border-primary/30",
          // Use background/50 or accent for a subtle difference from card background
          "bg-background/50",
          "hover:bg-primary/10 transition-colors duration-200",
          "flex items-center justify-center",
          value === 'X' ? 'text-primary' : 'text-foreground/80',
          isDisabled ? 'cursor-not-allowed opacity-70' : '',
        )}
        onClick={() => handleClick(i)}
        aria-label={`Square ${i + 1}, currently ${value || 'empty'}`}
        disabled={isDisabled}
      >
        {value === 'X' && <X className="h-12 w-12 stroke-[3]" />}
        {value === 'O' && <Circle className="h-10 w-10 stroke-[3]" />}
      </Button>
    );
  };

  let status;
  if (winner) {
    status = gameMode === 'pvc' && winner === 'O' ? 'Computer Wins!' : `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else if (gameMode === 'pvc') {
      status = xIsNext ? "Your Turn (X)" : "Computer's Turn (O)...";
  } else { // PvP mode
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }


  return (
    // Apply glass effect directly to the Card component
    <Card className={cn(
        "glass-card-glow p-4 md:p-6 border border-primary/20 shadow-lg shadow-primary/10 w-full max-w-md"
        // bg-background/70 ensures it blends with the overall theme bg
        // backdrop-blur-xl adds the glass effect
        // Removed explicit background color to inherit from glass-card styles
        )}>
      <CardContent className="flex flex-col items-center p-0">

        {/* Mode Selection */}
        {gameMode === 'select' && (
          <div className="mb-6 text-center w-full">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Select Game Mode</h2>
             <RadioGroup defaultValue="pvp" onValueChange={(value) => handleModeSelect(value as GameMode)} className="flex justify-center gap-4">
              {/* Removed bg-background/50, kept border and hover:bg-accent */}
              <div className="flex items-center space-x-2 p-3 rounded-md border border-primary/20 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="pvp" id="pvp" />
                <Label htmlFor="pvp" className="flex items-center gap-1 cursor-pointer">
                    <User className="h-4 w-4"/> vs <User className="h-4 w-4"/> Player
                </Label>
              </div>
               {/* Removed bg-background/50, kept border and hover:bg-accent */}
              <div className="flex items-center space-x-2 p-3 rounded-md border border-primary/20 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="pvc" id="pvc" />
                <Label htmlFor="pvc" className="flex items-center gap-1 cursor-pointer">
                    <User className="h-4 w-4"/> vs <Bot className="h-4 w-4"/> Computer
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Game Board and Status */}
        {gameMode !== 'select' && (
          <>
            <div className="mb-4 text-2xl font-semibold text-foreground tracking-wide h-8">
              {status}
            </div>
            {/* Board container styling - subtle background to differentiate */}
            <div className={cn(
                "grid grid-cols-3 gap-2 md:gap-3 mb-6 p-2 rounded-lg",
                "bg-background/30 border border-white/10" // Slightly different background for the board area itself
                 )}>
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
             <Button
                onClick={handleReset}
                variant={gameOver ? 'default' : 'outline'}
                className={cn(
                    "font-semibold flex items-center gap-2",
                    gameOver && "btn-primary-gradient" // Apply gradient on game over
                 )}
              >
                <RotateCcw className="h-4 w-4" /> {gameOver ? 'Play Again' : 'Reset Game / Change Mode'}
              </Button>
          </>
        )}

      </CardContent>
    </Card>
  );
}
