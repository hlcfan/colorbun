# ColorBun – AGENTS.md

## Product Summary
ColorBun is a touch-first, browser-based coloring game designed for children aged **3–4**.

Users:
1. Choose a category (Animals, Vehicles, Fruits, Sea Creatures, Dinosaurs, Space)
2. Pick a shape
3. Color using brush or tap-to-fill
4. Export the artwork to their device photos.

No accounts. No ads. Zero friction.

Primary device: **iPad Safari**.

---

## Core Principles

### 1. Toddler First
Users cannot read.
UI must rely on:
- icons
- color
- motion
- sound

Buttons must be large, obvious, forgiving.

### 2. Touch > Mouse
Everything optimized for fingers, not precision pointers.

### 3. Instant Delight
Every interaction should feel responsive and rewarding.

### 4. Additive Design
Adding new categories or shapes must require **no code changes**.

### 5. Real Product
Production quality. Clean architecture. Extensible.

---

## Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind
- **State:** Zustand
- **Sound:** Howler.js
- **Canvas:** HTML5 Canvas
- **Assets:** SVG
- **Hosting:** Vercel (static deploy)

No backend for v1.

---

## App Structure

/app
/page.tsx -> home
/color/[category]/[id] -> coloring screen

/components
CategoryTabs.tsx
ShapeGrid.tsx
CanvasBoard.tsx
Palette.tsx
Toolbar.tsx
BunnyMascot.tsx

/lib
shapes.ts -> registry
canvas.ts -> paint engine
export.ts -> image download
audio.ts -> sound manager

/assets
/shapes
/animals
/vehicles
/fruits
/sea
/dino
/space
/sounds
/ui

---

## Navigation Flow

Home
→ choose category
→ choose shape
→ color
→ export or go back

Keep transitions fast.

---

## UI Rules

### Hit Targets
Minimum 44px, prefer 60–80px.

### Corners
Rounded everywhere.

### Text
Avoid whenever possible.

### Colors
Soft pastel, friendly.

### Feedback
Every tap = visual or audio response.

---

## Coloring System

We use **layer separation**:

Layer 1 → SVG outlines (immutable)
Layer 2 → bitmap paint layer

### Tools
- Brush
- Fill bucket
- Eraser
- Undo
- Clear

---

## SVG Requirements

Shapes must:
- be closed paths
- have clear region boundaries
- thick black outline
- white interior

Goal: reliable fill detection.

---

## State Model (High Level)

currentCategory
currentShape
selectedColor
tool
history[]


Keep it simple and predictable.

---

## Performance Requirements

Must feel native on iPad.

- Avoid re-renders
- Use refs for canvas
- Batch updates
- Keep memory small

---

## Sounds

We use sound to reward engagement.

Examples:
- tap
- fill pop
- brush
- erase
- success

Never loud or annoying.
Soft, happy.

---

## Export

Canvas → PNG → trigger download.

Parent can save to Photos.

---

## Adding New Shapes

Drop SVG into:

/assets/shapes/<category>/


Update registry if needed.

No logic change.

---

## What We Will NOT Build in v1

- accounts
- cloud save
- sharing
- payments
- multiplayer
- complex brushes

Focus = perfect core loop.

---

## Code Style

- readable
- small components
- explicit naming
- avoid magic
- comments for non-obvious logic

This is a long-term codebase.

---

## Definition of Done

A feature is done when:

✅ works on real iPad
✅ toddler can use without help
✅ feels fast
✅ no visual glitch
✅ has feedback
✅ easy to maintain

---

## Product Feel

ColorBun should feel like:

> a gentle bunny sitting next to a child saying
> “good job, let’s color more”

Warm. Encouraging. Safe.

---

## Future Expansion (not now)

- premium packs
- animations
- AI-generated pages
- printables
- progress tracking

---

## Mission

Create a magical first creative experience for a child.

If unsure about a decision → choose what makes it **simpler, softer, happier**.
