"use client";

import { CATEGORIES, CategoryId } from "@/lib/shapes";
import { useAppStore } from "@/lib/store";
import { audio } from "@/lib/audio";
import { Cat, Car, Apple, Fish, Rocket } from "lucide-react";

// Custom Dino Icon (since Lucide doesn't have a built-in one)
const DinoIcon = ({ size, className, strokeWidth }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 3a2 2 0 1 0 2 2h4a1 1 0 0 1 0 2H6.5a1.5 1.5 0 0 0 0 3h11a2.5 2.5 0 0 1 0 5H16v4h-2v-4h-4v4H8v-4H6.5a4.5 4.5 0 0 1-4.5-4.5c0-1.88 1.1-3.48 2.68-4.14A3.003 3.003 0 0 1 8 5c0-.66.08-1.3.23-1.91A2 2 0 0 1 10 3Z" />
    <path d="M12 7h.01" />
  </svg>
);

const ICON_MAP: Record<string, any> = {
  paw: Cat,
  car: Car,
  apple: Apple,
  waves: Fish,
  dino: DinoIcon,
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
