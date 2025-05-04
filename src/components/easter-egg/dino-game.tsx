
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const PLAYER_SIZE = 30;
const OBSTACLE_MIN_WIDTH = 15;
const OBSTACLE_MAX_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const GROUND_Y = GAME_HEIGHT - PLAYER_SIZE;
const GRAVITY = 0.6;
const JUMP_FORCE = 12;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE = 0.001;
const OBSTACLE_INTERVAL_MIN = 800; // ms
const OBSTACLE_INTERVAL_MAX = 2000; // ms

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

  // Load high score from local storage
  useEffect(() => {
    const storedHighScore = localStorage.getItem('crimsonRunnerHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  // Save high score to local storage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('crimsonRunnerHighScore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    console.log("Resetting game...");
    playerY.current = GROUND_Y;
    playerVelocityY.current = 0;
    obstacles.current = [];
    gameSpeed.current = INITIAL_GAME_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false); // Wait for user input to start
    nextObstacleTime.current = Date.now() + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN;
    lastTime.current = 0; // Reset time for game loop delta

    // Clear any existing intervals/frames
    if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;

    // Clear visual obstacles
    if (gameContainerRef.current) {
        const obstacleElements = gameContainerRef.current.querySelectorAll('.obstacle');
        obstacleElements.forEach(el => el.remove());
    }
     // Reset player visual position
     if (playerRef.current) {
        playerRef.current.style.bottom = `0px`; // Back to ground visually
     }

    console.log("Game reset complete.");
  }, []);


  const jump = useCallback(() => {
    if (playerY.current === GROUND_Y && isRunning && !isGameOver) {
       console.log("Jump initiated");
      playerVelocityY.current = -JUMP_FORCE;
    } else {
       console.log("Jump ignored - not on ground or not running/game over", playerY.current, isRunning, isGameOver);
    }
  }, [isRunning, isGameOver]); // Added isGameOver dependency

  const startGame = useCallback(() => {
    console.log("Start game attempt:", { isRunning, isGameOver });
    if (isGameOver) {
        resetGame(); // Reset first if game was over
        // resetGame sets isRunning to false, so the next condition will trigger on the *next* press/tap
        return; // Don't start immediately after reset, require another interaction
    }
    if (!isRunning) {
      console.log("Starting game now...");
      setIsRunning(true);
      setIsGameOver(false); // Explicitly set game over to false
      lastTime.current = performance.now(); // Initialize time for the first frame
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current); // Clear existing interval if any
      scoreIntervalId.current = setInterval(() => {
          // Only increment score if the game is actually running
           if (animationFrameId.current !== null) {
                setScore((s) => s + 1);
           }
      }, 100); // Increment score every 100ms
      gameLoop(performance.now()); // Start the game loop
    }
  }, [isRunning, isGameOver, resetGame]); // Added resetGame dependency


  const handleInput = useCallback((event: KeyboardEvent | TouchEvent) => {
    let isJumpKey = false;
    let eventType = 'unknown';
    if (event instanceof KeyboardEvent) {
      isJumpKey = event.code === 'Space';
      eventType = 'keydown';
    } else if (event instanceof TouchEvent) {
      isJumpKey = true; // Any tap is jump
      eventType = 'touchstart';
    }
    console.log(`Input detected: ${eventType}, isJumpKey: ${isJumpKey}`);


    if (isJumpKey) {
      event.preventDefault(); // Prevent space scrolling / default tap behavior
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
    // Keyboard listener
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event);
    window.addEventListener('keydown', handleKeyDown);

    // Touch listener - Attach to the game container for better control on mobile
    const gameEl = gameContainerRef.current;
    const handleTouchStart = (event: TouchEvent) => handleInput(event);
    if (gameEl) {
      gameEl.addEventListener('touchstart', handleTouchStart, { passive: false }); // Need passive: false to allow preventDefault
    }


    // Cleanup listeners
    return () => {
      console.log("Cleaning up listeners and game state");
      window.removeEventListener('keydown', handleKeyDown);
       if (gameEl) {
          gameEl.removeEventListener('touchstart', handleTouchStart);
       }
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
      animationFrameId.current = null; // Ensure clear on unmount
      scoreIntervalId.current = null; // Ensure clear on unmount
    };
  }, [handleInput]); // Re-attach if handleInput changes


  const gameLoop = useCallback((currentTime: number) => {
     // Important: Check isRunning and isGameOver at the start of each loop iteration
    if (!isRunning || isGameOver) {
       console.log("Game loop stopped.", { isRunning, isGameOver });
       if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
       animationFrameId.current = null; // Clear ref when loop stops
       if (scoreIntervalId.current) clearInterval(scoreIntervalId.current); // Also stop score when loop stops
       scoreIntervalId.current = null;
       return;
    }

    const deltaTime = lastTime.current > 0 ? (currentTime - lastTime.current) / 16.67 : 1; // Normalize based on ~60fps, handle first frame
    lastTime.current = currentTime;


    // --- Update Player ---
    playerVelocityY.current += GRAVITY * deltaTime;
    playerY.current += playerVelocityY.current * deltaTime;

    if (playerY.current >= GROUND_Y) { // Use >= for safety
      playerY.current = GROUND_Y;
      playerVelocityY.current = 0;
    }

    // --- Update Obstacles ---
    obstacles.current = obstacles.current.filter(obstacle => obstacle.x + obstacle.width > 0); // Remove off-screen obstacles
    obstacles.current.forEach(obstacle => {
      obstacle.x -= gameSpeed.current * deltaTime;
    });

    // --- Add New Obstacles ---
    if (currentTime > nextObstacleTime.current) {
      const newWidth = Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) + OBSTACLE_MIN_WIDTH;
      obstacles.current.push({
        id: currentTime, // Use timestamp as unique ID
        x: GAME_WIDTH,
        y: GROUND_Y, // Obstacles start on the ground
        width: newWidth,
        height: OBSTACLE_HEIGHT,
      });
      // Spawn faster as speed increases, ensure interval doesn't get too small
      const speedFactor = Math.max(0.5, gameSpeed.current / INITIAL_GAME_SPEED); // Cap minimum interval reduction
      const intervalRange = OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN;
      const nextInterval = (Math.random() * intervalRange + OBSTACLE_INTERVAL_MIN) / speedFactor;
      nextObstacleTime.current = currentTime + nextInterval;
      console.log("Spawned obstacle, next in:", nextInterval.toFixed(0) + "ms");
    }

    // --- Collision Detection ---
    const playerRect = {
      x: PLAYER_SIZE, // Player's fixed X position
      y: playerY.current,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };

    for (const obstacle of obstacles.current) {
       // Adjust obstacle Rect based on its current position
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
            setIsRunning(false); // Stop the game immediately
             if (scoreIntervalId.current) clearInterval(scoreIntervalId.current); // Stop score interval
             scoreIntervalId.current = null;

             // Update High Score potentially (already handled by useEffect, but good to be explicit)
             if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('crimsonRunnerHighScore', score.toString());
             }
             // Cancel the *next* frame request explicitly here
             if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             animationFrameId.current = null;
            return; // Stop the loop execution immediately on game over
        }
    }

    // --- Increase Speed ---
    gameSpeed.current += SPEED_INCREASE * deltaTime;

    // --- Render ---
    // Update player position visually
    if (playerRef.current) {
      playerRef.current.style.transform = `translateY(${GROUND_Y - playerY.current}px)`;
    }

     // Update obstacles visually (more direct manipulation for performance)
    if (gameContainerRef.current) {
        const obstacleElements = Array.from(gameContainerRef.current.querySelectorAll('.obstacle')) as HTMLElement[];
        const currentIds = new Set(obstacles.current.map(o => o.id.toString()));
        const existingElementsMap = new Map(obstacleElements.map(el => [el.dataset.id, el]));

        // Remove elements not in current obstacles
        obstacleElements.forEach(el => {
            if (!currentIds.has(el.dataset.id!)) {
                el.remove();
            }
        });

        // Update existing and add new elements
        obstacles.current.forEach(obstacle => {
            const element = existingElementsMap.get(obstacle.id.toString());
            if (element) {
                // Update existing element's position
                element.style.transform = `translateX(${obstacle.x}px)`;
            } else {
                // Add new element
                const newEl = document.createElement('div');
                newEl.className = 'obstacle absolute bottom-0 bg-muted-foreground'; // Style as obstacle
                newEl.style.left = `0px`; // Initial left position (transform handles actual x)
                newEl.style.transform = `translateX(${obstacle.x}px)`;
                newEl.style.width = `${obstacle.width}px`;
                newEl.style.height = `${obstacle.height}px`;
                newEl.dataset.id = obstacle.id.toString();
                gameContainerRef.current?.appendChild(newEl);
            }
        });
    }


    // --- Request Next Frame ---
    // Only request if still running and not game over
     if (isRunning && !isGameOver) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
     } else {
         // Ensure cancellation if state changed mid-loop before this point
         if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
         animationFrameId.current = null;
         console.log("Game state changed mid-loop, stopping frame requests.");
     }

  }, [isRunning, isGameOver, score, highScore]); // Ensure all state dependencies are included

  // Initial setup / Reset effect
  useEffect(() => {
    resetGame(); // Reset game state when component mounts
    console.log("Initial game reset on mount.");
  }, [resetGame]); // Depend on resetGame


  return (
    <div className="flex flex-col items-center">
       <div className="flex justify-between w-full max-w-[600px] mb-2 px-1">
            <div className="text-lg font-semibold text-foreground">Score: {score}</div>
            <div className="text-lg font-semibold text-muted-foreground">High Score: {highScore}</div>
       </div>
      <div
        ref={gameContainerRef}
        className="relative border-2 border-primary bg-background overflow-hidden shadow-lg shadow-primary/20 touch-manipulation cursor-pointer" // Added touch-manipulation and cursor-pointer
        style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
        // tabIndex={0} // Make it focusable for keyboard events, though window listener is used
      >
        {/* Player */}
        <div
          ref={playerRef}
          className="absolute bg-primary rounded transition-transform duration-50 ease-linear" // Use transform for smoother Y movement
          style={{
            left: `${PLAYER_SIZE}px`, // Fixed horizontal position
            bottom: `0px`, // Initial position at ground visually
            width: `${PLAYER_SIZE}px`,
            height: `${PLAYER_SIZE}px`,
            // transform is updated in gameLoop
          }}
        />

        {/* Obstacles - Rendered dynamically in gameLoop */}


        {/* Game Over / Start Message */}
        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
            <div className="text-center p-4 rounded-lg bg-background/80">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-destructive mb-2">Game Over!</h2>
                  <p className="text-lg text-foreground">Final Score: {score}</p>
                  <p className="mt-4 text-muted-foreground animate-pulse">Press Spacebar or Tap to Restart</p>
                </>
              ) : (
                 // Initial state before first start
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
