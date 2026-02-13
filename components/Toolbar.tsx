"use client";

import { useState, useRef, useEffect } from 'react';
import { Paintbrush, PaintBucket, Eraser, Undo2, Redo2, Download } from "lucide-react";
import { audio } from "@/lib/audio";

export type ToolType = 'brush' | 'fill' | 'eraser';

interface ToolsProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

interface ActionsProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const TOOLS = [
  { id: 'brush', icon: Paintbrush, label: 'Brush', color: 'text-blue-500' },
  { id: 'fill', icon: PaintBucket, label: 'Fill', color: 'text-orange-500' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', color: 'text-pink-500' },
] as const;

export function Tools({ currentTool, onSelectTool }: ToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    audio.play('tap');
    setIsOpen(!isOpen);
  };

  const handleToolSelect = (tool: ToolType) => {
    audio.play('tap');
    onSelectTool(tool);
    setIsOpen(false);
  };

  // Find the active tool definition to display its icon
  const activeToolDef = TOOLS.find(t => t.id === currentTool) || TOOLS[0];
  const ActiveIcon = activeToolDef.icon;

  return (
    <div className="relative w-full flex justify-center" ref={containerRef}>
      <button
        onClick={handleToggle}
        className={`
          w-16 h-16 rounded-xl shadow-soft flex items-center justify-center transition-all duration-200 active:scale-95 border-4
          ${isOpen ? 'ring-4 ring-blue-100 scale-105 border-white bg-blue-50' : 'border-white hover:scale-105 bg-white'}
        `}
        aria-label="Open tools menu"
      >
        <ActiveIcon 
          className={`drop-shadow-md ${activeToolDef.color}`} 
          size={32} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-full top-0 mr-4 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl flex flex-col gap-3 w-24 z-50 animate-in fade-in zoom-in-95 duration-200 items-center">
          {TOOLS.map((tool) => (
            <ToolButton
              key={tool.id}
              isActive={currentTool === tool.id}
              onClick={() => handleToolSelect(tool.id as ToolType)}
              icon={tool.icon}
              label={tool.label}
              color={tool.color}
            />
          ))}
        </div>
      )}
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
