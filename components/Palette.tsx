"use client";

import { useState, useRef, useEffect } from 'react';
import { Palette as PaletteIcon } from 'lucide-react';
import { audio } from '@/lib/audio';

interface PaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const COLORS = [
  '#FFB7B2', // Pastel Red
  '#FFDAC1', // Pastel Orange
  '#E2F0CB', // Pastel Green
  '#B5EAD7', // Pastel Teal
  '#C7CEEA', // Pastel Purple
  '#F4A261', // Warm Orange
  '#2A9D8F', // Teal
  '#E9C46A', // Yellow
  '#E76F51', // Burnt Sienna
  '#ffffff', // White
  '#000000', // Black
];

export default function Palette({ selectedColor, onSelectColor }: PaletteProps) {
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

  const handleSelect = (color: string) => {
    audio.play('tap');
    onSelectColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full flex justify-center" ref={containerRef}>
      <button
        onClick={handleToggle}
        className={`
          w-16 h-16 rounded-xl shadow-soft flex items-center justify-center transition-all duration-200 active:scale-95 border-4
          ${isOpen ? 'ring-4 ring-blue-100 scale-105 border-white' : 'border-white hover:scale-105'}
        `}
        style={{ backgroundColor: selectedColor }}
        aria-label="Open color palette"
      >
        <PaletteIcon 
          className={`drop-shadow-md ${selectedColor === '#ffffff' ? 'text-gray-400' : 'text-white'}`} 
          size={32} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-full top-0 mr-4 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl grid grid-cols-3 gap-3 w-64 z-50 animate-in fade-in zoom-in-95 duration-200">
           {COLORS.map((color) => (
             <button
               key={color}
               onClick={() => handleSelect(color)}
               className={`
                 w-12 h-12 rounded-full border-2 transition-all duration-200 shadow-sm
                 ${selectedColor === color ? 'border-gray-800 scale-110 ring-2 ring-gray-200' : 'border-white hover:scale-110 hover:shadow-md'}
               `}
               style={{ backgroundColor: color }}
               aria-label={`Select color ${color}`}
             />
           ))}
           {/* Add a generic "close" hint or area if needed, but click outside works */}
        </div>
      )}
    </div>
  );
}
