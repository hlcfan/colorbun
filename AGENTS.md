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
brushes.ts -> brush definitions
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
Rounded everywhere (`rounded-2xl` or `rounded-3xl`).

### Design Language: "Chunky & Tactile"
- **Buttons**: 3D "pop-out" style with thick borders (3px) and hard shadows.
- **Font**: **Fredoka** (rounded, friendly).
- **Borders**: 3px solid dark borders (`#2d3748`).
- **Shadows**: Hard, non-blurred shadows (`4px 4px 0px`).
- **Background**: Pastel colors with subtle patterns (e.g., polka dots).

### Text
Avoid whenever possible.

### Colors
Soft pastel, friendly.

### Feedback
Every tap = visual (squish/bounce) or audio response.

---

## Coloring System

We use **layer separation**:

Layer 1 → SVG outlines (immutable)
Layer 2 → bitmap paint layer

### Tools
- Brush (Marker, Pencil, Highlighter)
- Fill bucket
- Eraser
- Undo / Redo
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
currentTool
currentBrush
history[]
redoStack[]


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

---

## Implementation Status (Feb 2026)

### ✅ Completed
- **Project Structure**: Next.js 16, Tailwind, TypeScript initialized.
- **Core UI**:
  - Home screen, Category Tabs, Shape Grid.
  - **Toolbar**: Merged Fill tool into Brush group.
  - **Right Panel**: Redesigned as a vertical column of large floating icons (`3xl`, `w-32 h-32`).
  - **Custom Tool Icons**: Replaced generic Lucide icons with custom 3D-style PNG assets (Marker, Pencil, Highlighter, Eraser, Fill Bucket).
    - **Visual Polish**: Icons have transparent backgrounds, sit on a `bg-gray-100` rounded container, and feature a "cute" tilt animation (-12°/+12°) when active or hovered.
  - **Actions**: Undo and Download grouped in one row, larger buttons (`w-16 h-16`).
  - **Palette**: Popover interaction for color selection, large icon.
  - **Layout**: Optimized Left Canvas / Right Panel layout.
- **Coloring Engine**:
  - **Dual-Canvas System** (Paint Layer bottom, SVG Outline top).
  - **Transparent Background**: Canvas background is transparent for brush/eraser.
  - **Flood Fill** algorithm with boundary detection.
  - **Smart Brush**: Implemented region-constrained coloring. Brushes automatically respect outline boundaries, preventing coloring outside the lines using a flood-fill generated mask.
  - **Brush System**: Multiple brush types (Marker, Pencil, Highlighter) with custom opacity/width.
  - **Undo**: History stack implementation (Redo removed for simplicity).
- **Touch Optimization**:
  - Global text selection disabled (`user-select: none`).
  - Event propagation fixes for popovers.
- **Assets**:
  - 7 Custom SVGs created across 6 categories.
  - All SVGs optimized with `fill="none"` for the coloring engine.
- **State**: Zustand store connected for navigation.
- **Navigation**:
  - Fixed 'Back' button behavior to ensure correct category selection and home redirection when accessing deep links.
- **Visual Redesign**:
  - Implemented "Chunky & Tactile" design system.
  - Added `Fredoka` font.
  - Created reusable `Button` component with 3D press effects.
  - Applied polka-dot background pattern.
- **Export**:
  - Implemented logic to merge paint and outline layers.
  - Fixed issue with white background transparency using `multiply` blend mode.
- **Audio**:
  - Implemented `AudioManager` with `Howler.js`.
  - Created sound asset directory structure.
  - **Generated Sound Assets**: Created `scripts/generate_sounds.sh` to synthesize custom sound effects (Tap, Brush, Pop, Success) using `ffmpeg`. All assets are generated and integrated.

### 🚧 Pending / In Progress
- **Mascot**: Bunny mascot component not yet built.
