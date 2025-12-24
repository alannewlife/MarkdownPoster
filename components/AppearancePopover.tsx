

import React from 'react';
import { BorderTheme, FontSize, LayoutTheme, PaddingSize, WatermarkAlign } from '../types';
import { ThemeRegistry } from '../utils/themeRegistry';
import { HEADER_PRESETS } from '../config/headerPresets';

interface AppearancePopoverProps {
  currentTheme: BorderTheme;
  setTheme: (theme: BorderTheme) => void;
  layoutTheme: LayoutTheme;
  setLayoutTheme: (theme: LayoutTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  padding: PaddingSize;
  setPadding: (val: PaddingSize) => void;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  watermarkAlign: WatermarkAlign;
  setWatermarkAlign: (align: WatermarkAlign) => void;
  isDarkMode: boolean;
  onClose: () => void;
  
  // New props for custom color
  customThemeColor?: string;
  setCustomThemeColor?: (color: string) => void;
}

export const AppearancePopover: React.FC<AppearancePopoverProps> = ({
  currentTheme,
  setTheme,
  layoutTheme,
  setLayoutTheme,
  fontSize,
  setFontSize,
  padding,
  setPadding,
  showWatermark,
  setShowWatermark,
  watermarkText,
  setWatermarkText,
  watermarkAlign,
  setWatermarkAlign,
  isDarkMode,
  onClose,
  customThemeColor,
  setCustomThemeColor
}) => {
  // Fetch configuration lists from Registry
  const allThemes = ThemeRegistry.getBorderThemes();
  const allLayouts = ThemeRegistry.getLayoutThemes();
  const allFontSizes = ThemeRegistry.getFontSizes();
  const allPaddings = ThemeRegistry.getPaddings();

  // Updated Logic: Check the registry flag instead of hardcoded array
  const currentThemeDef = ThemeRegistry.getBorderTheme(currentTheme);
  const isCustomizable = currentThemeDef?.allowCustomColor || false;

  return (
    <div className={`absolute top-full right-0 mt-2 w-[340px] rounded-xl shadow-2xl border p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right duration-200 select-none
      ${isDarkMode 
        ? 'bg-[#21252b] border-[#181a1f] text-gray-200 shadow-black/50' 
        : 'bg-white border-gray-200 text-gray-800 shadow-gray-200/50'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold opacity-90">自定义海报外观</h3>
        <button onClick={onClose} className="opacity-50 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* 1. Layout Theme (Moved to Top) */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">排版风格</label>
        <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
          {allLayouts.map((lt) => (
            <button
              key={lt.id}
              onClick={() => setLayoutTheme(lt.id)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                layoutTheme === lt.id
                  ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {lt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Background Grid (Border Themes) */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">背景主题</label>
        <div className="grid grid-cols-5 gap-2">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              className={`w-full aspect-square rounded-lg transition-all relative group overflow-hidden
                ${t.preview}
                ${currentTheme === t.id 
                  ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 z-10' 
                  : 'hover:scale-110 hover:shadow-md'
                }
                ${isDarkMode ? 'ring-offset-[#21252b]' : 'ring-offset-white'}
              `}
            >
               {/* Miniature Header Preview - Flush at top, blended into corners */}
               {t.customHeader && HEADER_PRESETS[t.customHeader] && (
                  <div className={`absolute top-0 left-0 right-0 h-3.5 flex items-center justify-center ${
                      t.isDark ? 'bg-white/10 border-b border-white/10' : 'bg-black/5 border-b border-black/5'
                  }`}>
                      {/* UPDATED: Added h-9 to enforce standard header height layout before scaling, preventing squashing/stretching of elements like Win11 buttons */}
                      <div className="flex gap-1 transform scale-[0.4] w-max h-9 items-center justify-center">
                          {HEADER_PRESETS[t.customHeader]}
                      </div>
                  </div>
               )}

               {/* Active State Indicator */}
               {currentTheme === t.id && (
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm ring-2 ring-white"></div>
                 </div>
               )}
            </button>
          ))}
          
          {/* Custom Color Picker Button */}
          {customThemeColor && setCustomThemeColor && (
              <div 
                className={`w-full aspect-square rounded-lg relative group overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    isCustomizable
                    ? 'border border-gray-200 dark:border-gray-600 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400' 
                    : 'border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed'
                }`}
                title={isCustomizable ? "点击修改主色调" : "该主题不支持自定义配色"}
              >
                 <input 
                    type="color" 
                    value={customThemeColor}
                    disabled={!isCustomizable}
                    onChange={(e) => setCustomThemeColor(e.target.value)}
                    className={`absolute inset-0 w-full h-full opacity-0 z-20 ${isCustomizable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                 />
                 
                 {/* Visual State */}
                 {isCustomizable ? (
                     // ACTIVE: Solid Color Background + Overlay White Icon
                     <>
                        <div 
                            className="absolute inset-0 w-full h-full"
                            style={{ backgroundColor: customThemeColor }}
                        />
                        {/* Overlay Palette Icon (White/Transparent to show it's a tool) */}
                        <div className="relative z-10 w-full h-full p-1.5 opacity-90 text-white hover:scale-105 transition-transform duration-200">
                             <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-md">
                                 <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" 
                                    fill="currentColor" 
                                    fillOpacity="0.25"
                                    stroke="currentColor" 
                                    strokeWidth="1.5"
                                 />
                                 <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" /> 
                                 <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" />
                                 <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" />
                                 <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" />
                             </svg>
                        </div>
                     </>
                 ) : (
                     // INACTIVE: Grayscale Palette Icon
                     <div className="opacity-40 grayscale group-hover:opacity-60 transition-all duration-300 scale-75">
                         <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm">
                             {/* Palette Body */}
                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.25 0 2.25-2 2.25-2 0-.55-.45-1-1-1h-2.5c-.55 0-1-.45-1-1 0-.28.11-.53.29-.71.19-.18.26-.43.21-.69l-.33-1.65c-.17-.84.47-1.65 1.33-1.65h.5c.28 0 .5.22.5.5v2c0 1.1 2.24 2 5 2 2.76 0 5-2.24 5-5 0-5.52-4.48-10-10-10z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5"/>
                             {/* Dots (Colored in SVG definition, but grayed out by parent filter) */}
                             <circle cx="6.5" cy="11.5" r="1.5" fill="#f87171" /> 
                             <circle cx="9.5" cy="7.5" r="1.5" fill="#fbbf24" />
                             <circle cx="14.5" cy="7.5" r="1.5" fill="#34d399" />
                             <circle cx="17.5" cy="11.5" r="1.5" fill="#60a5fa" />
                         </svg>
                     </div>
                 )}
              </div>
          )}
        </div>
      </div>

      {/* 3. Font Size & Padding */}
      <div className="mb-6 space-y-4">
        {/* Font Size Row */}
        <div className="flex items-center justify-between">
           <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">文字大小</label>
           <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {allFontSizes.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFontSize(option.id)}
                  className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${
                    fontSize === option.id 
                      ? (isDarkMode ? 'bg-[#3e4451] shadow-sm text-white' : 'bg-white shadow-sm text-gray-900')
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  title={option.label}
                >
                  <span className={option.icon || 'text-sm'}>T</span>
                </button>
              ))}
           </div>
        </div>

        {/* Padding Row */}
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">边距</label>
            <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {allPaddings.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPadding(opt.id)}
                  className={`flex-1 h-7 flex items-center justify-center text-xs font-medium rounded transition-all ${
                    padding === opt.id
                      ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* 4. Signature */}
      <div className="">
         <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">署名 (水印)</label>
            <button 
                onClick={() => setShowWatermark(!showWatermark)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                showWatermark 
                    ? (isDarkMode ? 'bg-[#98c379]' : 'bg-green-500') 
                    : (isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300')
                }`}
            >
                <div 
                className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${showWatermark ? 'translate-x-4' : 'translate-x-0'}`} 
                />
            </button>
         </div>
         
         {showWatermark && (
           <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              <input 
                type="text" 
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="输入您的署名"
                maxLength={40}
                className={`w-full text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-all ${
                    isDarkMode 
                    ? 'bg-[#2c313a] border border-[#3e4451] text-gray-200 focus:ring-[#abb2bf]/30' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800 focus:ring-gray-300'
                }`}
              />
              
              <div className={`flex p-1 rounded-md border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
                {[
                  { align: WatermarkAlign.Left, label: '左' },
                  { align: WatermarkAlign.Center, label: '中' },
                  { align: WatermarkAlign.Right, label: '右' },
                ].map((opt) => (
                  <button
                    key={opt.align}
                    onClick={() => setWatermarkAlign(opt.align)}
                    className={`flex-1 py-1.5 flex justify-center text-xs font-medium rounded transition-all ${
                      watermarkAlign === opt.align
                      ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
           </div>
         )}
      </div>

    </div>
  );
};