# Prompt for Generating ColorBun SVGs

Please generate high-quality SVG assets for a toddler coloring app called "ColorBun".

## Design Requirements
- **Target Audience:** Toddlers aged 3-4.
- **Style:** Cute, simple, chunky, and friendly.
- **Lines:** Thick, consistent black strokes.
- **Shapes:** Closed paths (CRITICAL for flood fill to work).
- **Complexity:** Very low detail. Abstract and geometric.
- **Corners:** Rounded `stroke-linejoin="round"` and `stroke-linecap="round"`.

## Technical Specifications
- **Format:** SVG
- **ViewBox:** `0 0 500 500`
- **Stroke Color:** `black` (#000000)
- **Stroke Width:** `15` (absolute minimum 10, prefer 15 for main outlines).
- **Fill:** `none` (CRITICAL: The interior must be transparent).
- **Details:** Small details like eyes can be filled with `black`.
- **Optimization:** Minimized code, readable paths.

## List of Shapes to Generate

### Animals
1. **Cat:** Simple face or sitting body. Pointy ears, whiskers.
2. **Dog:** Floppy ears, happy face.
3. **Elephant:** Big ears, trunk.
4. **Rabbit:** Long ears.

### Vehicles
5. **Car:** Simple sedan or beetle shape. Wheels as circles.
6. **Bus:** Boxy shape, windows.
7. **Airplane:** Simple wings and fuselage.

### Fruits
8. **Apple:** Round with a stem and leaf.
9. **Banana:** A bunch or single curved shape.
10. **Strawberry:** Triangular shape with seeds (dots).

### Sea Creatures
11. **Fish:** Simple oval body, tail, fin.
12. **Octopus:** Round head, wavy legs.
13. **Crab:** Oval body, claws.

### Dinosaurs
14. **T-Rex:** Big head, small arms, tail.
15. **Stegosaurus:** Spiky back plates.
16. **Triceratops:** Three horns, frill.

### Space
17. **Rocket:** Pointy top, fins, window.
18. **Planet:** Ringed planet (Saturn style).
19. **Star:** 5-point rounded star.

## Example Output Format

```svg
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Description: Simple Cat -->
  <path 
    d="..." 
    fill="none" 
    stroke="black" 
    stroke-width="15" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  />
  <!-- Optional: Eyes -->
  <circle cx="200" cy="200" r="15" fill="black" />
</svg>
```

Please generate the code for all 19 shapes, grouped by category.
