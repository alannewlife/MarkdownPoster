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
  card: string;       // The outer container styling (border, shadow, radius)
  header?: string;    // Optional header styling (for window-like themes)
  content: string;    // The inner content background and text color
  prose: string;      // Typography prose settings (e.g. prose-invert)
}

export enum AiAction {
  POLISH = 'Polish & Fix Grammar',
  SUMMARIZE = 'Summarize',
  EXPAND = 'Expand Text',
  TRANSLATE_EN = 'Translate to English',
  TRANSLATE_CN = 'Translate to Chinese'
}