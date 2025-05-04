import type { Metadata } from 'next';
import { TicTacToeGame } from '@/components/easter-egg/tic-tac-toe-game';
import { cn } from '@/lib/utils'; // Import cn for conditional classes if needed

// Specific metadata for the Tic Tac Toe page
export const metadata: Metadata = {
  title: 'Tic Tac Toe - Easter Egg',
  description: 'Play a fun game of Tic Tac Toe! An easter egg hidden within the Mathenge Inc. website. Challenge a friend or the computer.',
  robots: 'noindex, nofollow', // Discourage search engines from indexing this page
};


export default function TicTacToePage() {
  return (
    // Use flex and items-center to center the game card vertically and horizontally
    // Ensure bg-background is applied to use the theme's background
    <div className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        "bg-background" // Explicitly ensure theme background is applied
        )}>
      <h1 className="text-3xl font-bold tracking-wide mb-8 text-foreground">Tic Tac Toe</h1>
       {/* The game component itself will manage its width and appearance */}
      <TicTacToeGame />
      <p className="mt-8 text-muted-foreground text-xs">(An Easter Egg by Mathenge Inc.)</p>
    </div>
  );
}
