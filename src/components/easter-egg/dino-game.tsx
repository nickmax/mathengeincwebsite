
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
const MIN_OBSTACLE_INTERVAL = 500; // Minimum time between obstacles regardless of speed

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
// Replaced with direct SVG injection in gameLoop for simplicity with dynamic elements
// const ConeIcon = () => ( ... );


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
    setIsRunning(false); // Explicitly set running to false
    nextObstacleTime.current = Date.now() + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN;
    lastTime.current = 0;

    if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    scoreIntervalId.current = null;
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;

    // Remove existing obstacle elements from the DOM
    if (gameContainerRef.current) {
        const obstacleElements = gameContainerRef.current.querySelectorAll('.obstacle');
        obstacleElements.forEach(el => el.remove());
    }
     if (playerRef.current) {
        // Reset Y transform
        playerRef.current.style.transform = `translateY(0px)`;
     }

    console.log("Magari Dash reset complete.");
  }, []); // No dependencies needed here, it's a self-contained reset


  const jump = useCallback(() => {
    // Allow jump only when on the ground and game is running
    if (playerY.current === GROUND_Y && isRunning && !isGameOver) {
       console.log("Jump initiated");
      playerVelocityY.current = -JUMP_FORCE;
    } else {
       console.log("Jump ignored - State:", { y: playerY.current, ground: GROUND_Y, running: isRunning, over: isGameOver });
    }
  }, [isRunning, isGameOver]); // Depends on isRunning and isGameOver


  const gameLoop = useCallback((currentTime: number) => {
    // Crucial: Immediately request the next frame *before* logic
    // to ensure continuous loop unless explicitly stopped.
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Calculate deltaTime (guard against large jumps on first frame/tab switch)
    const timeSinceLastFrame = lastTime.current > 0 ? currentTime - lastTime.current : 16.67;
    const deltaTime = Math.min(3, timeSinceLastFrame / 16.67); // Cap deltaTime to prevent huge jumps (e.g., max 3x normal speed)
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
        id: currentTime, // Use timestamp as unique ID
        x: GAME_WIDTH,
        y: GROUND_Y + PLAYER_HEIGHT - OBSTACLE_HEIGHT, // Base of cone aligns with car bottom
        width: OBSTACLE_BASE_WIDTH,
        height: OBSTACLE_HEIGHT,
      });

      // Calculate next interval based on current speed, but ensure a minimum interval
      const speedFactor = Math.max(0.5, gameSpeed.current / INITIAL_GAME_SPEED);
      const intervalRange = OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN;
      let nextInterval = (Math.random() * intervalRange + OBSTACLE_INTERVAL_MIN) / speedFactor;
      nextInterval = Math.max(MIN_OBSTACLE_INTERVAL, nextInterval); // Ensure minimum time gap
      nextObstacleTime.current = currentTime + nextInterval;
      // console.log(`Spawned obstacle, next in: ${nextInterval.toFixed(0)}ms (Speed: ${gameSpeed.current.toFixed(2)})`);
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

        // Simple AABB collision check (add slight padding for visual tolerance)
        const collisionPadding = 2;
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width - collisionPadding &&
            playerRect.x + playerRect.width > obstacleRect.x + collisionPadding &&
            playerRect.y < obstacleRect.y + obstacleRect.height - collisionPadding &&
            playerRect.y + playerRect.height > obstacleRect.y + collisionPadding
        ) {
            console.log("Collision detected!");
            setIsGameOver(true);
            setIsRunning(false); // Stop running state

             // Stop score interval
             if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
             scoreIntervalId.current = null;

             // Update High Score immediately on game over
             if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('magariDashHighScore', score.toString());
             }

             // Crucially, cancel the *next* requested animation frame
             if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             animationFrameId.current = null;
            return; // Exit the loop immediately on collision
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

        // Remove obstacles that are no longer in the state
        obstacleElements.forEach(el => {
            if (!currentIds.has(el.dataset.id!)) {
                el.remove();
            }
        });

        // Update or add obstacles based on state
        obstacles.current.forEach(obstacle => {
            let element = existingElementsMap.get(obstacle.id.toString());
            if (element) {
                // Update existing element's position
                element.style.transform = `translateX(${obstacle.x}px)`;
            } else {
                // Create new element for new obstacle
                const newEl = document.createElement('div');
                newEl.className = 'obstacle absolute'; // Base obstacle class
                newEl.style.left = `0px`; // Base position (transform handles X)
                newEl.style.bottom = `${GAME_HEIGHT - (obstacle.y + obstacle.height)}px`; // Position from bottom edge
                newEl.style.transform = `translateX(${obstacle.x}px)`; // Initial X position
                newEl.style.width = `${obstacle.width}px`;
                newEl.style.height = `${obstacle.height}px`;
                newEl.dataset.id = obstacle.id.toString(); // Set ID for tracking
                // Use innerHTML to inject the SVG - ensures correct theme colors on creation
                newEl.innerHTML = `<svg viewBox="0 0 20 35" fill="hsl(var(--destructive))" class="w-full h-full opacity-80">
                                     <polygon points="10,0 0,35 20,35" />
                                     <rect x="2" y="10" width="16" height="4" fill="hsl(var(--background))" />
                                     <rect x="4" y="20" width="12" height="4" fill="hsl(var(--background))" />
                                   </svg>`;
                gameContainerRef.current?.appendChild(newEl); // Add to game container
            }
        });
    }

  }, [isRunning, isGameOver, score, highScore]); // Include dependencies for collision/score logic


    const startGame = useCallback(() => {
      console.log("Start game attempt:", { isRunning, isGameOver });
      if (isGameOver) {
          resetGame();
          // Re-set running immediately after reset to start game on next frame
          setIsRunning(true);
          setIsGameOver(false);
          lastTime.current = performance.now(); // Reset timer
          nextObstacleTime.current = performance.now() + OBSTACLE_INTERVAL_MIN; // Spawn first obstacle quickly
          if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
          scoreIntervalId.current = setInterval(() => setScore((s) => s + 1), 100);
          console.log("Restarting game loop after reset...");
          // Directly call gameLoop to start it *now*
          gameLoop(performance.now());
      } else if (!isRunning) {
          console.log("Starting Magari Dash for the first time...");
          setIsRunning(true);
          setIsGameOver(false);
          lastTime.current = performance.now(); // Reset timer
          nextObstacleTime.current = performance.now() + OBSTACLE_INTERVAL_MIN; // Spawn first obstacle quickly
          if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
          scoreIntervalId.current = setInterval(() => setScore((s) => s + 1), 100);
          console.log("Starting game loop...");
          // Directly call gameLoop to start it *now*
          gameLoop(performance.now());
      }
    }, [isRunning, isGameOver, resetGame, gameLoop]); // gameLoop is now a dependency

    const handleInput = useCallback((event: KeyboardEvent | TouchEvent) => {
      let isJumpInput = false;
      let eventType = 'unknown';

      if (event instanceof KeyboardEvent) {
        isJumpInput = (event.code === 'Space' || event.code === 'ArrowUp');
        eventType = 'keydown';
      } else if (event instanceof TouchEvent) {
         if (gameContainerRef.current && event.target instanceof Node && gameContainerRef.current.contains(event.target)) {
            isJumpInput = true;
         }
        eventType = 'touchstart';
      }
      console.log(`Input detected: ${eventType}, isJumpInput: ${isJumpInput}, State:`, { isRunning, isGameOver });

      if (isJumpInput) {
        event.preventDefault(); // Prevent spacebar scrolling or default touch behavior
        if (!isRunning || isGameOver) {
          console.log("Input -> Starting/Resetting Game");
          startGame();
        } else if (isRunning && !isGameOver) { // Only jump if game is actively running
          console.log("Input -> Jumping");
          jump();
        }
      }
    }, [isRunning, isGameOver, startGame, jump]); // Include dependencies


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event);
    window.addEventListener('keydown', handleKeyDown);

    const gameEl = gameContainerRef.current;
    const handleTouchStart = (event: TouchEvent) => handleInput(event);
    if (gameEl) {
      gameEl.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up listeners and game state");
      window.removeEventListener('keydown', handleKeyDown);
      if (gameEl) {
        gameEl.removeEventListener('touchstart', handleTouchStart, { capture: true });
      }
      // Crucial: Cancel any pending animation frame and interval on unmount
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
      scoreIntervalId.current = null;
    };
  }, [handleInput]); // Rerun if handleInput changes


  // Initial reset on mount
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
            "relative border-2 border-primary bg-background overflow-hidden shadow-lg shadow-primary/20",
            "touch-manipulation cursor-pointer", // Better mobile touch handling
            "dark:bg-gradient-to-b dark:from-gray-900 dark:to-black", // Example dark mode gradient bg
            "light:bg-gradient-to-b light:from-blue-100 light:to-white" // Example light mode gradient bg
         )}
        style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
        tabIndex={0} // Make focusable
        aria-label="Magari Dash game area. Press Space or Tap to Start/Jump." // Accessibility
      >
        {/* Player Car */}
        <div
          ref={playerRef}
          className="absolute transition-transform duration-50 ease-linear" // Transform for smooth Y
          style={{
            left: `${PLAYER_X_POS}px`,
            bottom: `0px`, // Base visual position (transform handles jump)
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10 pointer-events-none"> {/* pointer-events-none allows clicks through */}
            <div className="text-center p-4 rounded-lg bg-background/80 border border-border shadow-xl">
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

