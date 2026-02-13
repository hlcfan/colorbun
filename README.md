# 🐰 ColorBun

ColorBun is a touch-first, browser-based coloring game designed for toddlers (aged 3–4). It features a "zero friction" interface with no text, no ads, and no accounts—just pure creative fun.

👉 **Play Now:** [https://colorbun-amber.vercel.app/](https://colorbun-amber.vercel.app/)

## ✨ Features

- **Toddler-First UI:** Large buttons, icon-based navigation, and forgiving interactions.
- **Dual-Mode Coloring:**
  - 🖌️ **Brush:** For freehand drawing.
  - 🪣 **Fill:** Smart flood-fill algorithm that stays within lines.
- **Works Offline:** Built as a static PWA.
- **Export Art:** Save masterpieces directly to the device.
- **Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, HTML5 Canvas.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open:** [http://localhost:3000](http://localhost:3000)

## 🎨 Adding New Coloring Pages

ColorBun supports standard PNG/JPG images. You can use AI tools or draw them yourself.

### 1. Image Requirements
- **Format:** PNG or JPG
- **Background:** White (the engine automatically makes it transparent)
- **Lines:** Thick black outlines (for best flood-fill detection)
- **Style:** Simple, closed shapes

### 2. Steps to Add
1.  **Save Image:** Place your image file in `public/assets/shapes/[category]/`.
    *   *Example:* `public/assets/shapes/animals/lion.png`
2.  **Register:** Add the shape to `lib/shapes.ts`:
    ```typescript
    {
      id: 'lion',
      categoryId: 'animals',
      name: 'Lion',
      src: '/assets/shapes/animals/lion.png'
    }
    ```
3.  **Done!** It will appear in the app automatically.

## 🏗️ Project Structure

- `app/` - Next.js app router pages.
- `components/` - UI components (CanvasBoard, Toolbar, Palette).
- `lib/` - Core logic (Flood fill engine, state management).
- `public/assets/shapes/` - Coloring page assets.

## 📄 License

MIT
