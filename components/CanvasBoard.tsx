"use client";

import { useRef, useEffect, useState } from 'react';
import { drawLine, floodFill, Point } from '@/lib/canvas';
import { ToolType } from './Toolbar';
import { audio } from '@/lib/audio';

interface CanvasBoardProps {
  tool: ToolType;
  color: string;
  outlineSrc: string; // URL to the SVG outline
}

export default function CanvasBoard({ tool, color, outlineSrc }: CanvasBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef<Point | null>(null);

  // Initialize canvas size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Set actual canvas size to match display size for 1:1 pixel mapping
        // For retina, we might want to scale up, but let's keep it simple for now
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const point = getPoint(e);

    if (tool === 'fill') {
      floodFill(ctx, point.x, point.y, color);
      audio.play('fill');
    } else {
      setIsDrawing(true);
      lastPoint.current = point;

      // Draw a dot for immediate feedback
      ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, tool === 'eraser' ? 20 : 10, 0, Math.PI * 2);
      ctx.fill();

      // Play brush sound (throttled in a real app, but here just on start)
      audio.play('brush');
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current || !lastPoint.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    const drawColor = tool === 'eraser' ? '#ffffff' : color;
    const lineWidth = tool === 'eraser' ? 40 : 20;

    drawLine(ctx, lastPoint.current, currentPoint, drawColor, lineWidth);
    lastPoint.current = currentPoint;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-white rounded-3xl shadow-inner overflow-hidden touch-none">
      {/* Painting Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Outline Layer (SVG overlay) */}
      {/* Pointer events none so clicks pass through to canvas */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: `url(${outlineSrc})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}
