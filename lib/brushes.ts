import { Paintbrush, Pencil, Highlighter } from 'lucide-react';

export type BrushType = 'marker' | 'pencil' | 'highlighter';

export interface BrushConfig {
  id: BrushType;
  label: string;
  icon: any; // Lucide icon
  lineWidth: number;
  opacity: number;
}

export const BRUSHES: Record<BrushType, BrushConfig> = {
  marker: {
    id: 'marker',
    label: 'Marker',
    icon: Paintbrush,
    lineWidth: 20,
    opacity: 1.0,
  },
  pencil: {
    id: 'pencil',
    label: 'Pencil',
    icon: Pencil,
    lineWidth: 8,
    opacity: 0.9,
  },
  highlighter: {
    id: 'highlighter',
    label: 'Highlighter',
    icon: Highlighter,
    lineWidth: 30,
    opacity: 0.4,
  },
};
