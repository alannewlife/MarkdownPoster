
import { FontSize, LayoutTheme, PaddingSize } from '../types';
import { ThemeRegistry, ThemeDef } from './themeRegistry';

// Helper to determine if a theme is dark-based (for Writing Mode contrast)
export const isThemeDark = (themeId: string) => {
    const theme = ThemeRegistry.getBorderTheme(themeId);
    return theme?.isDark || false;
};

export const getThemeStyles = (themeName: string): ThemeDef => {
    const theme = ThemeRegistry.getBorderTheme(themeName);
    if (!theme) {
        return ThemeRegistry.getBorderTheme(ThemeRegistry.getDefaults().theme)!;
    }
    return theme;
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
// Note: WeChat mode logic implies pixel values, while Poster Mode uses Tailwind classes.
// We map the IDs (Small, Medium, Large) to pixel values here manually for now,
// as the user focused on Poster Mode configuration in YAML.

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
