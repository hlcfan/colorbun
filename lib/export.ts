/**
 * Merges the paint canvas and outline canvas into a single image
 * and triggers a download.
 *
 * @param paintCanvas - The canvas element containing the user's coloring
 * @param outlineCanvas - The canvas element containing the black outlines
 * @param fileName - The name of the file to download (default: 'my-art.png')
 */
export async function exportCanvasAsImage(
  paintCanvas: HTMLCanvasElement,
  outlineCanvas: HTMLCanvasElement,
  fileName: string = 'color-bun-art.png'
) {
  // 1. Create a temporary canvas to merge both layers
  const mergedCanvas = document.createElement('canvas');
  const width = paintCanvas.width;
  const height = paintCanvas.height;

  mergedCanvas.width = width;
  mergedCanvas.height = height;

  const ctx = mergedCanvas.getContext('2d');
  if (!ctx) return;

  // 2. Fill with white background first (in case of transparent areas)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 3. Draw the paint layer (color)
  ctx.drawImage(paintCanvas, 0, 0);

  // 4. Draw the outline layer (black lines) on top
  // Use multiply blending to make the white background transparent
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(outlineCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; // Reset to default

  // 5. Convert to Blob and trigger download
  // We use Blob instead of DataURL for better performance with large images
  mergedCanvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
