"use client";

import { useState, useRef, useEffect } from 'react';
import { Paintbrush, PaintBucket, Eraser, Undo2, Download } from "lucide-react";
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

const FILL_TOOL = { id: 'fill', icon: PaintBucket, label: 'Fill', color: 'text-orange-500' };
const ERASER_TOOL = { id: 'eraser', icon: Eraser, label: 'Eraser', color: 'text-pink-500' };

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
  const activeIcon = currentTool === 'fill' ? FILL_TOOL.icon : activeBrushDef.icon;
  const activeLabel = currentTool === 'fill' ? FILL_TOOL.label : activeBrushDef.label;
  const activeColor = currentTool === 'fill' ? FILL_TOOL.color : 'text-blue-500';

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
        >
          {currentTool === 'fill' ? (
            <FILL_TOOL.icon size={64} strokeWidth={2.5} />
          ) : (
            <activeBrushDef.icon size={64} strokeWidth={2.5} />
          )}
        </Button>

        {isBrushOpen && (
          <div className="absolute right-full top-0 mr-4 p-4 bg-white rounded-2xl border-[3px] border-[var(--btn-border)] shadow-[4px_4px_0_var(--shadow-color)] flex flex-col gap-3 w-48 z-50 animate-in fade-in zoom-in-95 duration-200 items-start pointer-events-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-2 font-fredoka">Brushes</h3>
            {Object.values(BRUSHES).map((brush) => (
              <button
                key={brush.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBrushSelect(brush.id);
                }}
                className={`
                  flex items-center gap-3 w-full p-2 rounded-xl transition-all font-bold
                  ${currentTool === 'brush' && currentBrush === brush.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center border-2
                  ${currentTool === 'brush' && currentBrush === brush.id ? 'bg-blue-100 border-blue-200' : 'bg-gray-100 border-gray-200'}
                `}>
                  <brush.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="font-medium text-sm">{brush.label}</span>
              </button>
            ))}

            <div className="w-full h-px bg-gray-100 my-1"></div>

            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToolSelect('fill');
              }}
              className={`
                flex items-center gap-3 w-full p-2 rounded-xl transition-all font-bold
                ${currentTool === 'fill' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-600'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center border-2
                ${currentTool === 'fill' ? 'bg-orange-100 border-orange-200' : 'bg-gray-100 border-gray-200'}
              `}>
                <FILL_TOOL.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="font-medium text-sm">{FILL_TOOL.label}</span>
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
      >
        <ERASER_TOOL.icon size={64} strokeWidth={2.5} />
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
