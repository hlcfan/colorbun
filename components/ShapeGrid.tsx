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
            className="group relative aspect-square bg-white rounded-3xl shadow-card border-4 border-transparent hover:border-blue-200 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-white p-4 flex items-center justify-center">
              <img
                src={shape.src}
                alt={shape.name}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* "Play" overlay on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Play fill="currentColor" className="text-green-400 ml-1" />
              </div>
            </div>
          </Link>
        ))}

        {/* Empty state filler if needed */}
        {shapes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-xl">Coming Soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
