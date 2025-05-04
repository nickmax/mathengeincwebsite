
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

// --- Game Constants ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
// Player dimensions (Car shape)
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 25;
const PLAYER_X_POS = 50; // Fixed X position for the player car
// Obstacle dimensions (Cone shape)
const OBSTACLE_BASE_WIDTH = 20; // Width at the bottom
const OBSTACLE_HEIGHT = 35;
// Ground Level
const GROUND_Y = GAME_HEIGHT - PLAYER_HEIGHT;
// Physics
const GRAVITY = 0.6;
const JUMP_FORCE = 11; // Slightly less force for a car?
// Speed
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE = 0.001;
// Obstacle Spawning
const OBSTACLE_INTERVAL_MIN = 700; // ms
const OBSTACLE_INTERVAL_MAX = 1800; // ms

interface Obstacle {
  id: number;
  x: number;
  y: number; // Positioned on the ground
  width: number; // Base width
  height: number;
}

// Simple Car SVG for the player
const CarIcon = () => (
  <svg viewBox="0 0 50 25" fill="hsl(var(--primary))" className="w-full h-full">
    {/* Simple car body */}
    <rect x="0" y="5" width="50" height="15" rx="3" />
    {/* Roof */}
    <rect x="10" y="0" width="30" height="7" rx="2"/>
    {/* Wheels (simple circles) */}
    <circle cx="10" cy="20" r="5" fill="hsl(var(--foreground))" />
    <circle cx="40" cy="20" r="5" fill="hsl(var(--foreground))" />
  </svg>
);

// Simple Cone SVG for obstacles
const ConeIcon = () => (
    <svg viewBox="0 0 20 35" fill="hsl(var(--destructive))" className="w-full h-full opacity-80">
        <polygon points="10,0 0,35 20,35" />
        {/* Optional white stripes */}
        <rect x="2" y="10" width="16" height="4" fill="white" />
        <rect x="4" y="20" width="12" height="4" fill="white" />
    </svg>
);


export function DinoGame() {
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const playerY = useRef(GROUND_Y);
  const playerVelocityY = useRef(0);
  const playerRef = useRef<HTMLDivElement>(null);

  const obstacles = useRef<Obstacle[]>([]);
  const nextObstacleTime = useRef(0);
  const gameSpeed = useRef(INITIAL_GAME_SPEED);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  const scoreIntervalId = useRef<NodeJS.Timeout | null>(null);

  // Load high score
  useEffect(() => {
    const storedHighScore = localStorage.getItem('magariDashHighScore'); // Updated key
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('magariDashHighScore', score.toString()); // Updated key
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    console.log("Resetting Magari Dash...");
    playerY.current = GROUND_Y;
    playerVelocityY.current = 0;
    obstacles.current = [];
    gameSpeed.current = INITIAL_GAME_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false);
    nextObstacleTime.current = Date.now() + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN;
    lastTime.current = 0;

    if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;

    if (gameContainerRef.current) {
        const obstacleElements = gameContainerRef.current.querySelectorAll('.obstacle');
        obstacleElements.forEach(el => el.remove());
    }
     if (playerRef.current) {
        // Reset Y transform
        playerRef.current.style.transform = `translateY(0px)`;
     }

    console.log("Magari Dash reset complete.");
  }, []);


  const jump = useCallback(() => {
    // Allow jump only when on the ground and game is running
    if (playerY.current === GROUND_Y && isRunning && !isGameOver) {
       console.log("Jump initiated");
      playerVelocityY.current = -JUMP_FORCE;
    } else {
       console.log("Jump ignored - State:", { y: playerY.current, ground: GROUND_Y, running: isRunning, over: isGameOver });
    }
  }, [isRunning, isGameOver]);

  const startGame = useCallback(() => {
    console.log("Start game attempt:", { isRunning, isGameOver });
    if (isGameOver) {
        resetGame();
        return; // Require another interaction to start after reset
    }
    if (!isRunning) {
      console.log("Starting Magari Dash...");
      setIsRunning(true);
      setIsGameOver(false);
      lastTime.current = performance.now();
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
      scoreIntervalId.current = setInterval(() => {
           if (animationFrameId.current !== null) { // Only score if game loop is active
                setScore((s) => s + 1);
           }
      }, 100);
      gameLoop(performance.now());
    }
  }, [isRunning, isGameOver, resetGame]);


  const handleInput = useCallback((event: KeyboardEvent | TouchEvent) => {
    let isJumpInput = false;
    let eventType = 'unknown';

    if (event instanceof KeyboardEvent) {
      isJumpInput = (event.code === 'Space' || event.code === 'ArrowUp');
      eventType = 'keydown';
    } else if (event instanceof TouchEvent) {
      // Check if the touch is within the game container bounds
       if (gameContainerRef.current && event.target instanceof Node && gameContainerRef.current.contains(event.target)) {
          isJumpInput = true;
       }
      eventType = 'touchstart';
    }
     console.log(`Input detected: ${eventType}, isJumpInput: ${isJumpInput}`);


    if (isJumpInput) {
      event.preventDefault();
      if (!isRunning || isGameOver) {
        console.log("Input -> Starting/Resetting Game");
        startGame();
      } else {
         console.log("Input -> Jumping");
        jump();
      }
    }
  }, [isRunning, isGameOver, startGame, jump]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event);
    window.addEventListener('keydown', handleKeyDown);

    const gameEl = gameContainerRef.current;
    const handleTouchStart = (event: TouchEvent) => handleInput(event);
    if (gameEl) {
       // Use capture phase for touchstart to potentially intercept taps earlier
      gameEl.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    }

    return () => {
      console.log("Cleaning up listeners and game state");
      window.removeEventListener('keydown', handleKeyDown);
       if (gameEl) {
          gameEl.removeEventListener('touchstart', handleTouchStart, { capture: true });
       }
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
      animationFrameId.current = null;
      scoreIntervalId.current = null;
    };
  }, [handleInput]); // Rerun if handleInput changes


  const gameLoop = useCallback((currentTime: number) => {
    if (!isRunning || isGameOver) {
       console.log("Game loop stopped.", { isRunning, isGameOver });
       if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
       animationFrameId.current = null;
       if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
       scoreIntervalId.current = null;
       return;
    }

    const deltaTime = lastTime.current > 0 ? (currentTime - lastTime.current) / 16.67 : 1;
    lastTime.current = currentTime;


    // --- Update Player ---
    playerVelocityY.current += GRAVITY * deltaTime;
    playerY.current += playerVelocityY.current * deltaTime;

    if (playerY.current >= GROUND_Y) {
      playerY.current = GROUND_Y;
      playerVelocityY.current = 0;
    }

    // --- Update Obstacles ---
    obstacles.current = obstacles.current.filter(obstacle => obstacle.x + obstacle.width > 0);
    obstacles.current.forEach(obstacle => {
      obstacle.x -= gameSpeed.current * deltaTime;
    });

    // --- Add New Obstacles ---
    if (currentTime > nextObstacleTime.current) {
      // Simple cone obstacle
      obstacles.current.push({
        id: currentTime,
        x: GAME_WIDTH,
        y: GROUND_Y + PLAYER_HEIGHT - OBSTACLE_HEIGHT, // Base of cone aligns with car bottom
        width: OBSTACLE_BASE_WIDTH,
        height: OBSTACLE_HEIGHT,
      });

      const speedFactor = Math.max(0.5, gameSpeed.current / INITIAL_GAME_SPEED);
      const intervalRange = OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN;
      const nextInterval = (Math.random() * intervalRange + OBSTACLE_INTERVAL_MIN) / speedFactor;
      nextObstacleTime.current = currentTime + nextInterval;
      // console.log("Spawned obstacle, next in:", nextInterval.toFixed(0) + "ms");
    }

    // --- Collision Detection ---
    const playerRect = {
      x: PLAYER_X_POS,
      y: playerY.current,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };

    for (const obstacle of obstacles.current) {
        const obstacleRect = {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
        };

        // Simple AABB collision check
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
        ) {
            console.log("Collision detected!");
            setIsGameOver(true);
            setIsRunning(false);
             if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
             scoreIntervalId.current = null;

             // Update High Score immediately on game over
             if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('magariDashHighScore', score.toString());
             }
             if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             animationFrameId.current = null;
            return;
        }
    }

    // --- Increase Speed ---
    gameSpeed.current += SPEED_INCREASE * deltaTime;

    // --- Render ---
    if (playerRef.current) {
      // Apply Y transform based on physics calculation
      playerRef.current.style.transform = `translateY(${-(GROUND_Y - playerY.current)}px)`; // Negative for upward movement
    }

    // Render obstacles dynamically
    if (gameContainerRef.current) {
        const obstacleElements = Array.from(gameContainerRef.current.querySelectorAll('.obstacle')) as HTMLElement[];
        const currentIds = new Set(obstacles.current.map(o => o.id.toString()));
        const existingElementsMap = new Map(obstacleElements.map(el => [el.dataset.id, el]));

        obstacleElements.forEach(el => {
            if (!currentIds.has(el.dataset.id!)) {
                el.remove();
            }
        });

        obstacles.current.forEach(obstacle => {
            let element = existingElementsMap.get(obstacle.id.toString());
            if (element) {
                element.style.transform = `translateX(${obstacle.x}px)`;
            } else {
                const newEl = document.createElement('div');
                newEl.className = 'obstacle absolute'; // Base obstacle class
                newEl.style.left = `0px`; // Base position
                newEl.style.bottom = `${GAME_HEIGHT - (obstacle.y + obstacle.height)}px`; // Position from bottom edge
                newEl.style.transform = `translateX(${obstacle.x}px)`;
                newEl.style.width = `${obstacle.width}px`;
                newEl.style.height = `${obstacle.height}px`;
                newEl.dataset.id = obstacle.id.toString();
                // Use innerHTML to inject the SVG - simpler for this context
                newEl.innerHTML = `<svg viewBox="0 0 20 35" fill="hsl(var(--destructive))" class="w-full h-full opacity-80">
                                     <polygon points="10,0 0,35 20,35" />
                                     <rect x="2" y="10" width="16" height="4" fill="hsl(var(--background))" />
                                     <rect x="4" y="20" width="12" height="4" fill="hsl(var(--background))" />
                                   </svg>`;
                gameContainerRef.current?.appendChild(newEl);
            }
        });
    }


    // --- Request Next Frame ---
     if (isRunning && !isGameOver) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
     } else {
         if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
         animationFrameId.current = null;
         console.log("Game state changed, stopping frame requests.");
     }

  }, [isRunning, isGameOver, score, highScore]); // Include dependencies

  // Initial reset
  useEffect(() => {
    resetGame();
    console.log("Initial Magari Dash reset on mount.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount


  return (
    <div className="flex flex-col items-center">
       {/* Score Display */}
       <div className="flex justify-between w-full max-w-[600px] mb-2 px-1">
            <div className="text-lg font-semibold text-foreground">Score: {score}</div>
            <div className="text-lg font-semibold text-muted-foreground">High Score: {highScore}</div>
       </div>

       {/* Game Container */}
      <div
        ref={gameContainerRef}
        className={cn(
            "relative border-2 border-primary bg-background overflow-hidden shadow-lg shadow-primary/20 touch-manipulation cursor-pointer",
            "dark:bg-gradient-to-b dark:from-gray-900 dark:to-black", // Example dark mode gradient bg
            "light:bg-gradient-to-b light:from-blue-100 light:to-white" // Example light mode gradient bg
         )}
        style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
        tabIndex={0} // Make focusable, although window listener handles keys
      >
        {/* Player Car */}
        <div
          ref={playerRef}
          className="absolute transition-transform duration-50 ease-linear" // Transform for smooth Y
          style={{
            left: `${PLAYER_X_POS}px`,
            bottom: `0px`, // Initial visual position (transform handles jump)
            width: `${PLAYER_WIDTH}px`,
            height: `${PLAYER_HEIGHT}px`,
            transform: 'translateY(0px)' // Initial transform
          }}
        >
           <CarIcon /> {/* Use the SVG component */}
        </div>

        {/* Obstacles are rendered dynamically in gameLoop */}

        {/* Game Over / Start Message Overlay */}
        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
            <div className="text-center p-4 rounded-lg bg-background/80 border border-border">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-destructive mb-2">CRASHED!</h2>
                  <p className="text-lg text-foreground">Final Score: {score}</p>
                  <p className="mt-4 text-muted-foreground animate-pulse">Press Spacebar or Tap to Restart</p>
                </>
              ) : (
                <p className="text-xl font-semibold text-foreground animate-pulse">Press Spacebar or Tap to Start</p>
              )}
            </div>
          </div>
        )}

        {/* Ground Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-muted-foreground/50" />
      </div>
    </div>
  );
}
