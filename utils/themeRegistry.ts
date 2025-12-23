
import yaml from 'js-yaml';
import { THEME_CONFIG_YAML } from '../config/themeConfig';
import { BorderStyleConfig, WatermarkAlign } from '../types';

export interface ThemeDef extends BorderStyleConfig {
    id: string;
    name: string;
    preview: string; // Tailwind class for small preview circle
    isDark?: boolean; // If true, UI might adjust contrast
    customHeader?: string; // For specific header renderings like macos/sunset/candy
    customDecor?: string; // New: For corner decorations (Ink squares, Baroque patterns)
    allowCustomColor?: boolean; // New: If true, enables the color picker for this theme
}

export interface LayoutDef {
    id: string;
    name: string;
    className: string;
}

export interface FontSizeDef {
    id: string;
    label: string;
    className: string;
    icon: string;
}

export interface PaddingDef {
    id: string;
    label: string;
    className: string;
}

interface WatermarkConfig {
    show: boolean;
    text: string;
    align: WatermarkAlign;
}

interface Defaults {
    theme: string;
    layout: string;
    fontSize: string;
    padding: string;
    watermark: WatermarkConfig;
}

interface ParsedConfig {
    defaults: Defaults;
    borderThemes: ThemeDef[]; // Renamed from 'themes' in previous version
    layoutThemes: LayoutDef[];
    fontSizes: FontSizeDef[];
    paddings: PaddingDef[];
    
    // Legacy support if yaml uses old key
    themes?: ThemeDef[]; 
}

class ThemeRegistryClass {
    private config: ParsedConfig;
    private themeMap: Record<string, ThemeDef>;
    private layoutMap: Record<string, LayoutDef>;
    private fontSizeMap: Record<string, FontSizeDef>;
    private paddingMap: Record<string, PaddingDef>;

    constructor() {
        try {
            this.config = yaml.load(THEME_CONFIG_YAML) as ParsedConfig;
            
            // Normalize border themes (handle potential legacy key 'themes')
            const borderThemes = this.config.borderThemes || this.config.themes || [];

            this.themeMap = {};
            borderThemes.forEach(t => {
                this.themeMap[t.id] = t;
            });

            this.layoutMap = {};
            (this.config.layoutThemes || []).forEach(l => {
                this.layoutMap[l.id] = l;
            });

            this.fontSizeMap = {};
            (this.config.fontSizes || []).forEach(f => {
                this.fontSizeMap[f.id] = f;
            });

            this.paddingMap = {};
            (this.config.paddings || []).forEach(p => {
                this.paddingMap[p.id] = p;
            });

        } catch (e) {
            console.error("Failed to parse Theme YAML:", e);
            // Fallback structure
            this.config = {
                defaults: { 
                    theme: 'Minimal', 
                    layout: 'Base', 
                    fontSize: 'Medium', 
                    padding: 'Medium',
                    watermark: {
                        show: true,
                        text: '人人智学社 rrzxs.com',
                        align: WatermarkAlign.Right
                    }
                },
                borderThemes: [],
                layoutThemes: [],
                fontSizes: [],
                paddings: []
            };
            this.themeMap = {};
            this.layoutMap = {};
            this.fontSizeMap = {};
            this.paddingMap = {};
        }
    }

    // --- Accessors for Lists ---

    getBorderThemes(): ThemeDef[] {
        return this.config.borderThemes || this.config.themes || [];
    }

    getLayoutThemes(): LayoutDef[] {
        return this.config.layoutThemes || [];
    }

    getFontSizes(): FontSizeDef[] {
        return this.config.fontSizes || [];
    }

    getPaddings(): PaddingDef[] {
        return this.config.paddings || [];
    }

    // --- Accessors for Individual Items ---

    getBorderTheme(id: string): ThemeDef | undefined {
        return this.themeMap[id];
    }

    getLayoutTheme(id: string): LayoutDef | undefined {
        return this.layoutMap[id];
    }

    getFontSize(id: string): FontSizeDef | undefined {
        return this.fontSizeMap[id];
    }

    getPadding(id: string): PaddingDef | undefined {
        return this.paddingMap[id];
    }

    // --- Defaults ---

    getDefaults(): Defaults {
        const d = this.config.defaults;
        // Ensure nested objects exist to prevent crashes if YAML is malformed
        return {
            theme: d?.theme || 'Minimal',
            layout: d?.layout || 'Base',
            fontSize: d?.fontSize || 'Medium',
            padding: d?.padding || 'Medium',
            watermark: {
                show: d?.watermark?.show ?? true,
                text: d?.watermark?.text ?? "人人智学社 rrzxs.com",
                align: (d?.watermark?.align as WatermarkAlign) || WatermarkAlign.Right
            }
        };
    }
}

export const ThemeRegistry = new ThemeRegistryClass();
