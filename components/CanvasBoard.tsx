"use client";

import { useRef, useEffect, useState } from 'react';
import { drawLine, floodFill, Point } from '@/lib/canvas';
import { ToolType } from './Toolbar';
import { audio } from '@/lib/audio';

interface CanvasBoardProps {
  tool: ToolType;
  color: string;
  outlineSrc: string; // URL to the SVG outline
  onHistoryChange?: (canUndo: boolean) => void;
  undoTrigger?: number; // Increment this to trigger undo
}

export default function CanvasBoard({ tool, color, outlineSrc, onHistoryChange, undoTrigger }: CanvasBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef<Point | null>(null);

  // History management
  const historyRef = useRef<ImageData[]>([]);
  const MAX_HISTORY = 20;

  const saveToHistory = () => {
    if (!paintCanvasRef.current) return;
    const ctx = paintCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const { width, height } = paintCanvasRef.current;
    // Save current state
    const imageData = ctx.getImageData(0, 0, width, height);

    historyRef.current.push(imageData);
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }

    // Notify parent about history state
    onHistoryChange?.(historyRef.current.length > 0);
  };

  // Handle undo trigger
  useEffect(() => {
    if (undoTrigger && undoTrigger > 0) {
      if (historyRef.current.length === 0) return;

      const previousState = historyRef.current.pop();
      if (previousState && paintCanvasRef.current) {
        const ctx = paintCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.putImageData(previousState, 0, 0);
        }
      }

      onHistoryChange?.(historyRef.current.length > 0);
    }
  }, [undoTrigger]);

  // Initialize canvas size and load outline
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && paintCanvasRef.current && outlineCanvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Update both canvases
        [paintCanvasRef.current, outlineCanvasRef.current].forEach(canvas => {
          canvas.width = width;
          canvas.height = height;
        });

        // Redraw outline after resize
        drawOutline();
      }
    };

    const drawOutline = () => {
      const canvas = outlineCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = outlineSrc;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image scaled to fit, centered
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Also redraw outline when src changes
    drawOutline();

    return () => window.removeEventListener('resize', updateSize);
  }, [outlineSrc]);

  const getPoint = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point => {
    if (!paintCanvasRef.current) return { x: 0, y: 0 };

    const rect = paintCanvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (!paintCanvasRef.current) return;

    const ctx = paintCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const point = getPoint(e);

    if (tool === 'fill') {
      // Save state before filling
      saveToHistory();

      // Pass the outline canvas context to flood fill for boundary detection
      const outlineCtx = outlineCanvasRef.current?.getContext('2d');
      if (outlineCtx) {
        floodFill(ctx, point.x, point.y, color, outlineCtx);
        audio.play('fill');
      }
    } else {
      setIsDrawing(true);
      // Save state before starting new stroke
      saveToHistory();

      lastPoint.current = point;

      // Draw a dot for immediate feedback
      // Eraser uses 'destination-out' to clear paint
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.fillStyle = tool === 'eraser' ? '#000000' : color; // Color doesn't matter for eraser
      ctx.beginPath();
      ctx.arc(point.x, point.y, tool === 'eraser' ? 20 : 10, 0, Math.PI * 2);
      ctx.fill();

      // Reset composite op
      ctx.globalCompositeOperation = 'source-over';

      // Play brush sound (throttled in a real app, but here just on start)
      audio.play('brush');
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !paintCanvasRef.current || !lastPoint.current) return;

    const ctx = paintCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    const drawColor = tool === 'eraser' ? '#000000' : color;
    const lineWidth = tool === 'eraser' ? 40 : 20;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    drawLine(ctx, lastPoint.current, currentPoint, drawColor, lineWidth);
    lastPoint.current = currentPoint;

    ctx.globalCompositeOperation = 'source-over';
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-white rounded-3xl shadow-inner overflow-hidden touch-none">
      {/* Paint Layer (Bottom) */}
      <canvas
        ref={paintCanvasRef}
        className="absolute inset-0 z-10"
      />

      {/* Outline Layer (Top) - Pointer events pass through to Paint Layer?
          Actually, we need events on the TOP element to capture them.
          So we put event listeners here, but operate on paintCanvasRef.
      */}
      <canvas
        ref={outlineCanvasRef}
        className="absolute inset-0 z-20"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
