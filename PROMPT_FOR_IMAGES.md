# Prompt for Generating ColorBun Coloring Pages

Use this prompt with an AI Image Generator (like DALL-E 3, Midjourney v6, or similar) to create the assets.

## Master Prompt
> **A simple black and white coloring page for toddlers of a [SUBJECT]. Thick bold black outlines, pure white background. Minimal detail, cute and friendly style. No shading, no grayscale, no hatching. High contrast. Vector illustration style.**

## Subjects to Generate

### Animals
- Cute Cat sitting
- Happy Dog face
- Baby Elephant
- Cute Rabbit

### Vehicles
- Simple Cartoon Car
- School Bus
- Airplane

### Fruits
- Apple with leaf
- Banana bunch
- Strawberry

### Sea Creatures
- Cute Fish
- Round Octopus
- Happy Crab

### Dinosaurs
- T-Rex standing
- Stegosaurus
- Triceratops

### Space
- Rocket ship
- Planet with rings
- Simple Star shape

## Post-Processing Instructions (Optional)
If the images have a white background, they will work automatically in ColorBun (we have updated the engine to handle white backgrounds!).

1. Save the image as a `.png` or `.jpg`.
2. Rename it to match the shape ID (e.g., `cat.png`, `car.jpg`).
3. Place it in the corresponding folder in `public/assets/shapes/`.
4. Update `lib/shapes.ts` to point to the new filename (change `.svg` to `.png` or `.jpg`).
