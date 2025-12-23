import React from 'react';
import { FontSize, LayoutTheme, PaddingSize } from '../types';
import { ThemeRegistry, ThemeDef } from './themeRegistry';

// Helper to determine if a theme is dark-based (for Writing Mode contrast)
export const isThemeDark = (themeId: string) => {
    const theme = ThemeRegistry.getBorderTheme(themeId);
    return theme?.isDark || false;
};

// Helper: Convert Hex to HSL for gradient manipulation
function hexToHSL(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
  
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return { h, s, l };
}

// Override logic to support dynamic colors with rich Mesh Gradients and Theme Customization
export const getThemeStyles = (themeName: string, customColor?: string): ThemeDef & { frameStyle?: React.CSSProperties, cardStyle?: React.CSSProperties } => {
    const theme = ThemeRegistry.getBorderTheme(themeName);
    const baseTheme = theme || ThemeRegistry.getBorderTheme(ThemeRegistry.getDefaults().theme)!;

    if (customColor) {
        const { h, s } = hexToHSL(customColor);
        
        // 1. Aurora: Deep, Vibrant, Multi-layered Dark (Cyberpunk/Borealis vibe)
        if (themeName === 'Aurora') {
            const sat = 90; 
            const layer1 = `radial-gradient(circle at 0% 0%, hsl(${(h + 40) % 360}, ${sat}%, 45%) 0%, transparent 50%)`;
            const layer2 = `radial-gradient(circle at 100% 100%, hsl(${h}, ${sat}%, 30%) 0%, transparent 60%)`;
            const layer3 = `linear-gradient(135deg, hsl(${h}, ${sat}%, 10%), hsl(${(h - 30 + 360) % 360}, ${sat}%, 5%))`;

            return {
                ...baseTheme,
                frameStyle: { 
                    backgroundImage: `${layer1}, ${layer2}, ${layer3}`,
                    backgroundSize: '100% 100%'
                }
            };
        }
        
        // 2. Radiance: Ethereal, Holographic, Pastel (Pearlescent vibe)
        // Modified to be "Richer/Concentrated" (Macaron style but readable with white text)
        if (themeName === 'Radiance') {
            const sat = 85; 
            // Lower lightness to ~60% to ensure white text pops. 
            // Original was 85-95% which was too bright for white text.
            const mainL = 60; 
            
            const layer1 = `radial-gradient(circle at 100% 0%, hsl(${(h - 45 + 360) % 360}, ${sat}%, ${mainL + 10}%) 0%, transparent 50%)`;
            const layer2 = `radial-gradient(circle at 0% 100%, hsl(${(h + 45) % 360}, ${sat}%, ${mainL + 10}%) 0%, transparent 50%)`;
            const layer3 = `linear-gradient(120deg, hsl(${h}, ${sat}%, ${mainL - 5}%) 0%, hsl(${h}, ${sat}%, ${mainL - 15}%) 100%)`;

            return {
                ...baseTheme,
                frameStyle: { 
                    backgroundImage: `${layer1}, ${layer2}, ${layer3}`,
                    backgroundSize: '100% 100%'
                }
            };
        }

        // 3. Glass: Frosted glass effect with custom tint
        if (themeName === 'Glass') {
            const lightL = 96;
            const darkL = 92;
            const layer1 = `linear-gradient(135deg, hsl(${h}, ${s}%, ${lightL}%) 0%, hsl(${h}, ${s}%, ${darkL}%) 100%)`;
            
            return {
                ...baseTheme,
                frameStyle: {
                    background: layer1
                },
                // Optional: You could also tint the glass border if desired
                cardStyle: {
                    borderColor: `hsla(${h}, ${s}%, 50%, 0.3)`
                }
            }
        }

        // 4. Neon: Cyberpunk glow with custom color
        if (themeName === 'Neon') {
            // High saturation for neon
            const neonS = 90;
            const neonL = 60; 
            const neonColor = `hsl(${h}, ${neonS}%, ${neonL}%)`;
            const glowColor = `hsla(${h}, ${neonS}%, ${neonL}%, 0.5)`;

            return {
                ...baseTheme,
                // We don't change frame background (keep it dark), just the card accents
                cardStyle: {
                    borderColor: neonColor,
                    boxShadow: `0 0 30px ${glowColor}`
                },
                // Update text color for Watermark to match
                watermarkColor: `text-[${neonColor}] opacity-80` 
                // Note: Tailwind arbitrary values in template literals like this won't work 
                // unless fully compiled, but inline style works for Card. 
                // For watermark, we might need another strategy or just accept a generic tint.
                // However, the cardStyle is the visual heavy lifter here.
            }
        }
    }

    return baseTheme;
};

// Poster Mode: Font Size (Tailwind Classes)
export const getFontSizeClass = (sizeId: FontSize) => {
    const def = ThemeRegistry.getFontSize(sizeId);
    return def ? def.className : 'prose-base';
};

// Poster Mode: Layout
export const getLayoutClass = (layoutId: LayoutTheme) => {
    const def = ThemeRegistry.getLayoutTheme(layoutId);
    return def ? def.className : 'font-sans';
};

// Poster Mode: Padding
export const getFramePaddingClass = (paddingId: PaddingSize) => {
    const def = ThemeRegistry.getPadding(paddingId);
    return def ? def.className : 'p-6 sm:p-10';
};

// --- WeChat Mode Helpers ---
export const getWeChatFontSize = (size: FontSize): string => {
    switch (size) {
        case 'Small': return '14px';
        case 'Large': return '16px';
        case 'Medium': default: return '15px';
    }
};

export const getWeChatLineHeight = (lineHeightType: string): string => {
    switch (lineHeightType) {
        case 'compact': return '1.5';     // Tighter (Standard Web)
        case 'comfortable': return '2.2'; // Much looser (Aesthetic/Blog style)
        default: return '1.75';
    }
};