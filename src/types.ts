export type ChromaKeyMode = 'auto' | 'black' | 'white' | 'color';
export type BgColor = 'black' | 'green' | 'blue' | 'white';
export type RenderMode = '2d' | 'three';

export interface ChromaKeySettings {
  enabled: boolean;
  mode: ChromaKeyMode;
  tolerance: number;
  smoothness: number;
  feather: number;
  targetColor: [number, number, number];
}

export interface ControlSettings {
  bgColor: BgColor;
  chromaKey: ChromaKeySettings;
  renderMode: RenderMode;
  showDescriptions: boolean;
}
