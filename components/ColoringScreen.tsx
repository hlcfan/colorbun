"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { SHAPES } from '@/lib/shapes';
import Palette from '@/components/Palette';
import { Tools, Actions, ToolType } from '@/components/Toolbar';
import CanvasBoard, { CanvasBoardHandle } from '@/components/CanvasBoard';
import { ArrowLeft } from 'lucide-react';
import { BrushType } from '@/lib/brushes';
import { Button } from './Button';

interface ColoringScreenProps {
  categoryId: string;
  shapeId: string;
}

export default function ColoringScreen({ categoryId, shapeId }: ColoringScreenProps) {
  const router = useRouter();
  const setCategory = useAppStore((state) => state.setCategory);
  const canvasRef = useRef<CanvasBoardHandle>(null);

  const [selectedColor, setSelectedColor] = useState('#FFB7B2');
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [currentBrush, setCurrentBrush] = useState<BrushType>('marker');
  const [canUndo, setCanUndo] = useState(false);
  const [undoTrigger, setUndoTrigger] = useState(0);

  const shape = SHAPES.find(s => s.id === shapeId && s.categoryId === categoryId);

  if (!shape) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-3xl font-black font-fredoka text-gray-400">Shape not found</h1>
        <Button onClick={() => router.push('/')}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-full w-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex-none h-20 px-6 flex items-center justify-between">
        <Button
          variant="icon"
          size="icon"
          onClick={() => {
            setCategory(shape.categoryId);
            router.push('/');
          }}
          title="Go Back"
        >
          <ArrowLeft size={32} strokeWidth={3} className="text-gray-600" />
        </Button>

        <h1 className="text-2xl font-black text-gray-600 uppercase tracking-widest font-fredoka drop-shadow-sm">
          {shape.name}
        </h1>

        <div className="w-14" /> {/* Spacer for balance */}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 p-6 min-h-0 pt-0">
        {/* Left: Canvas */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl border-[3px] border-[var(--btn-border)] shadow-[6px_6px_0_var(--shadow-color)] overflow-hidden relative">
          <CanvasBoard
            ref={canvasRef}
            tool={currentTool}
            color={selectedColor}
            outlineSrc={shape.src}
            currentBrush={currentBrush}
            onHistoryChange={(undo) => {
              setCanUndo(undo);
            }}
            undoTrigger={undoTrigger}
          />
        </div>

        {/* Right: Panel (Palette, Tools, Actions) */}
        <div className="flex-none w-40 flex flex-col gap-6 items-center justify-center relative z-50">
          <div className="flex-none">
            <Palette
              selectedColor={selectedColor}
              onSelectColor={(c) => {
                setSelectedColor(c);
                if (currentTool === 'eraser') {
                  setCurrentTool('brush');
                }
              }}
            />
          </div>

          <Tools
            currentTool={currentTool}
            currentBrush={currentBrush}
            onSelectTool={setCurrentTool}
            onSelectBrush={setCurrentBrush}
          />

          <Actions
             onUndo={() => setUndoTrigger(prev => prev + 1)}
             onExport={() => {
               if (canvasRef.current) {
                 canvasRef.current.exportImage(`${shape.name.toLowerCase().replace(/\s+/g, '-')}-art.png`);
               }
             }}
             canUndo={canUndo}
          />
        </div>
      </div>
    </main>
  );
}
