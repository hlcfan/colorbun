export interface Point {
  x: number;
  y: number;
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  color: string,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.closePath();
}

// Simple flood fill implementation
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: string,
  outlineCtx?: CanvasRenderingContext2D
) {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Get outline data if provided
  let outlineData: Uint8ClampedArray | null = null;
  if (outlineCtx) {
    outlineData = outlineCtx.getImageData(0, 0, width, height).data;
  }

  // Parse fill color
  const tempCtx = document.createElement('canvas').getContext('2d');
  if (!tempCtx) return;
  tempCtx.fillStyle = fillColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const fillData = tempCtx.getImageData(0, 0, 1, 1).data;
  const [r, g, b, a] = fillData;

  const stack = [[Math.floor(startX), Math.floor(startY)]];
  const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;

  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  // If trying to fill with same color, return
  if (startR === r && startG === g && startB === b && startA === a) return;

  function matchStartColor(pos: number) {
    // Check outline boundary first
    if (outlineData) {
      const oR = outlineData[pos];
      const oG = outlineData[pos + 1];
      const oB = outlineData[pos + 2];
      const oA = outlineData[pos + 3];

      // If it's a significant pixel (not transparent)
      if (oA > 50) {
        // If it's NOT white (or close to white), it's a boundary
        // We assume the background is white (255,255,255) and lines are dark
        // So if any channel is < 200, it's likely a line
        if (oR < 200 || oG < 200 || oB < 200) {
          return false;
        }
      }
    }

    return (
      data[pos] === startR &&
      data[pos + 1] === startG &&
      data[pos + 2] === startB &&
      data[pos + 3] === startA
    );
  }

  function colorPixel(pos: number) {
    data[pos] = r;
    data[pos + 1] = g;
    data[pos + 2] = b;
    data[pos + 3] = a;
  }

  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    let pixelPos = (cy * width + cx) * 4;

    let y1 = cy;
    while (y1 >= 0 && matchStartColor(pixelPos)) {
      y1--;
      pixelPos -= width * 4;
    }

    pixelPos += width * 4;
    y1++;

    let reachLeft = false;
    let reachRight = false;

    while (y1 < height && matchStartColor(pixelPos)) {
      colorPixel(pixelPos);

      if (cx > 0) {
        if (matchStartColor(pixelPos - 4)) {
          if (!reachLeft) {
            stack.push([cx - 1, y1]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (cx < width - 1) {
        if (matchStartColor(pixelPos + 4)) {
          if (!reachRight) {
            stack.push([cx + 1, y1]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      y1++;
      pixelPos += width * 4;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
