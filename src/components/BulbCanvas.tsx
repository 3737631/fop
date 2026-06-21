import { useRef, useEffect, useState } from 'react';
import { generateAllFrames } from '../utils/generateFrames';
import { processChromaKey } from '../utils/chromaKey';
import type { ChromaKeySettings, BgColor } from '../types';

const BG_COLORS: Record<BgColor, string> = {
  black: '#000000',
  green: '#00b140',
  blue: '#4a90d9',
  white: '#ffffff',
};

const IMAGE_URLS = [
  '/frames/frame_0_off.png',
  '/frames/frame_1_dim.png',
  '/frames/frame_2_medium.png',
  '/frames/frame_3_full.png',
];

interface Props {
  progress: number;
  chromaKey: ChromaKeySettings;
  bgColor: BgColor;
}

export default function BulbCanvas({ progress, chromaKey, bgColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [usingGenerated, setUsingGenerated] = useState(false);

  useEffect(() => {
    let active = true;

    const loadRealImages = async () => {
      const results: HTMLImageElement[] = [];
      for (let i = 0; i < IMAGE_URLS.length; i++) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = IMAGE_URLS[i];
          });
          results.push(img);
        } catch {
          return null;
        }
      }
      return results.length === IMAGE_URLS.length ? results : null;
    };

    const init = async () => {
      const real = await loadRealImages();
      if (!active) return;
      if (real) {
        setFrames(real);
        setUsingGenerated(false);
      } else {
        const generated = await generateAllFrames();
        if (active) {
          setFrames(generated);
          setUsingGenerated(true);
        }
      }
    };

    init();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length < 4) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const val = progress * 3;
    const f1 = Math.min(2, Math.floor(val));
    const f2 = Math.min(3, f1 + 1);
    const t = val - f1;

    const img1 = frames[f1];
    const img2 = frames[f2];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1.0 - t;
    ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = t;
    ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1.0;

    if (chromaKey.enabled) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processed = processChromaKey(imageData, chromaKey);
      ctx.putImageData(processed, 0, 0);
    } else {
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = BG_COLORS[bgColor];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [progress, frames, chromaKey, bgColor]);

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      {usingGenerated && frames.length === 4 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-luxe-gold/10 border border-luxe-gold/20 text-luxe-gold text-xs whitespace-nowrap">
          Mostrando frames generados — coloca tus 4 imágenes en <code className="font-mono underline">public/frames/</code>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-auto rounded-2xl shadow-2xl"
        style={{ aspectRatio: '1/1' }}
      />
    </div>
  );
}
