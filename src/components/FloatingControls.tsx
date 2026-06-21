import { useState } from 'react';
import { Settings, X, Eye, EyeOff, Crop, SlidersHorizontal, Shirt, Layers, Monitor } from 'lucide-react';
import type { ChromaKeySettings, BgColor, RenderMode } from '../types';

interface Props {
  chromaKey: ChromaKeySettings;
  setChromaKey: (s: ChromaKeySettings) => void;
  bgColor: BgColor;
  setBgColor: (c: BgColor) => void;
  renderMode: RenderMode;
  setRenderMode: (m: RenderMode) => void;
  showDescriptions: boolean;
  setShowDescriptions: (v: boolean) => void;
}

const BG_OPTIONS: { value: BgColor; label: string; color: string }[] = [
  { value: 'black', label: 'Negro', color: '#000000' },
  { value: 'green', label: 'Verde', color: '#00b140' },
  { value: 'blue', label: 'Azul', color: '#4a90d9' },
  { value: 'white', label: 'Blanco', color: '#ffffff' },
];

export default function FloatingControls({
  chromaKey, setChromaKey,
  bgColor, setBgColor,
  renderMode, setRenderMode,
  showDescriptions, setShowDescriptions,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="control-panel">
      <button
        onClick={() => setOpen(!open)}
        className="control-btn"
        title="Ajustes"
      >
        {open ? <X size={16} /> : <Settings size={16} />}
      </button>

      {open && (
        <div className="w-72 bg-luxe-charcoal/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5 animate-fade-in">
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Modo de render
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setRenderMode('2d')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  renderMode === '2d'
                    ? 'bg-luxe-gold/20 text-luxe-gold border border-luxe-gold/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Monitor size={14} />
                2D
              </button>
              <button
                onClick={() => setRenderMode('three')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  renderMode === 'three'
                    ? 'bg-luxe-gold/20 text-luxe-gold border border-luxe-gold/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Shirt size={14} />
                3D
              </button>
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
                Fondo
              </h3>
              <button
                onClick={() => setChromaKey({ ...chromaKey, enabled: !chromaKey.enabled })}
                className={`p-1.5 rounded-lg transition-all ${
                  chromaKey.enabled
                    ? 'bg-luxe-gold/20 text-luxe-gold'
                    : 'text-white/30 hover:text-white/60'
                }`}
                title={chromaKey.enabled ? 'Desactivar croma' : 'Activar croma'}
              >
                {chromaKey.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            {!chromaKey.enabled ? (
              <div className="flex gap-2 flex-wrap">
                {BG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBgColor(opt.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      bgColor === opt.value
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-white/40 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/10"
                      style={{ backgroundColor: opt.color }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {(['auto', 'black', 'white', 'color'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setChromaKey({ ...chromaKey, mode })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        chromaKey.mode === mode
                          ? 'bg-luxe-gold/20 text-luxe-gold border border-luxe-gold/30'
                          : 'text-white/40 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {mode === 'auto' ? 'Auto' : mode === 'black' ? 'Negro' : mode === 'white' ? 'Blanco' : 'Color'}
                    </button>
                  ))}
                </div>

                {chromaKey.mode === 'color' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Color:</label>
                    <input
                      type="color"
                      value={`#${chromaKey.targetColor.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        setChromaKey({ ...chromaKey, targetColor: [r, g, b] });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/10"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <SlidersHorizontal size={12} />
                      Tolerancia
                    </span>
                    <span className="text-xs text-white/60 tabular-nums">{chromaKey.tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={chromaKey.tolerance}
                    onChange={(e) => setChromaKey({ ...chromaKey, tolerance: Number(e.target.value) })}
                    className="slider-input"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Crop size={12} />
                      Suavidad
                    </span>
                    <span className="text-xs text-white/60 tabular-nums">{chromaKey.smoothness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={chromaKey.smoothness}
                    onChange={(e) => setChromaKey({ ...chromaKey, smoothness: Number(e.target.value) })}
                    className="slider-input"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Layers size={12} />
                        Pluma / Contorno
                    </span>
                    <span className="text-xs text-white/60 tabular-nums">{chromaKey.feather}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={chromaKey.feather}
                    onChange={(e) => setChromaKey({ ...chromaKey, feather: Number(e.target.value) })}
                    className="slider-input"
                  />
                </div>
              </div>
            )}
          </div>

          <hr className="border-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Descripciones
            </span>
            <button
              onClick={() => setShowDescriptions(!showDescriptions)}
              className={`p-1.5 rounded-lg transition-all ${
                showDescriptions
                  ? 'bg-luxe-gold/20 text-luxe-gold'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {showDescriptions ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
