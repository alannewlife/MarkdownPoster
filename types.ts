
export enum BorderTheme {
  Minimal = 'Minimal',
  MacOS = 'MacOS',
  Neon = 'Neon',
  Sketch = 'Sketch',
  Retro = 'Retro',
  Glass = 'Glass',
  // New Colorful Themes
  Sunset = 'Sunset',
  Ocean = 'Ocean',
  Candy = 'Candy',
  // New Attachment/Poster Mode
  Poster = 'Poster'
}

export interface BorderStyleConfig {
  frame: string;      // NEW: The background style of the safety outer frame
  card: string;       // The inner container styling (border, shadow, radius)
  header?: string;    // Optional header styling (for window-like themes)
  content: string;    // The inner content background and text color
  prose: string;      // Typography prose settings (e.g. prose-invert)
  watermarkColor: string; // NEW: Color of the watermark text on the frame
}

export enum AiAction {
  POLISH = 'Polish & Fix Grammar',
  SUMMARIZE = 'Summarize',
  EXPAND = 'Expand Text',
  TRANSLATE_EN = 'Translate to English',
  TRANSLATE_CN = 'Translate to Chinese'
}
