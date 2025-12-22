
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

export enum LayoutTheme {
  Base = 'Base',
  Classic = 'Classic',
  Vibrant = 'Vibrant'
}

export enum FontSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large'
}

export enum PaddingSize {
  Narrow = 'Narrow',
  Medium = 'Medium',
  Wide = 'Wide'
}

export enum WatermarkAlign {
  Left = 'text-left',
  Center = 'text-center',
  Right = 'text-right'
}

export enum ViewMode {
  Poster = 'Poster',
  Writing = 'Writing',
  WeChat = 'WeChat'
}

export interface BorderStyleConfig {
  frame: string;      // The background style of the safety outer frame
  card: string;       // The inner container styling (border, shadow, radius)
  header?: string;    // Optional header styling (for window-like themes)
  content: string;    // The inner content background and text color
  prose: string;      // Typography prose settings (e.g. prose-invert)
  watermarkColor: string; // Color of the watermark text on the frame
}

// Deprecated: Kept for migration types if needed, but not used in UI
export enum WeChatTheme {
  Default = 'Default',
  Lovely = 'Lovely',
  Tech = 'Tech',
  Simple = 'Simple'
}

export interface WeChatConfig {
  layout: LayoutTheme;    // Standard, Classic, Vibrant
  primaryColor: string;   // Hex color for the theme
  codeTheme: string;      // e.g., 'dracula', 'github', 'vsDark', 'vsLight'
  macCodeBlock: boolean;
  lineNumbers: boolean;
  linkReferences: boolean; // Convert external links to footnotes
  indent: boolean;        // 2em indent
  justify: boolean;       // text-align: justify
  captionType: 'title' | 'alt' | 'none';
  fontSize: FontSize; // Changed to Enum for S/M/L
  lineHeight: 'compact' | 'comfortable'; // New line height setting
}

export enum AiAction {
  POLISH = 'Polish & Fix Grammar',
  SUMMARIZE = 'Summarize',
  EXPAND = 'Expand Text',
  TRANSLATE_EN = 'Translate to English',
  TRANSLATE_CN = 'Translate to Chinese'
}
