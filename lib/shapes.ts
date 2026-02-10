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
  { id: 'elephant', categoryId: 'animals', name: 'Elephant', src: '/assets/shapes/animals/elephant.svg' },
  { id: 'rabbit', categoryId: 'animals', name: 'Rabbit', src: '/assets/shapes/animals/rabbit.svg' },

  // Vehicles
  { id: 'car', categoryId: 'vehicles', name: 'Car', src: '/assets/shapes/vehicles/car.svg' },
  { id: 'bus', categoryId: 'vehicles', name: 'Bus', src: '/assets/shapes/vehicles/bus.svg' },
  { id: 'airplane', categoryId: 'vehicles', name: 'Airplane', src: '/assets/shapes/vehicles/airplane.svg' },

  // Fruits
  { id: 'apple', categoryId: 'fruits', name: 'Apple', src: '/assets/shapes/fruits/apple.svg' },
  { id: 'banana', categoryId: 'fruits', name: 'Banana', src: '/assets/shapes/fruits/banana.svg' },
  { id: 'strawberry', categoryId: 'fruits', name: 'Strawberry', src: '/assets/shapes/fruits/strawberry.svg' },

  // Sea
  { id: 'fish', categoryId: 'sea', name: 'Fish', src: '/assets/shapes/sea/fish.svg' },
  { id: 'octopus', categoryId: 'sea', name: 'Octopus', src: '/assets/shapes/sea/octopus.svg' },
  { id: 'crab', categoryId: 'sea', name: 'Crab', src: '/assets/shapes/sea/crab.svg' },

  // Dino
  { id: 't-rex', categoryId: 'dino', name: 'T-Rex', src: '/assets/shapes/dino/t-rex.svg' },
  { id: 'stegosaurus', categoryId: 'dino', name: 'Stegosaurus', src: '/assets/shapes/dino/stegosaurus.svg' },
  { id: 'triceratops', categoryId: 'dino', name: 'Triceratops', src: '/assets/shapes/dino/triceratops.svg' },

  // Space
  { id: 'rocket', categoryId: 'space', name: 'Rocket', src: '/assets/shapes/space/rocket.svg' },
  { id: 'planet', categoryId: 'space', name: 'Planet', src: '/assets/shapes/space/planet.svg' },
  { id: 'star', categoryId: 'space', name: 'Star', src: '/assets/shapes/space/star.svg' },
];

export function getShapesByCategory(categoryId: CategoryId) {
  return SHAPES.filter(shape => shape.categoryId === categoryId);
}
