export type CategoryId = 'animals' | 'vehicles' | 'fruits' | 'sea' | 'dino' | 'space';

export interface Shape {
  id: string;
  categoryId: CategoryId;
  name: string; // Display name (though text is minimized, useful for alt tags)
  src: string; // Path to SVG
}

export interface Category {
  id: CategoryId;
  label: string;
  color: string; // Theme color for the category
  icon: string; // Icon name or path
}

export const CATEGORIES: Category[] = [
  { id: 'animals', label: 'Animals', color: 'bg-orange-200', icon: 'paw' },
  { id: 'vehicles', label: 'Vehicles', color: 'bg-blue-200', icon: 'car' },
  { id: 'fruits', label: 'Fruits', color: 'bg-red-200', icon: 'apple' },
  { id: 'sea', label: 'Sea', color: 'bg-cyan-200', icon: 'waves' },
  { id: 'dino', label: 'Dinos', color: 'bg-green-200', icon: 'dino' },
  { id: 'space', label: 'Space', color: 'bg-purple-200', icon: 'rocket' },
];

// This registry will be populated with actual SVGs later.
// For now, we'll use placeholders or rely on dynamic loading if possible,
// but hardcoding the registry is safer for static export.
export const SHAPES: Shape[] = [
  // Animals
  { id: 'cat', categoryId: 'animals', name: 'Cat', src: '/assets/shapes/animals/cat.svg' },
  { id: 'dog', categoryId: 'animals', name: 'Dog', src: '/assets/shapes/animals/dog.svg' },
  
  // Vehicles
  { id: 'car', categoryId: 'vehicles', name: 'Car', src: '/assets/shapes/vehicles/car.svg' },
  
  // Fruits
  { id: 'apple', categoryId: 'fruits', name: 'Apple', src: '/assets/shapes/fruits/apple.svg' },
  
  // Sea
  { id: 'fish', categoryId: 'sea', name: 'Fish', src: '/assets/shapes/sea/fish.svg' },
  
  // Dino
  { id: 't-rex', categoryId: 'dino', name: 'T-Rex', src: '/assets/shapes/dino/t-rex.svg' },
  
  // Space
  { id: 'rocket', categoryId: 'space', name: 'Rocket', src: '/assets/shapes/space/rocket.svg' },
];

export function getShapesByCategory(categoryId: CategoryId) {
  return SHAPES.filter(shape => shape.categoryId === categoryId);
}
