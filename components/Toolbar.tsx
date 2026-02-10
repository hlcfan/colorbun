"use client";

import { Paintbrush, PaintBucket, Eraser, Undo2, Download } from "lucide-react";
import { audio } from "@/lib/audio";

export type ToolType = 'brush' | 'fill' | 'eraser';

interface ToolbarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onUndo: () => void;
  onExport: () => void;
  canUndo?: boolean;
}

export default function Toolbar({ currentTool, onSelectTool, onUndo, onExport, canUndo = false }: ToolbarProps) {
  const handleToolClick = (tool: ToolType) => {
    audio.play('tap');
    onSelectTool(tool);
  };

  const handleActionClick = (action: () => void) => {
    audio.play('tap');
    action();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-soft h-full justify-center">
      <ToolButton
        isActive={currentTool === 'brush'}
        onClick={() => handleToolClick('brush')}
        icon={Paintbrush}
        label="Brush"
        color="text-blue-500"
      />
      <ToolButton
        isActive={currentTool === 'fill'}
        onClick={() => handleToolClick('fill')}
        icon={PaintBucket}
        label="Fill"
        color="text-orange-500"
      />
      <ToolButton
        isActive={currentTool === 'eraser'}
        onClick={() => handleToolClick('eraser')}
        icon={Eraser}
        label="Eraser"
        color="text-pink-500"
      />
      
      <div className="h-px bg-gray-200 my-2" />
      
      <ToolButton
        isActive={false}
        onClick={() => handleActionClick(onUndo)}
        icon={Undo2}
        label="Undo"
        color="text-gray-600"
        disabled={!canUndo}
      />
      
      <ToolButton
        isActive={false}
        onClick={() => handleActionClick(onExport)}
        icon={Download}
        label="Save"
        color="text-green-600"
      />
    </div>
  );
}

function ToolButton({ isActive, onClick, icon: Icon, label, color, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
        ${isActive ? 'bg-blue-50 shadow-inner scale-95 ring-2 ring-blue-200' : disabled ? '' : 'bg-white shadow-sm hover:bg-gray-50 scale-100'}
      `}
      title={label}
    >
      <Icon size={28} className={isActive ? color : disabled ? 'text-gray-300' : 'text-gray-400'} />
      {/* <span className="text-[10px] font-bold mt-1 text-gray-500">{label}</span> */}
    </button>
  );
}
