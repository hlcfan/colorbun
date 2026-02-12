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
  { id: 'cat', categoryId: 'animals', name: 'Cat', src: '/assets/shapes/animals/cat.png' },
  { id: 'dog', categoryId: 'animals', name: 'Dog', src: '/assets/shapes/animals/dog.png' },
  { id: 'elephant', categoryId: 'animals', name: 'Elephant', src: '/assets/shapes/animals/elephant.png' },
  { id: 'rabbit', categoryId: 'animals', name: 'Rabbit', src: '/assets/shapes/animals/bunny.png' },

  // Vehicles
  { id: 'car', categoryId: 'vehicles', name: 'Car', src: '/assets/shapes/vehicles/car.png' },
  { id: 'bus', categoryId: 'vehicles', name: 'Bus', src: '/assets/shapes/vehicles/bus.png' },
  { id: 'airplane', categoryId: 'vehicles', name: 'Airplane', src: '/assets/shapes/vehicles/airplane.png' },

  // Fruits
  { id: 'apple', categoryId: 'fruits', name: 'Apple', src: '/assets/shapes/fruits/apple.png' },
  { id: 'banana', categoryId: 'fruits', name: 'Banana', src: '/assets/shapes/fruits/banana.png' },
  { id: 'strawberry', categoryId: 'fruits', name: 'Strawberry', src: '/assets/shapes/fruits/strawberry.png' },

  // Sea
  { id: 'fish', categoryId: 'sea', name: 'Fish', src: '/assets/shapes/sea/fish.png' },
  { id: 'octopus', categoryId: 'sea', name: 'Octopus', src: '/assets/shapes/sea/octopus.png' },
  { id: 'crab', categoryId: 'sea', name: 'Crab', src: '/assets/shapes/sea/crab.png' },

  // Dino
  { id: 't-rex', categoryId: 'dino', name: 'T-Rex', src: '/assets/shapes/dino/t-rex.png' },
  { id: 'stegosaurus', categoryId: 'dino', name: 'Stegosaurus', src: '/assets/shapes/dino/stegosaurus.png' },
  { id: 'triceratops', categoryId: 'dino', name: 'Triceratops', src: '/assets/shapes/dino/triceratops.png' },

  // Space
  { id: 'rocket', categoryId: 'space', name: 'Rocket', src: '/assets/shapes/space/rocket.png' },
  { id: 'planet', categoryId: 'space', name: 'Planet', src: '/assets/shapes/space/planet.png' },
  { id: 'star', categoryId: 'space', name: 'Star', src: '/assets/shapes/space/star.png' },
];

export function getShapesByCategory(categoryId: CategoryId) {
  return SHAPES.filter(shape => shape.categoryId === categoryId);
}
