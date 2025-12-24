
// Themes and configurations are now loaded dynamically from YAML.
// We use string types instead of Enums to allow for easy extension without code changes.

export type BorderTheme = string;
export type LayoutTheme = string;
export type WritingTheme = string;
export type FontSize = string;
export type PaddingSize = string;

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
  layout: LayoutTheme;    // Standard, Classic, Vibrant (now strings)
  primaryColor: string;   // Hex color for the theme
  codeTheme: string;      // e.g., 'dracula', 'github', 'vsDark', 'vsLight'
  macCodeBlock: boolean;
  lineNumbers: boolean;
  linkReferences: boolean; // Convert external links to footnotes
  indent: boolean;        // 2em indent
  justify: boolean;       // text-align: justify
  captionType: 'title' | 'alt' | 'none';
  fontSize: FontSize;     // Now a string (Small, Medium, Large)
  lineHeight: 'compact' | 'comfortable'; // New line height setting
}

export enum AiAction {
  POLISH = 'Polish & Fix Grammar',
  SUMMARIZE = 'Summarize',
  EXPAND = 'Expand Text',
  TRANSLATE_EN = 'Translate to English',
  TRANSLATE_CN = 'Translate to Chinese'
}