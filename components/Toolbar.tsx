"use client";

import { useState, useRef, useEffect } from 'react';
import { Paintbrush, PaintBucket, Eraser, Undo2, Redo2, Download } from "lucide-react";
import { audio } from "@/lib/audio";
import { BRUSHES, BrushType } from '@/lib/brushes';

export type ToolType = 'brush' | 'fill' | 'eraser';

interface ToolsProps {
  currentTool: ToolType;
  currentBrush: BrushType;
  onSelectTool: (tool: ToolType) => void;
  onSelectBrush: (brush: BrushType) => void;
}

interface ActionsProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
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

  const handleBrushClick = () => {
    if (currentTool === 'brush') {
      // If already selected, toggle popover
      setIsBrushOpen(!isBrushOpen);
    } else {
      // If switching to brush, select it and open popover if desired? 
      // User said "click on the brush icon shows a tooltip"
      onSelectTool('brush');
      setIsBrushOpen(true);
    }
    audio.play('tap');
  };

  const handleBrushSelect = (brushId: BrushType) => {
    audio.play('tap');
    onSelectBrush(brushId);
    onSelectTool('brush');
    setIsBrushOpen(false);
  };

  const handleToolSelect = (tool: ToolType) => {
    audio.play('tap');
    onSelectTool(tool);
    setIsBrushOpen(false); // Close brush popover if other tool selected
  };

  const activeBrushDef = BRUSHES[currentBrush];

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-soft justify-center items-center w-full">
      
      {/* Brush Tool with Popover */}
      <div className="relative" ref={brushContainerRef}>
        <ToolButton
          isActive={currentTool === 'brush'}
          onClick={handleBrushClick}
          icon={activeBrushDef.icon} // Show currently selected brush icon
          label={activeBrushDef.label}
          color="text-blue-500" // Keep consistent blue for brush tool active state
        />
        
        {isBrushOpen && (
          <div className="absolute right-full top-0 mr-4 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl flex flex-col gap-3 w-48 z-50 animate-in fade-in zoom-in-95 duration-200 items-start pointer-events-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-2">Brushes</h3>
            {Object.values(BRUSHES).map((brush) => (
              <button
                key={brush.id}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent focus loss
                  e.stopPropagation(); // Stop propagation to document
                  handleBrushSelect(brush.id);
                }}
                className={`
                  flex items-center gap-3 w-full p-2 rounded-xl transition-all
                  ${currentBrush === brush.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${currentBrush === brush.id ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <brush.icon size={20} />
                </div>
                <span className="font-medium text-sm">{brush.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <ToolButton
        isActive={currentTool === 'fill'}
        onClick={() => handleToolSelect('fill')}
        icon={FILL_TOOL.icon}
        label={FILL_TOOL.label}
        color={FILL_TOOL.color}
      />
      
      <ToolButton
        isActive={currentTool === 'eraser'}
        onClick={() => handleToolSelect('eraser')}
        icon={ERASER_TOOL.icon}
        label={ERASER_TOOL.label}
        color={ERASER_TOOL.color}
      />
    </div>
  );
}

export function Actions({ onUndo, onRedo, onExport, canUndo = false, canRedo = false }: ActionsProps) {
  const handleActionClick = (action: () => void) => {
    audio.play('tap');
    action();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-soft justify-center items-center w-full">
      <div className="flex gap-2 w-full justify-center">
        <ActionButton
          onClick={() => handleActionClick(onUndo)}
          icon={Undo2}
          label="Undo"
          color="text-gray-600"
          disabled={!canUndo}
        />
        <ActionButton
          onClick={() => handleActionClick(onRedo)}
          icon={Redo2}
          label="Redo"
          color="text-gray-600"
          disabled={!canRedo}
        />
      </div>
      
      <ActionButton
        onClick={() => handleActionClick(onExport)}
        icon={Download}
        label="Save"
        color="text-green-600"
      />
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, label, color, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center w-12 h-12 transition-all duration-200
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110 active:scale-95'}
      `}
      title={label}
    >
      <Icon size={28} className={color} />
    </button>
  );
}

function ToolButton({ isActive, onClick, icon: Icon, label, color, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 border-4
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 border-transparent' : ''}
        ${isActive ? 'bg-blue-50 shadow-inner scale-95 ring-4 ring-blue-100 border-white' : disabled ? '' : 'bg-white shadow-soft border-white hover:scale-105'}
      `}
      title={label}
    >
      <Icon size={28} className={isActive ? color : disabled ? 'text-gray-300' : 'text-gray-400'} />
      {/* <span className="text-[10px] font-bold mt-1 text-gray-500">{label}</span> */}
    </button>
  );
}
