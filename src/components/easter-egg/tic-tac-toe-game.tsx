
'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { X, Circle, RotateCcw } from 'lucide-react'; // Use icons for X and O

type Player = 'X' | 'O';
type SquareValue = Player | null;

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
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const winner = calculateWinner(squares);
  const isDraw = !winner && isBoardFull(squares);

  const handleClick = useCallback((i: number) => {
    if (winner || squares[i]) {
      return; // Ignore click if game is won or square is filled
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }, [squares, xIsNext, winner]);

  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  const renderSquare = (i: number) => {
    const value = squares[i];
    return (
      <Button
        variant="outline"
        className={cn(
          "aspect-square h-20 w-20 md:h-24 md:w-24 text-4xl font-bold rounded-lg border-primary/30",
          "bg-background/50 hover:bg-primary/10 transition-colors duration-200",
           "flex items-center justify-center glass-card", // Apply glass effect to squares
           value === 'X' ? 'text-primary' : 'text-foreground/80', // Primary for X, muted for O
           winner || isDraw ? 'cursor-not-allowed opacity-70' : '', // Dim squares when game over
        )}
        onClick={() => handleClick(i)}
        aria-label={`Square ${i + 1}, currently ${value || 'empty'}`}
        disabled={!!winner || !!isDraw}
      >
        {value === 'X' && <X className="h-12 w-12 stroke-[3]" />}
        {value === 'O' && <Circle className="h-10 w-10 stroke-[3]" />}
      </Button>
    );
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <Card className={cn("glass-card-glow p-4 md:p-6 border border-primary/20 shadow-lg shadow-primary/10")}>
       <CardContent className="flex flex-col items-center p-0">
          <div className="mb-4 text-2xl font-semibold text-foreground tracking-wide">{status}</div>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
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
          {(winner || isDraw) && (
            <Button
              onClick={handleReset}
              variant="default"
              className="mt-6 font-semibold btn-primary-gradient flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          )}
       </CardContent>
    </Card>
  );
}
