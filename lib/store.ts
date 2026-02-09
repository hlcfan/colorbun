import { create } from 'zustand';
import { CategoryId, Shape } from './shapes';

interface AppState {
  currentCategory: CategoryId;
  setCategory: (category: CategoryId) => void;
  
  // Coloring state will be managed locally or in a separate slice if it gets complex
  // For navigation, we just need to know where we are.
}

export const useAppStore = create<AppState>((set) => ({
  currentCategory: 'animals',
  setCategory: (category) => set({ currentCategory: category }),
}));
