
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
    if (gameMode !== 'pvc' || xIsNext || gameOver || !isComputerTurn) return;

    const availableSquares = squares
      .map((value, index) => (value === null ? index : null))
      .filter((index): index is number => index !== null);

    if (availableSquares.length === 0) {
      setIsComputerTurn(false);
      return;
    }

    // Simple AI: Random move
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    const computerSquareIndex = availableSquares[randomIndex];

    // Add a small delay for "thinking" effect
    const timeoutId = setTimeout(() => {
      const newSquares = squares.slice();
      newSquares[computerSquareIndex] = 'O';
      setSquares(newSquares);
      setXIsNext(true); // Set back to player's turn
      setIsComputerTurn(false); // Computer finished turn
    }, 500); // 500ms delay

    // Cleanup timeout if component unmounts or state changes rapidly
    return () => clearTimeout(timeoutId);

  }, [squares, xIsNext, gameOver, gameMode, isComputerTurn]);

  // Effect to trigger computer's move when it's their turn in PvC mode
  useEffect(() => {
    if (isComputerTurn) {
      computerMove();
    }
  }, [isComputerTurn, computerMove]);


  // --- Handlers ---
  const handleClick = useCallback((i: number) => {
    if (gameOver || squares[i] || (gameMode === 'pvc' && !xIsNext)) {
      return; // Ignore click if game over, square filled, or computer's turn
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);

    const nextPlayerIsX = !xIsNext;
    setXIsNext(nextPlayerIsX);

    // Trigger computer move if PvC mode and it's now O's turn
    if (gameMode === 'pvc' && !nextPlayerIsX && !calculateWinner(newSquares) && !isBoardFull(newSquares)) {
        setIsComputerTurn(true);
    }

  }, [squares, xIsNext, gameOver, gameMode]);

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
        setIsComputerTurn(false);
        setGameMode(mode);
     }
  };

  // --- Rendering ---
  const renderSquare = (i: number) => {
    const value = squares[i];
    const isDisabled = gameOver || (gameMode === 'pvc' && isComputerTurn);
    return (
      <Button
        variant="outline"
        className={cn(
          "aspect-square h-20 w-20 md:h-24 md:w-24 text-4xl font-bold rounded-lg border-primary/30",
          "bg-background/50 hover:bg-primary/10 transition-colors duration-200",
          "flex items-center justify-center glass-card",
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
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }


  return (
    <Card className={cn("glass-card-glow p-4 md:p-6 border border-primary/20 shadow-lg shadow-primary/10 w-full max-w-md")}>
      <CardContent className="flex flex-col items-center p-0">

        {/* Mode Selection */}
        {gameMode === 'select' && (
          <div className="mb-6 text-center w-full">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Select Game Mode</h2>
             <RadioGroup defaultValue="pvp" onValueChange={(value) => handleModeSelect(value as GameMode)} className="flex justify-center gap-4">
              <div className="flex items-center space-x-2 p-3 rounded-md bg-background/50 border border-primary/20 cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="pvp" id="pvp" />
                <Label htmlFor="pvp" className="flex items-center gap-1 cursor-pointer">
                    <User className="h-4 w-4"/> vs <User className="h-4 w-4"/> Player
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-md bg-background/50 border border-primary/20 cursor-pointer hover:bg-accent transition-colors">
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
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
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
                    gameOver && "btn-primary-gradient"
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
