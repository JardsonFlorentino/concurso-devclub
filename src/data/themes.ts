
export const THEME_KEYS = ["devclub", "matrix", "deep-purple"] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const DEFAULT_THEME: ThemeKey = "devclub";

interface ParticleTheme { 
  palette: number[]; 
  bloom: { strength: number; radius: number; threshold: number };
}

export const PARTICLE_THEMES: Record<ThemeKey, ParticleTheme> = {
  devclub: {
    palette: [0x39d353, 0xf5f5f7, 0x8532f2, 0xffffff, 0x6fe087],
    bloom: { strength: 0.6, radius: 0.4, threshold: 0.85 },
  },
 
  matrix: {
    palette: [0x39d353, 0x7ee897, 0x16803c, 0xffffff, 0x2fb344],
    bloom: { strength: 0.55, radius: 0.4, threshold: 0.85 },
  },
  "deep-purple": {
    palette: [0x8532f2, 0xa855f7, 0x6b21d8, 0xd8b4fe, 0x9a4dff],
    bloom: { strength: 0.68, radius: 0.4, threshold: 0.85 },
  },
};
