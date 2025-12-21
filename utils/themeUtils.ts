
import { BorderTheme, BorderStyleConfig, FontSize, LayoutTheme, PaddingSize } from '../types';

// Helper to determine if a theme is dark-based (for Writing Mode contrast)
export const isThemeDark = (theme: BorderTheme) => {
  return [BorderTheme.Neon, BorderTheme.Ocean, BorderTheme.Poster].includes(theme);
};

export const getThemeStyles = (themeName: BorderTheme): BorderStyleConfig => {
    switch (themeName) {
      case BorderTheme.Poster:
        return {
          frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600", 
          card: "bg-transparent", 
          content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl min-h-[600px]",
          prose: "prose-slate",
          header: "hidden",
          watermarkColor: "text-white/80"
        };
      case BorderTheme.Sunset:
        return {
          frame: "bg-[#fff7ed]",
          card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50",
          content: "bg-transparent text-gray-800",
          prose: "prose-orange prose-headings:text-orange-900",
          header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2",
          watermarkColor: "text-orange-300"
        };
      case BorderTheme.Ocean:
        return {
          frame: "bg-[#0f172a]",
          card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative",
          content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50",
          prose: "prose-invert prose-headings:text-cyan-200 prose-a:text-cyan-400 [&_td]:text-cyan-50 [&_th]:text-cyan-200",
          header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2",
          watermarkColor: "text-cyan-800"
        };
      case BorderTheme.Candy:
        return {
          frame: "bg-[#fdf2f8]",
          card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden",
          content: "bg-yellow-50/50 text-gray-800 font-comic",
          prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600",
          header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3",
          watermarkColor: "text-pink-300"
        };
      case BorderTheme.Neon:
        return {
          frame: "bg-[#171717]",
          card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden",
          content: "bg-gray-900 text-pink-50",
          prose: "prose-invert prose-p:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 [&_td]:text-pink-50 [&_th]:text-pink-400",
          watermarkColor: "text-pink-900"
        };
      case BorderTheme.Sketch:
        return {
          frame: "bg-[#f5f5f4]",
          card: "bg-white sketch-border p-2",
          content: "bg-transparent text-gray-900 font-comic", 
          prose: "prose-slate prose-headings:font-comic",
          watermarkColor: "text-stone-400"
        };
      case BorderTheme.Retro:
        return {
          frame: "bg-[#e5dfce]",
          card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl",
          content: "bg-[#fdf6e3] text-[#657b83]",
          prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif",
          watermarkColor: "text-[#b58900] opacity-40"
        };
      case BorderTheme.Glass:
        return {
          frame: "bg-gradient-to-br from-indigo-100 to-purple-100",
          card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5",
          content: "bg-transparent text-gray-900",
          prose: "prose-gray prose-headings:text-gray-900 font-sans",
          watermarkColor: "text-indigo-300"
        };
      case BorderTheme.Minimal:
        return {
          frame: "bg-[#f9fafb]",
          card: "bg-white border border-gray-200 shadow-sm",
          content: "bg-white text-gray-900",
          prose: "prose-stone",
          watermarkColor: "text-gray-300"
        };
      case BorderTheme.MacOS:
      default:
        return {
          frame: "bg-[#f3f4f6]",
          card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
          header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2",
          content: "bg-white text-gray-800",
          prose: "prose-slate",
          watermarkColor: "text-gray-400"
        };
    }
};

// Poster Mode: Font Size (Tailwind Classes)
export const getFontSizeClass = (size: FontSize) => {
    switch (size) {
      case FontSize.Small: return 'prose-sm';
      case FontSize.Large: return 'prose-xl';
      case FontSize.Medium: default: return 'prose-base';
    }
};

// Poster Mode: Layout
export const getLayoutClass = (layout: LayoutTheme) => {
    switch (layout) {
      case LayoutTheme.Classic:
        return 'font-serif tracking-tight prose-headings:font-serif';
      case LayoutTheme.Vibrant:
        // Yellow background to em (italic) tags for Vibrant theme
        return 'font-mono tracking-wide prose-headings:font-mono prose-headings:font-black [&_em]:bg-yellow-200 dark:[&_em]:bg-yellow-600 [&_em]:text-black dark:[&_em]:text-white [&_em]:px-1 [&_em]:rounded-sm [&_em]:not-italic';
      case LayoutTheme.Base:
      default:
        return 'font-sans tracking-normal prose-headings:font-sans';
    }
};

// Poster Mode: Padding
export const getFramePaddingClass = (val: PaddingSize) => {
    switch (val) {
        case PaddingSize.Narrow: return 'p-4 sm:p-6';
        case PaddingSize.Wide: return 'p-8 sm:p-16';
        case PaddingSize.Medium: default: return 'p-6 sm:p-10';
    }
};

// WeChat Mode: Font Size (Pixels)
export const getWeChatFontSize = (size: FontSize): string => {
    switch (size) {
        case FontSize.Small: return '14px';
        case FontSize.Large: return '16px';
        case FontSize.Medium: default: return '15px';
    }
};

// WeChat Mode: Line Height (Unitless)
export const getWeChatLineHeight = (lineHeightType: string): string => {
    switch (lineHeightType) {
        case 'compact': return '1.5';     // Tighter (Standard Web)
        case 'comfortable': return '2.2'; // Much looser (Aesthetic/Blog style)
        default: return '1.75';
    }
};
