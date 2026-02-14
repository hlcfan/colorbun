"use client";

import { getShapesByCategory } from "@/lib/shapes";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { Play } from "lucide-react";

export default function ShapeGrid() {
  const { currentCategory } = useAppStore();
  const shapes = getShapesByCategory(currentCategory);

  return (
    <div className="flex-1 p-6 overflow-y-auto w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        {shapes.map((shape) => (
          <Link
            key={shape.id}
            href={`/color/${shape.categoryId}/${shape.id}`}
            className="group relative aspect-square bg-white rounded-3xl border-[3px] border-[var(--btn-border)] shadow-[4px_4px_0_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--shadow-color)] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--shadow-color)] transition-all duration-200 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-white p-6 flex items-center justify-center">
              <img 
                src={shape.src} 
                alt={shape.name}
                className="w-full h-full object-contain opacity-90 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* "Play" overlay on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-yellow-400 p-4 rounded-full border-[3px] border-[var(--btn-border)] shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <Play fill="currentColor" className="text-white ml-1" size={32} />
              </div>
            </div>
          </Link>
        ))}

        {/* Empty state filler if needed */}
        {shapes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-2xl font-bold font-fredoka text-gray-300">Coming Soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
