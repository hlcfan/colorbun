"use client";

import { CATEGORIES, CategoryId } from "@/lib/shapes";
import { useAppStore } from "@/lib/store";
import { audio } from "@/lib/audio";
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
    <div className="flex flex-row gap-4 p-4 overflow-x-auto no-scrollbar justify-center items-center w-full">
      {CATEGORIES.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || Cat;
        const isActive = currentCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => {
              audio.play('tap');
              setCategory(cat.id);
            }}
            className={`
              flex flex-col items-center justify-center
              w-20 h-20 rounded-2xl transition-all duration-150
              border-[3px] border-[var(--btn-border)]
              ${isActive
                ? `${cat.color} translate-y-[4px] shadow-none`
                : 'bg-white hover:bg-yellow-50 shadow-[0_4px_0_var(--btn-border)] active:translate-y-[4px] active:shadow-none'
              }
            `}
            aria-label={cat.label}
          >
            <Icon size={32} className={isActive ? 'text-gray-900' : 'text-gray-500'} strokeWidth={2.5} />
            {/* Text is hidden for toddlers but good for debugging/accessibility */}
            <span className={`text-[12px] font-bold mt-1 uppercase tracking-wider hidden sm:block ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
