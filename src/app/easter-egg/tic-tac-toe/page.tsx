
import { TicTacToeGame } from '@/components/easter-egg/tic-tac-toe-game';

export default function TicTacToePage() {
  return (
    // Use flex and items-center to center the game card vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold tracking-wide mb-8 text-primary">Tic Tac Toe</h1>
       {/* The game component itself will manage its width */}
      <TicTacToeGame />
      <p className="mt-8 text-muted-foreground text-xs">(An Easter Egg by Mathenge Inc.)</p>
    </div>
  );
}
