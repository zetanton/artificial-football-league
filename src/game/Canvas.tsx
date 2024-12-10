import React, { useRef, useEffect } from 'react';
import { FieldRenderer } from './renderers/FieldRenderer';
import { PlayerRenderer } from './renderers/PlayerRenderer';
import { BallRenderer } from './renderers/BallRenderer';
import { GameState } from '../types/game';

interface CanvasProps {
  width: number;
  height: number;
  gameState: GameState;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with proper scaling
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(scale, scale);

    // Initialize renderers
    const fieldRenderer = new FieldRenderer(ctx, width, height);
    const playerRenderer = new PlayerRenderer(ctx, width, height);
    const ballRenderer = new BallRenderer(ctx, width, height);

    // Render game state
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render components in order
      fieldRenderer.render();
      playerRenderer.renderPlayers(gameState.currentFormation || 'I-Formation', gameState.ballPosition);
      ballRenderer.render(gameState.ballPosition);

      // Request next frame if game is in play
      if (gameState.playState === 'in-play') {
        requestAnimationFrame(render);
      }
    };

    render();

    // Cleanup
    return () => {
      if (gameState.playState === 'in-play') {
        cancelAnimationFrame(render as unknown as number);
      }
    };
  }, [width, height, gameState]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg bg-green-800 w-full"
      />
    </div>
  );
};

export default Canvas;