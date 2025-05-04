
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
const JUMP_FORCE = 11;
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
  element: HTMLDivElement | null; // Reference to the DOM element
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

// Simple Cone SVG content
const ConeSVG = `
  <svg viewBox="0 0 20 35" fill="hsl(var(--destructive))" class="w-full h-full opacity-80">
    <polygon points="10,0 0,35 20,35" />
    <rect x="2" y="10" width="16" height="4" fill="hsl(var(--background))" />
    <rect x="4" y="20" width="12" height="4" fill="hsl(var(--background))" />
  </svg>
`;

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
    // Ensure this runs only on the client
    const storedHighScore = localStorage.getItem('magariDashHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10) || 0);
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      // Ensure this runs only on the client
      localStorage.setItem('magariDashHighScore', score.toString());
    }
  }, [score, highScore]);

  const removeObstacleElement = (obstacle: Obstacle) => {
      if (obstacle.element && obstacle.element.parentNode) {
          obstacle.element.parentNode.removeChild(obstacle.element);
      }
      obstacle.element = null; // Clear the reference
  }

  const resetGame = useCallback(() => {
    console.log("Resetting Magari Dash...");
    playerY.current = GROUND_Y;
    playerVelocityY.current = 0;

    // Remove existing obstacle elements from the DOM and clear the array
    obstacles.current.forEach(removeObstacleElement);
    obstacles.current = [];

    gameSpeed.current = INITIAL_GAME_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false); // Start in non-running state

    if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    scoreIntervalId.current = null;
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;

     if (playerRef.current) {
        playerRef.current.style.transform = `translateY(0px)`;
     }

    console.log("Magari Dash reset complete.");
  }, []);

  const jump = useCallback(() => {
    // Allow jump only when on the ground and game is running
    if (playerY.current >= GROUND_Y - 1 && isRunning && !isGameOver) { // Use small tolerance for ground check
       console.log("Jump initiated");
      playerVelocityY.current = -JUMP_FORCE;
    } else {
       console.log("Jump ignored - State:", { y: playerY.current, ground: GROUND_Y, running: isRunning, over: isGameOver });
    }
  }, [isRunning, isGameOver]);


 const gameLoop = useCallback((currentTime: number) => {
    if (!isRunning) {
      animationFrameId.current = null; // Stop requesting frames if not running
      return;
    }

    // Calculate deltaTime
    const timeSinceLastFrame = lastTime.current > 0 ? currentTime - lastTime.current : 16.67; // Default to ~60fps
    const deltaTime = Math.min(timeSinceLastFrame / 16.67, 3); // Cap delta to prevent huge jumps
    lastTime.current = currentTime;

    // --- Update Player ---
    playerVelocityY.current += GRAVITY * deltaTime;
    playerY.current += playerVelocityY.current * deltaTime;

    if (playerY.current >= GROUND_Y) {
        playerY.current = GROUND_Y;
        playerVelocityY.current = 0;
    }

    // --- Update Obstacles ---
    const obstaclesToRemove: Obstacle[] = [];
    obstacles.current.forEach(obstacle => {
        obstacle.x -= gameSpeed.current * deltaTime;
        if (obstacle.element) {
            obstacle.element.style.transform = `translateX(${obstacle.x}px)`;
        }
        // Mark for removal if off-screen
        if (obstacle.x + obstacle.width < 0) {
            obstaclesToRemove.push(obstacle);
        }
    });

    // Remove off-screen obstacles
    obstaclesToRemove.forEach(obstacle => {
        removeObstacleElement(obstacle);
        obstacles.current = obstacles.current.filter(o => o.id !== obstacle.id);
    });

    // --- Add New Obstacles ---
    if (currentTime > nextObstacleTime.current) {
        const newObstacle: Obstacle = {
            id: currentTime,
            x: GAME_WIDTH,
            y: GROUND_Y + PLAYER_HEIGHT - OBSTACLE_HEIGHT,
            width: OBSTACLE_BASE_WIDTH,
            height: OBSTACLE_HEIGHT,
            element: null, // Initialize element as null
        };

        // Create and append the DOM element for the new obstacle
        if (gameContainerRef.current) {
            const newEl = document.createElement('div');
            newEl.className = 'obstacle absolute';
            newEl.style.left = `0px`;
            newEl.style.bottom = `${GAME_HEIGHT - (newObstacle.y + newObstacle.height)}px`;
            newEl.style.transform = `translateX(${newObstacle.x}px)`;
            newEl.style.width = `${newObstacle.width}px`;
            newEl.style.height = `${newObstacle.height}px`;
            newEl.dataset.id = newObstacle.id.toString();
            newEl.innerHTML = ConeSVG; // Inject the SVG content

            gameContainerRef.current.appendChild(newEl);
            newObstacle.element = newEl; // Store reference to the element
        }

        obstacles.current.push(newObstacle);

        // Calculate next interval
        const speedFactor = Math.max(0.5, gameSpeed.current / INITIAL_GAME_SPEED);
        const intervalRange = OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN;
        let nextInterval = (Math.random() * intervalRange + OBSTACLE_INTERVAL_MIN) / speedFactor;
        nextInterval = Math.max(MIN_OBSTACLE_INTERVAL, nextInterval);
        nextObstacleTime.current = currentTime + nextInterval;
    }

    // --- Collision Detection ---
    const playerRect = {
        x: PLAYER_X_POS,
        y: playerY.current,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
    };

    let collisionDetected = false;
    for (const obstacle of obstacles.current) {
        const obstacleRect = {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
        };
        const collisionPadding = 2;
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width - collisionPadding &&
            playerRect.x + playerRect.width > obstacleRect.x + collisionPadding &&
            playerRect.y < obstacleRect.y + obstacleRect.height - collisionPadding &&
            playerRect.y + playerRect.height > obstacleRect.y + collisionPadding
        ) {
            collisionDetected = true;
            break; // Exit loop on first collision
        }
    }

    if (collisionDetected) {
        console.log("Collision detected!");
        setIsGameOver(true);
        setIsRunning(false); // Stop running state

        if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
        scoreIntervalId.current = null;

        // Update High Score immediately
        setHighScore(prevHighScore => {
            if (score > prevHighScore) {
                localStorage.setItem('magariDashHighScore', score.toString());
                return score;
            }
            return prevHighScore;
        });

        // Stop the animation frame loop
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        return; // Stop further execution in this frame
    }

    // --- Increase Speed ---
    gameSpeed.current += SPEED_INCREASE * deltaTime;

    // --- Render Player ---
    if (playerRef.current) {
        playerRef.current.style.transform = `translateY(${-(GROUND_Y - playerY.current)}px)`;
    }

    // --- Request Next Frame ---
    // Ensure the loop continues ONLY if the game is still running
    if (isRunning && !isGameOver) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
    } else {
        animationFrameId.current = null; // Ensure we stop requesting if state changes mid-loop
    }

}, [isRunning, isGameOver, score, highScore, GRAVITY, JUMP_FORCE, GROUND_Y, SPEED_INCREASE, INITIAL_GAME_SPEED]);


    const startGame = useCallback(() => {
      console.log("Start game attempt:", { isRunning, isGameOver });
       // Always reset if game over, regardless of current running state
        if (isGameOver) {
            resetGame();
            // We need to set running AFTER resetGame completes its state updates
            // Use a small timeout or rely on the next input to truly start
            // For now, let's set it immediately but be aware of potential race conditions
            // A better approach might be to have resetGame directly trigger the start sequence
            // Or have handleInput call start only *after* reset if game was over.
            // Let's try setting running immediately after reset for simplicity first.
            setIsRunning(true); // Intentionally set running *after* reset
            setIsGameOver(false); // Ensure game over is false

            // Set initial timings for the new game start
            lastTime.current = performance.now();
            nextObstacleTime.current = lastTime.current + OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN);

            // Start score interval
            if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
            scoreIntervalId.current = setInterval(() => setScore((s) => s + 1), 100);

            console.log("Restarting game loop after reset...");
            // Start the animation loop
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else if (!isRunning) {
            // Only start if not already running and not game over
            console.log("Starting Magari Dash for the first time or resuming...");
            setIsRunning(true);
            setIsGameOver(false); // Ensure game over is false

            // Set initial timings
            lastTime.current = performance.now();
            nextObstacleTime.current = lastTime.current + OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN);

            // Start score interval
            if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
            scoreIntervalId.current = setInterval(() => setScore((s) => s + 1), 100);

            console.log("Starting game loop...");
            // Start the animation loop
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    }, [isRunning, isGameOver, resetGame, gameLoop]); // gameLoop is now a dependency

   const handleInput = useCallback((event: KeyboardEvent | TouchEvent) => {
    let isJumpInput = false;
    let eventType = 'unknown';

    if (event instanceof KeyboardEvent) {
        isJumpInput = (event.code === 'Space' || event.code === 'ArrowUp');
        eventType = 'keydown';
    } else if (event instanceof TouchEvent) {
        // Check if the touch event target is within the game container
        if (gameContainerRef.current && event.target instanceof Node && gameContainerRef.current.contains(event.target)) {
            isJumpInput = true;
        }
        eventType = 'touchstart';
    }

    console.log(`Input detected: ${eventType}, isJumpInput: ${isJumpInput}, State:`, { isRunning, isGameOver });

    if (isJumpInput) {
        event.preventDefault(); // Prevent default behaviors like space scrolling or mobile tap zooming

        if (!isRunning || isGameOver) {
            // If the game is not running OR it's game over, start/restart the game
            console.log("Input -> Starting/Restarting Game");
            // Important: Call startGame which handles the reset logic internally if needed
            startGame();
        } else {
            // If the game IS running and NOT game over, perform a jump
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
      // Use passive: false to allow preventDefault()
      gameEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      console.log("Cleaning up listeners and game state");
      window.removeEventListener('keydown', handleKeyDown);
      if (gameEl) {
        gameEl.removeEventListener('touchstart', handleTouchStart);
      }
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
      // Remove any remaining obstacle elements on cleanup
       obstacles.current.forEach(removeObstacleElement);
    };
  }, [handleInput]); // Rerun if handleInput (and its dependencies like startGame, jump) changes


  // Initial reset on mount
  useEffect(() => {
    resetGame();
    console.log("Initial Magari Dash reset on mount.");
  }, [resetGame]); // Use resetGame as dependency


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
            "touch-manipulation cursor-pointer select-none", // Prevent text selection
            "dark:bg-gradient-to-b dark:from-gray-900 dark:to-black",
            "light:bg-gradient-to-b light:from-blue-100 light:to-white"
         )}
        style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
        tabIndex={0} // Make focusable for keyboard input
        aria-label="Magari Dash game area. Press Space or Tap to Start/Jump."
      >
        {/* Player Car */}
        <div
          ref={playerRef}
          className="absolute transition-transform duration-50 ease-linear"
          style={{
            left: `${PLAYER_X_POS}px`,
            bottom: `0px`, // Visual position based on CSS bottom
            width: `${PLAYER_WIDTH}px`,
            height: `${PLAYER_HEIGHT}px`,
            transform: `translateY(${-(GROUND_Y - playerY.current)}px)`, // Dynamically set Y position via transform
            zIndex: 10 // Ensure player is above obstacles visually
          }}
        >
           <CarIcon />
        </div>

        {/* Obstacles are rendered dynamically and appended here by gameLoop */}

        {/* Game Over / Start Message Overlay */}
        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-20 pointer-events-none">
            <div className="text-center p-4 rounded-lg bg-background/80 border border-border shadow-xl">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-destructive mb-2">CRASHED!</h2>
                  <p className="text-lg text-foreground">Final Score: {score}</p>
                  <p className="mt-4 text-muted-foreground animate-pulse">Press Spacebar or Tap to Restart</p>
                </>
              ) : (
                 // Initial state message
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

    