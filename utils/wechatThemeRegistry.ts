import yaml from 'js-yaml';
import { WECHAT_THEME_CONFIG_YAML } from '../config/wechatConfig';
import { themes, PrismTheme } from 'prism-react-renderer';
import { hexToRgba } from './themeUtils';
import { WeChatStyleDef } from '../types';

interface WeChatLayoutDef {
  id: string;
  name: string;
  styles: Record<string, any>; // Raw style object from YAML with placeholders
}

interface WeChatCodeThemeDef {
  label: string;
  value: string;
  isDark: boolean;
}

interface WeChatParsedConfig {
  colorPresets: { color: string; label: string }[];
  codeThemes: WeChatCodeThemeDef[];
  fontSizes: { label: string; value: string; pixel: string }[];
  lineHeights: { label: string; value: string; scale: string }[];
  captionTypes: { label: string; value: string }[];
  layouts: WeChatLayoutDef[];
}

class WeChatThemeRegistryClass {
  private config: WeChatParsedConfig;

  constructor() {
    try {
      this.config = yaml.load(WECHAT_THEME_CONFIG_YAML) as WeChatParsedConfig;
    } catch (e) {
      console.error("Failed to parse WeChat Theme YAML:", e);
      // Fallback minimal config
      this.config = {
        colorPresets: [{ color: '#07c160', label: 'Default' }],
        codeThemes: [{ label: 'Dark', value: 'vsDark', isDark: true }],
        fontSizes: [{ label: 'Medium', value: 'Medium', pixel: '15px' }],
        lineHeights: [{ label: 'Comfortable', value: 'comfortable', scale: '1.75' }],
        captionTypes: [{ label: 'Title', value: 'title' }],
        layouts: []
      };
    }
  }

  // --- Getters ---
  getColorPresets() { return this.config.colorPresets || []; }
  getCodeThemes() { return this.config.codeThemes || []; }
  getFontSizes() { return this.config.fontSizes || []; }
  getLineHeights() { return this.config.lineHeights || []; }
  getCaptionTypes() { return this.config.captionTypes || []; }
  getLayouts() { return this.config.layouts || []; }

  // --- Helpers ---

  getFontSizePixel(value: string): string {
    const found = this.config.fontSizes?.find(f => f.value === value);
    return found ? found.pixel : '15px';
  }

  getLineHeightScale(value: string): string {
    const found = this.config.lineHeights?.find(l => l.value === value);
    return found ? found.scale : '1.75';
  }

  getCodeThemeDef(value: string) {
    const def = this.config.codeThemes?.find(t => t.value === value);
    // Map string value to actual Prism theme object
    const themeMap: Record<string, PrismTheme> = {
      vsDark: themes.vsDark,
      vsLight: themes.vsLight,
      dracula: themes.dracula,
      github: themes.github,
      nightOwl: themes.nightOwl,
      oceanicNext: themes.oceanicNext,
    };
    
    return {
      ...def,
      theme: themeMap[value] || themes.vsDark,
      isDark: def?.isDark ?? true
    };
  }

  // --- Style Generation with Interpolation ---

  getLayoutStyles(layoutId: string, primaryColor: string): WeChatStyleDef {
    const layout = this.config.layouts?.find(l => l.id === layoutId);
    
    // Default fallback styles if layout not found or missing specific keys
    const fallback: WeChatStyleDef = {
       h1: {}, h2: {}, h3: {}, list: {}, blockquote: {}, link: {}, hr: {}
    };

    if (!layout || !layout.styles) return fallback;

    // Deep interpolation of the style object
    const styles = this.interpolateStyles(layout.styles, primaryColor);
    
    return { ...fallback, ...styles };
  }

  private interpolateStyles(obj: any, primaryColor: string): any {
    if (typeof obj === 'string') {
        // Replace {{primary}} with hex color
        // Replace {{primary_0.5}} with rgba(hex, 0.5)
        return obj.replace(/{{primary(?:_([\d.]+))?}}/g, (_, alpha) => {
            if (alpha) {
                return hexToRgba(primaryColor, parseFloat(alpha));
            }
            return primaryColor;
        });
    }
    
    if (Array.isArray(obj)) {
        return obj.map(v => this.interpolateStyles(v, primaryColor));
    }

    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = this.interpolateStyles(obj[key], primaryColor);
        }
        return result;
    }

    return obj;
  }
}

export const WeChatThemeRegistry = new WeChatThemeRegistryClass();
