"use client";

import { useState, useRef, useEffect } from 'react';
import { PaintBucket, Eraser, Undo2, Download } from "lucide-react";
import { audio } from "@/lib/audio";
import { BRUSHES, BrushType } from '@/lib/brushes';
import { Button } from './Button';

export type ToolType = 'brush' | 'fill' | 'eraser';

interface ToolsProps {
  currentTool: ToolType;
  currentBrush: BrushType;
  onSelectTool: (tool: ToolType) => void;
  onSelectBrush: (brush: BrushType) => void;
}

interface ActionsProps {
  onUndo: () => void;
  onExport: () => void;
  canUndo?: boolean;
}

const FILL_TOOL = { id: 'fill', icon: PaintBucket, label: 'Fill', color: 'text-orange-500', image: '/assets/ui/fill_bucket.png' };
const ERASER_TOOL = { id: 'eraser', icon: Eraser, label: 'Eraser', color: 'text-pink-500', image: '/assets/ui/eraser.png' };

const BRUSH_IMAGES: Record<string, string> = {
  marker: '/assets/ui/marker.png',
  pencil: '/assets/ui/pencil.png',
  highlighter: '/assets/ui/highlighter.png',
};

export function Tools({ currentTool, currentBrush, onSelectTool, onSelectBrush }: ToolsProps) {
  const [isBrushOpen, setIsBrushOpen] = useState(false);
  const brushContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brushContainerRef.current && !brushContainerRef.current.contains(event.target as Node)) {
        setIsBrushOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeBrushDef = BRUSHES[currentBrush];
  const isGroupActive = currentTool === 'brush' || currentTool === 'fill';

  // Use image for main button if active
  const activeImageSrc = currentTool === 'fill' ? FILL_TOOL.image : (BRUSH_IMAGES[currentBrush] || '');
  const activeLabel = currentTool === 'fill' ? FILL_TOOL.label : activeBrushDef.label;
  const activeColor = currentTool === 'fill' ? FILL_TOOL.color : 'text-blue-500';
  
  // Rotate the active tool icon slightly for cuteness
  const activeRotation = currentTool === 'fill' ? 'rotate-12' : '-rotate-12';

  const handleGroupClick = () => {
    if (isGroupActive) {
      setIsBrushOpen(!isBrushOpen);
    } else {
      onSelectTool('brush');
      setIsBrushOpen(true);
    }
    // audio.play('tap'); // Handled by Button
  };

  const handleBrushSelect = (brushId: BrushType) => {
    audio.play('tap');
    onSelectBrush(brushId);
    onSelectTool('brush');
    setIsBrushOpen(false);
  };

  const handleToolSelect = (tool: ToolType) => {
    // audio.play('tap'); // Handled by Button
    onSelectTool(tool);
    setIsBrushOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">

      {/* Brush/Fill Group with Popover */}
      <div className="relative" ref={brushContainerRef}>
        <Button
          variant="icon"
          size="3xl"
          active={isGroupActive}
          onClick={handleGroupClick}
          color={activeColor}
          title={activeLabel}
          className="p-2"
        >
           {/* Use the image component directly */}
           <img 
             src={activeImageSrc} 
             alt={activeLabel}
             className={`w-full h-full object-contain drop-shadow-sm transition-transform duration-300 mix-blend-multiply ${isGroupActive ? activeRotation : ''}`}
             onError={(e) => {
               // Fallback if image fails to load (e.g. not yet added)
               e.currentTarget.style.display = 'none';
               e.currentTarget.parentElement?.classList.add('fallback-icon');
             }}
           />
           {/* Fallback Icon (hidden by default unless img fails) */}
           <div className="hidden fallback-icon:block w-full h-full flex items-center justify-center text-gray-400 text-xs text-center leading-tight">
             {activeLabel}
           </div>
        </Button>

        {isBrushOpen && (
          <div className="absolute right-full top-0 mr-4 p-4 bg-white rounded-3xl border-[3px] border-[var(--btn-border)] shadow-[4px_4px_0_var(--shadow-color)] grid grid-cols-2 gap-4 w-64 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
            {Object.values(BRUSHES).map((brush) => {
              const imageSrc = BRUSH_IMAGES[brush.id];
              const isSelected = currentTool === 'brush' && currentBrush === brush.id;

              return (
                <button
                  key={brush.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBrushSelect(brush.id);
                  }}
                  className={`
                    flex items-center justify-center aspect-square rounded-2xl transition-all border-[3px] overflow-hidden p-2
                    ${isSelected
                      ? 'bg-blue-50 border-blue-400 shadow-[0_4px_0_#60A5FA] translate-y-0'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 shadow-[0_4px_0_#E5E7EB] hover:translate-y-[-2px]'}
                  `}
                  title={brush.label}
                >
                  <img
                    src={imageSrc}
                    alt={brush.label}
                    className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply -rotate-12"
                  />
                </button>
              );
            })}

            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToolSelect('fill');
              }}
              className={`
                flex items-center justify-center aspect-square rounded-2xl transition-all border-[3px] overflow-hidden p-2
                ${currentTool === 'fill'
                  ? 'bg-orange-50 border-orange-400 shadow-[0_4px_0_#FB923C] translate-y-0'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 shadow-[0_4px_0_#E5E7EB] hover:translate-y-[-2px]'}
              `}
              title={FILL_TOOL.label}
            >
              <img
                src={FILL_TOOL.image}
                alt={FILL_TOOL.label}
                className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply rotate-12"
              />
            </button>
          </div>
        )}
      </div>

      {/* Fill tool removed from here */}

      <Button
        variant="icon"
        size="3xl"
        active={currentTool === 'eraser'}
        onClick={() => handleToolSelect('eraser')}
        color={ERASER_TOOL.color}
        title={ERASER_TOOL.label}
        className="p-2"
      >
        <img 
          src={ERASER_TOOL.image} 
          alt={ERASER_TOOL.label}
          className={`w-full h-full object-contain drop-shadow-sm mix-blend-multiply transition-transform duration-300 ${currentTool === 'eraser' ? '-rotate-12' : ''}`}
        />
      </Button>
    </div>
  );
}

export function Actions({ onUndo, onExport, canUndo = false }: ActionsProps) {
  const handleActionClick = (action: () => void) => {
    // audio.play('tap'); // Handled by Button
    action();
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex gap-2 w-full justify-center">
        <Button
          variant="icon"
          size="sm"
          onClick={() => handleActionClick(onUndo)}
          disabled={!canUndo}
          color="text-gray-600"
          title="Undo"
          className="w-16 h-16 p-0"
        >
          <Undo2 size={36} strokeWidth={2.5} />
        </Button>

        <Button
          variant="icon"
          size="sm"
          onClick={() => handleActionClick(onExport)}
          color="text-green-600"
          title="Save"
          className="w-16 h-16 p-0"
        >
          <Download size={36} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}
