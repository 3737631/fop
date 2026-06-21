import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollProgress } from './hooks/useScrollProgress';
import BulbCanvas from './components/BulbCanvas';
import ThreeBulb from './components/ThreeBulb';
import BrightnessIndicator from './components/BrightnessIndicator';
import HeroSection from './components/HeroSection';
import ScrollDescriptions from './components/ScrollDescriptions';
import FloatingControls from './components/FloatingControls';
import type { ChromaKeySettings, BgColor, RenderMode } from './types';

const DEFAULT_CHROMA_KEY: ChromaKeySettings = {
  enabled: false,
  mode: 'black',
  tolerance: 60,
  smoothness: 0.3,
  feather: 8,
  targetColor: [0, 177, 64],
};

export default function App() {
  const progress = useScrollProgress();
  const [chromaKey, setChromaKey] = useState<ChromaKeySettings>(DEFAULT_CHROMA_KEY);
  const [bgColor, setBgColor] = useState<BgColor>('black');
  const [renderMode, setRenderMode] = useState<RenderMode>('2d');
  const [showDescriptions, setShowDescriptions] = useState(true);

  return (
    <div className="relative min-h-screen bg-luxe-charcoal overflow-hidden selection:bg-luxe-gold/30">
      <HeroSection progress={progress} />
      <ScrollDescriptions progress={progress} visible={showDescriptions} />

      <FloatingControls
        chromaKey={chromaKey}
        setChromaKey={setChromaKey}
        bgColor={bgColor}
        setBgColor={setBgColor}
        renderMode={renderMode}
        setRenderMode={setRenderMode}
        showDescriptions={showDescriptions}
        setShowDescriptions={setShowDescriptions}
      />

      <BrightnessIndicator progress={progress} />

      <main className="relative z-10">
        <section className="min-h-[200vh] relative flex flex-col items-center justify-start pt-[15vh]">
          <div className="sticky top-[10vh] w-full px-4">
            {renderMode === '2d' ? (
              <BulbCanvas progress={progress} chromaKey={chromaKey} bgColor={bgColor} />
            ) : (
              <ThreeBulb progress={progress} />
            )}
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-32">
          <div
            className="max-w-2xl text-center space-y-8"
            style={{
              opacity: Math.max(0, Math.min(1, (progress - 0.5) * 4)),
              transform: `translateY(${(1 - Math.max(0, Math.min(1, (progress - 0.5) * 4))) * 30}px)`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-luxe-gold/60 font-light">
              El origen de la luz
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-balance leading-tight text-white/90">
              Hecha de los mismos granos que el tiempo
            </h2>
            <p className="text-sm text-white/30 leading-relaxed max-w-lg mx-auto font-light">
              Cada bombilla se funde a partir de arena del desierto del Sáhara,
              seleccionada por su pureza de cuarzo y su capacidad para transformar
              la luz en una experiencia táctil y visual única.
            </p>
            <div className="pt-6">
              <button className="px-8 py-3 rounded-full border border-luxe-gold/30 text-luxe-gold text-xs uppercase tracking-[0.2em] hover:bg-luxe-gold/10 transition-all duration-300">
                Descubrir colección
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <p>&copy; 2026 La Bombilla de Arena</p>
          <p className="font-light tracking-wider">
            Hecho a mano &middot; Edición limitada &middot; Marrakech
          </p>
          <div className="flex gap-4">
            <span className="hover:text-white/40 transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">Contacto</span>
          </div>
        </div>
      </footer>

      <div
        className="scroll-indicator"
        style={{ opacity: Math.max(0, 1 - progress * 3) }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
          Desliza
        </span>
        <ChevronDown size={16} className="text-white/20 animate-bounce" />
      </div>
    </div>
  );
}
