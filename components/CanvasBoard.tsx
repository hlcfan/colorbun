"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { drawLine, floodFill, createFloodMask, Point } from '@/lib/canvas';
import { ToolType } from './Toolbar';
import { audio } from '@/lib/audio';
import { BRUSHES, BrushType } from '@/lib/brushes';
import { exportCanvasAsImage } from '@/lib/export';

export interface CanvasBoardHandle {
  exportImage: (fileName?: string) => void;
}

interface CanvasBoardProps {
  tool: ToolType;
  color: string;
  outlineSrc: string; // URL to the SVG outline
  currentBrush: BrushType;
  onHistoryChange?: (canUndo: boolean) => void;
  undoTrigger?: number; // Increment this to trigger undo
}

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(({ tool, color, outlineSrc, currentBrush, onHistoryChange, undoTrigger }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef<Point | null>(null);

  // Expose export function via ref
  useImperativeHandle(ref, () => ({
    exportImage: (fileName?: string) => {
      if (paintCanvasRef.current && outlineCanvasRef.current) {
        exportCanvasAsImage(paintCanvasRef.current, outlineCanvasRef.current, fileName);
        audio.play('success'); // Play success sound on export
      }
    }
  }));

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

      const paintCanvas = paintCanvasRef.current;
      if (!paintCanvas) return;
      const ctx = paintCanvas.getContext('2d');
      if (!ctx) return;

      const previousState = historyRef.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
      } else {
        // If history is empty (should not happen due to check above), clear canvas
        ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
      }

      onHistoryChange?.(historyRef.current.length > 0);
    }
  }, [undoTrigger]);

  // Initialize canvas size and load outline
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && paintCanvasRef.current && outlineCanvasRef.current && tempCanvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Update all canvases
        [paintCanvasRef.current, outlineCanvasRef.current, tempCanvasRef.current].forEach(canvas => {
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

      // Prepare temp canvas for brush strokes
      const tempCanvas = tempCanvasRef.current;
      if (tempCanvas) {
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

          // Generate mask if using a brush (not eraser)
          if (tool !== 'eraser') {
            const outlineCtx = outlineCanvasRef.current?.getContext('2d');
            // Create mask based on start point
            // We pass the paint context to sample the start color (usually white/transparent)
            // And outline context to detect boundaries
            maskCanvasRef.current = createFloodMask(ctx, point.x, point.y, outlineCtx || undefined);
          } else {
            maskCanvasRef.current = null;
          }
        }
      }

      // Draw a dot for immediate feedback
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else {
        // Draw dot on temp canvas
        const tempCtx = tempCanvasRef.current?.getContext('2d');
        if (tempCtx) {
          const brushConfig = BRUSHES[currentBrush];
          tempCtx.globalCompositeOperation = 'source-over';
          tempCtx.fillStyle = color;
          tempCtx.globalAlpha = brushConfig.opacity;
          tempCtx.beginPath();
          tempCtx.arc(point.x, point.y, brushConfig.lineWidth / 2, 0, Math.PI * 2);
          tempCtx.fill();
          tempCtx.globalAlpha = 1.0;

          // Apply mask immediately for the dot
          if (maskCanvasRef.current) {
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(maskCanvasRef.current, 0, 0);
            tempCtx.globalCompositeOperation = 'source-over';
          }
        }
      }

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

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      drawLine(ctx, lastPoint.current, currentPoint, '#000000', 40);
      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Draw on temp canvas
      const tempCanvas = tempCanvasRef.current;
      if (tempCanvas) {
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          const brushConfig = BRUSHES[currentBrush];

          tempCtx.globalCompositeOperation = 'source-over';
          tempCtx.globalAlpha = brushConfig.opacity;
          drawLine(tempCtx, lastPoint.current, currentPoint, color, brushConfig.lineWidth);
          tempCtx.globalAlpha = 1.0;

          // Apply mask
          if (maskCanvasRef.current) {
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(maskCanvasRef.current, 0, 0);
            tempCtx.globalCompositeOperation = 'source-over';
          }
        }
      }
    }

    lastPoint.current = currentPoint;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    lastPoint.current = null;

    // Merge temp canvas to paint canvas
    if (tool !== 'eraser' && tempCanvasRef.current && paintCanvasRef.current) {
      const ctx = paintCanvasRef.current.getContext('2d');
      const tempCtx = tempCanvasRef.current.getContext('2d');

      if (ctx && tempCtx) {
        // Draw temp canvas content onto paint canvas
        ctx.drawImage(tempCanvasRef.current, 0, 0);

        // Clear temp canvas
        tempCtx.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height);
      }
    }

    // Clear mask
    maskCanvasRef.current = null;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-3xl shadow-inner overflow-hidden touch-none">
      {/* Paint Layer (Bottom) */}
      <canvas
        ref={paintCanvasRef}
        className="absolute inset-0 z-10"
      />

      {/* Temp Layer (Middle - for current stroke) */}
      <canvas
        ref={tempCanvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Outline Layer (Top) - Pointer events pass through to Paint Layer?
          Actually, we need events on the TOP element to capture them.
          So we put event listeners here, but operate on paintCanvasRef.
      */}
      <canvas
        ref={outlineCanvasRef}
        className="absolute inset-0 z-20 mix-blend-multiply pointer-events-auto"
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
});

CanvasBoard.displayName = 'CanvasBoard';

export default CanvasBoard;
