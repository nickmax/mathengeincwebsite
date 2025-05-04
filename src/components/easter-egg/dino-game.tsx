
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
    playerY.current = GROUND_Y;
    playerVelocityY.current = 0;
    obstacles.current = [];
    gameSpeed.current = INITIAL_GAME_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false); // Wait for user input to start
    nextObstacleTime.current = Date.now() + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN;
    lastTime.current = 0; // Reset time for game loop delta
    if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null; // Ensure animation frame is cleared
    // Request the first frame to draw initial state if needed, or wait for start
  }, []);


  const jump = useCallback(() => {
    if (playerY.current === GROUND_Y && isRunning) {
      playerVelocityY.current = -JUMP_FORCE;
    }
  }, [isRunning]);

  const startGame = useCallback(() => {
    if (!isRunning && isGameOver) {
        resetGame(); // Reset if game was over
        // Don't start immediately, wait for space/tap after reset message
    }
    if (!isRunning && !isGameOver) {
      setIsRunning(true);
      lastTime.current = performance.now(); // Initialize time for the first frame
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current); // Clear existing interval if any
      scoreIntervalId.current = setInterval(() => {
          setScore((s) => s + 1);
      }, 100); // Increment score every 100ms
      gameLoop(performance.now()); // Start the game loop
    } else if(isGameOver) {
        // If game is over, first press/tap resets, second one starts
        resetGame();
    }
  }, [isRunning, isGameOver, resetGame]); // Added resetGame dependency


  const handleInput = useCallback((event: KeyboardEvent | TouchEvent) => {
    let isJumpKey = false;
    if (event instanceof KeyboardEvent) {
      isJumpKey = event.code === 'Space';
    } else if (event instanceof TouchEvent) {
      isJumpKey = true; // Any tap is jump
    }

    if (isJumpKey) {
      event.preventDefault(); // Prevent space scrolling / default tap behavior
      if (!isRunning || isGameOver) {
        startGame();
      } else {
        jump();
      }
    }
  }, [isRunning, isGameOver, startGame, jump]);


  useEffect(() => {
    // Keyboard listener
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event);
    window.addEventListener('keydown', handleKeyDown);

    // Touch listener
    const handleTouchStart = (event: TouchEvent) => handleInput(event);
    document.addEventListener('touchstart', handleTouchStart); // Listen on document for mobile taps

    // Cleanup listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    };
  }, [handleInput]); // Re-attach if handleInput changes


  const gameLoop = useCallback((currentTime: number) => {
    if (!isRunning || isGameOver) {
       if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
       animationFrameId.current = null; // Clear ref when loop stops
       return;
    }

    const deltaTime = lastTime.current > 0 ? (currentTime - lastTime.current) / 16.67 : 1; // Normalize based on ~60fps, handle first frame
    lastTime.current = currentTime;


    // --- Update Player ---
    playerVelocityY.current += GRAVITY * deltaTime;
    playerY.current += playerVelocityY.current * deltaTime;

    if (playerY.current > GROUND_Y) {
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
        y: GAME_HEIGHT - OBSTACLE_HEIGHT,
        width: newWidth,
        height: OBSTACLE_HEIGHT,
      });
      nextObstacleTime.current = currentTime + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN / (gameSpeed.current / INITIAL_GAME_SPEED); // Spawn faster as speed increases
    }

    // --- Collision Detection ---
    const playerRect = {
      x: PLAYER_SIZE, // Assuming player is at a fixed x position conceptually
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
            setIsGameOver(true);
            setIsRunning(false);
             if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
            // Update High Score potentially
             if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('crimsonRunnerHighScore', score.toString());
             }
            return; // Stop the loop on game over
        }
    }

    // --- Increase Speed ---
    gameSpeed.current += SPEED_INCREASE * deltaTime;

    // --- Render ---
    // Update player position visually
    if (playerRef.current) {
      playerRef.current.style.bottom = `${GAME_HEIGHT - playerY.current - PLAYER_SIZE}px`;
    }

     // Update obstacles visually (more direct manipulation for performance)
    if (gameContainerRef.current) {
        const obstacleElements = gameContainerRef.current.querySelectorAll('.obstacle');
        // Basic sync - remove elements not in obstacles.current, update existing ones
        const currentIds = new Set(obstacles.current.map(o => o.id.toString()));

        obstacleElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (!currentIds.has(htmlEl.dataset.id!)) {
                htmlEl.remove();
            } else {
                const obstacleData = obstacles.current.find(o => o.id.toString() === htmlEl.dataset.id);
                 if (obstacleData) {
                    htmlEl.style.left = `${obstacleData.x}px`;
                    // Width/Height are set once on creation
                 }
            }
        });

        // Add new elements
        obstacles.current.forEach(obstacle => {
             if (!gameContainerRef.current?.querySelector(`[data-id="${obstacle.id}"]`)) {
                 const newEl = document.createElement('div');
                 newEl.className = 'obstacle absolute bottom-0 bg-muted-foreground'; // Style as obstacle
                 newEl.style.left = `${obstacle.x}px`;
                 newEl.style.width = `${obstacle.width}px`;
                 newEl.style.height = `${obstacle.height}px`;
                 newEl.dataset.id = obstacle.id.toString();
                 gameContainerRef.current?.appendChild(newEl);
             }
        });

    }


    // --- Request Next Frame ---
    animationFrameId.current = requestAnimationFrame(gameLoop);

  }, [isRunning, isGameOver, score, highScore]); // Ensure all state dependencies are included

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
       if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    };
  }, []);


  return (
    <div className="flex flex-col items-center">
       <div className="flex justify-between w-full max-w-[600px] mb-2 px-1">
            <div className="text-lg font-semibold text-foreground">Score: {score}</div>
            <div className="text-lg font-semibold text-muted-foreground">High Score: {highScore}</div>
       </div>
      <div
        ref={gameContainerRef}
        className="relative border-2 border-primary bg-background overflow-hidden shadow-lg shadow-primary/20"
        style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
      >
        {/* Player */}
        <div
          ref={playerRef}
          className="absolute bg-primary rounded"
          style={{
            left: `${PLAYER_SIZE}px`, // Fixed horizontal position
            bottom: `0px`, // Initial position at ground, updated by gameLoop
            width: `${PLAYER_SIZE}px`,
            height: `${PLAYER_SIZE}px`,
            transition: 'bottom 0.05s linear', // Smoother visual updates might need adjustment
          }}
        />

        {/* Obstacles - Rendered dynamically in gameLoop */}


        {/* Game Over / Start Message */}
        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="text-center">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-destructive mb-2">Game Over!</h2>
                  <p className="text-lg text-foreground">Final Score: {score}</p>
                  <p className="mt-4 text-muted-foreground">Press Spacebar or Tap to Restart</p>
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
