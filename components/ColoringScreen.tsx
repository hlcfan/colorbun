"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SHAPES } from '@/lib/shapes';
import Palette from '@/components/Palette';
import Toolbar, { ToolType } from '@/components/Toolbar';
import CanvasBoard from '@/components/CanvasBoard';
import { ArrowLeft } from 'lucide-react';

interface ColoringScreenProps {
  categoryId: string;
  shapeId: string;
}

export default function ColoringScreen({ categoryId, shapeId }: ColoringScreenProps) {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState('#FFB7B2');
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [canUndo, setCanUndo] = useState(false);
  const [undoTrigger, setUndoTrigger] = useState(0);
  
  const shape = SHAPES.find(s => s.id === shapeId && s.categoryId === categoryId);

  if (!shape) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Shape not found</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen w-full bg-[#fdfbf7] overflow-hidden">
      {/* Top Bar */}
      <div className="flex-none h-16 px-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-soft hover:scale-105 transition-transform"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>

        <h1 className="text-xl font-bold text-gray-500 uppercase tracking-widest">
          {shape.name}
        </h1>

        <div className="w-12" /> {/* Spacer for balance */}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Left: Toolbar */}
        <div className="flex-none w-24 flex flex-col justify-center">
          <Toolbar
            currentTool={currentTool}
            onSelectTool={setCurrentTool}
            onUndo={() => setUndoTrigger(prev => prev + 1)}
            onExport={() => {}} // TODO: Implement Export
            canUndo={canUndo}
          />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 min-w-0">
          <CanvasBoard
            tool={currentTool}
            color={selectedColor}
            outlineSrc={shape.src}
            onHistoryChange={setCanUndo}
            undoTrigger={undoTrigger}
          />
        </div>

        {/* Right: Palette */}
        <div className="flex-none w-32 flex flex-col justify-center">
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
      </div>
    </main>
  );
}
