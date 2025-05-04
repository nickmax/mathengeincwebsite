
import { DinoGame } from '@/components/easter-egg/dino-game';

export default function DinoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Updated Title */}
      <h1 className="text-3xl font-bold tracking-wide mb-8 text-primary">Magari Dash – The AutoCommerce Run</h1>
      <DinoGame />
      {/* Updated Helper Text */}
      <p className="mt-8 text-muted-foreground text-sm">Press Spacebar or Tap to Jump</p>
      <p className="text-muted-foreground text-xs mt-2">(An Easter Egg by Mathenge Inc.)</p>
    </div>
  );
}
