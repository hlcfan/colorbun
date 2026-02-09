"use client";

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
  return (
    <div className="flex flex-col gap-3 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-soft h-full justify-center overflow-y-auto no-scrollbar">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className={`
            w-12 h-12 rounded-full border-4 transition-all duration-200 shadow-sm
            ${selectedColor === color ? 'border-gray-800 scale-110' : 'border-white scale-100 hover:scale-105'}
          `}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
