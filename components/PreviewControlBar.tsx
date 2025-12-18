import React from 'react';
import { BorderTheme, FontSize } from '../types';

interface PreviewControlBarProps {
  currentTheme: BorderTheme;
  setTheme: (theme: BorderTheme) => void;
  onExport: () => void;
  isExporting: boolean;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const themes = Object.values(BorderTheme);

// Theme Name Mapping for Chinese UI
const themeNames: Record<BorderTheme, string> = {
  [BorderTheme.Minimal]: '极简白',
  [BorderTheme.MacOS]: 'macOS',
  [BorderTheme.Neon]: '赛博霓虹',
  [BorderTheme.Sketch]: '手绘风格',
  [BorderTheme.Retro]: '复古报纸',
  [BorderTheme.Glass]: '毛玻璃',
  [BorderTheme.Sunset]: '日落渐变',
  [BorderTheme.Ocean]: '深海系统',
  [BorderTheme.Candy]: '糖果甜心',
  [BorderTheme.Poster]: '幻彩紫韵'
};

export const PreviewControlBar: React.FC<PreviewControlBarProps> = ({ 
  currentTheme, 
  setTheme, 
  onExport,
  isExporting,
  showWatermark,
  setShowWatermark,
  watermarkText,
  setWatermarkText,
  fontSize,
  setFontSize
}) => {
  return (
    <div className="h-12 border-b border-gray-200 bg-gray-50/90 backdrop-blur-sm flex items-center relative z-20 shrink-0">
      
      {/* Centered Controls Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-6 overflow-x-auto no-scrollbar max-w-full px-16">
          
          {/* Watermark Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">署名</span>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setShowWatermark(!showWatermark)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${showWatermark ? 'bg-gray-700' : 'bg-gray-300'}`}
              >
                <div 
                  className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${showWatermark ? 'translate-x-4' : 'translate-x-0'}`} 
                />
              </button>

              {/* Input Field */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showWatermark ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value.slice(0, 20))}
                  placeholder="人人智学社"
                  maxLength={20}
                  className="w-full bg-white border border-gray-300 text-gray-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400"
                />
              </div>
          </div>

          <div className="h-4 w-px bg-gray-200 flex-shrink-0"></div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">字号</span>
            <div className="flex items-center bg-gray-200/50 rounded-md border border-gray-200 p-0.5">
              {[
                { label: 'S', value: FontSize.Small, icon: 'text-xs' },
                { label: 'M', value: FontSize.Medium, icon: 'text-sm' },
                { label: 'L', value: FontSize.Large, icon: 'text-lg' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`w-7 h-6 flex items-center justify-center rounded text-xs font-bold transition-all ${
                    fontSize === option.value 
                      ? 'bg-white shadow-sm text-gray-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={option.label}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-gray-200 flex-shrink-0"></div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">主题</span>
            <select 
              value={currentTheme}
              onChange={(e) => setTheme(e.target.value as BorderTheme)}
              className="bg-white border border-gray-300 text-xs font-bold text-gray-700 py-1 pl-2 pr-6 rounded focus:outline-none cursor-pointer hover:border-gray-400 transition-colors h-7 focus:ring-1 focus:ring-gray-200 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.25rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em'
              }}
            >
              {themes.map(t => (
                <option key={t} value={t}>{themeNames[t]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Button (Absolute Right) */}
      <div className="absolute right-4 flex items-center z-30">
        <button
          onClick={onExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${
              isExporting ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {isExporting ? '处理中...' : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              导出图片
            </>
          )}
        </button>
      </div>
    </div>
  );
};