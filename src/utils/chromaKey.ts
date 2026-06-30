import type { ChromaKeySettings } from '../types';

function sampleBackgroundColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): [number, number, number] {
  const sampleSize = 10;
  let r = 0, g = 0, b = 0, count = 0;

  for (let y = 0; y < sampleSize && y < height; y++) {
    for (let x = 0; x < sampleSize && x < width; x++) {
      const i = (y * width + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  for (let y = height - sampleSize; y < height; y++) {
    for (let x = width - sampleSize; x < width; x++) {
      const i = (y * width + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }

  return [r / count, g / count, b / count];
}

export function processChromaKey(
  imageData: ImageData,
  settings: ChromaKeySettings
): ImageData {
  const { data, width, height } = imageData;
  const { mode, tolerance, smoothness, feather, targetColor } = settings;

  let targetR: number, targetG: number, targetB: number;

  if (mode === 'auto') {
    [targetR, targetG, targetB] = sampleBackgroundColor(data, width, height);
  } else if (mode === 'black') {
    targetR = 0; targetG = 0; targetB = 0;
  } else if (mode === 'white') {
    targetR = 255; targetG = 255; targetB = 255;
  } else {
    [targetR, targetG, targetB] = targetColor;
  }

  const toleranceSq = tolerance * tolerance;
  const featherInv = feather > 0 ? 1 / feather : 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let dist: number;

    if (mode === 'black') {
      dist = 255 - Math.max(r, g, b);
      const alpha = Math.min(1, Math.max(0, dist / tolerance));
      data[i + 3] = Math.round(alpha * 255 * (1 + smoothness * 0.5));
      continue;
    }

    if (mode === 'white') {
      dist = Math.min(r, g, b);
      const alpha = Math.min(1, Math.max(0, dist / tolerance));
      data[i + 3] = Math.round(alpha * 255 * (1 + smoothness * 0.5));
      continue;
    }

    const dR = r - targetR;
    const dG = g - targetG;
    const dB = b - targetB;
    dist = dR * dR + dG * dG + dB * dB;

    if (dist < toleranceSq) {
      const linearDist = Math.sqrt(dist);
      let alpha: number;

      if (feather > 0 && linearDist > tolerance - feather) {
        const edgeDist = linearDist - (tolerance - feather);
        alpha = edgeDist * featherInv;
        alpha = Math.pow(alpha, 1 + (1 - smoothness) * 2);
        alpha = Math.min(1, Math.max(0, alpha));
      } else {
        alpha = 0;
      }

      data[i + 3] = Math.round(alpha * 255);
    }
  }

  return imageData;
}
