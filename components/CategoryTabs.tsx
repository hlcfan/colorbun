"use client";

import { CATEGORIES, CategoryId } from "@/lib/shapes";
import { useAppStore } from "@/lib/store";
import { Cat, Car, Apple, Fish, Rocket, Skull } from "lucide-react"; // Skull as Dino placeholder

const ICON_MAP: Record<string, any> = {
  paw: Cat,
  car: Car,
  apple: Apple,
  waves: Fish,
  dino: Skull,
  rocket: Rocket,
};

export default function CategoryTabs() {
  const { currentCategory, setCategory } = useAppStore();

  return (
    <div className="flex flex-row gap-4 p-4 overflow-x-auto no-scrollbar justify-center items-center w-full bg-white/50 backdrop-blur-sm rounded-b-3xl shadow-soft">
      {CATEGORIES.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || Cat;
        const isActive = currentCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`
              flex flex-col items-center justify-center
              w-20 h-20 rounded-2xl transition-all duration-300
              ${isActive ? `${cat.color} scale-110 shadow-md` : 'bg-white hover:bg-gray-50 scale-100 border-2 border-transparent'}
            `}
            aria-label={cat.label}
          >
            <Icon size={32} className={isActive ? 'text-gray-800' : 'text-gray-400'} />
            {/* Text is hidden for toddlers but good for debugging/accessibility */}
            <span className="text-[10px] font-bold mt-1 text-gray-600 uppercase tracking-wider hidden sm:block">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
