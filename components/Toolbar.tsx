import React from 'react';
import { BorderTheme, FontSize } from '../types';

interface ToolbarProps {
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
  [BorderTheme.Poster]: '海报模式'
};

export const Toolbar: React.FC<ToolbarProps> = ({ 
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
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 px-6 bg-white/90 backdrop-blur-md border-b border-gray-200 gap-4 shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 select-none">
          <img 
            alt="RenRen AI Club" 
            className="h-10 w-auto object-contain drop-shadow-sm" 
            src="https://s2.loli.net/2025/11/16/uQj16PrXzOdFtea.png" 
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight font-sans">
            MarkdownPoster
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        
        {/* Watermark Controls (Toggle Switch) */}
         <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1.5 border border-gray-200 px-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">水印</span>
            
            {/* Toggle Switch */}
            <button 
              onClick={() => setShowWatermark(!showWatermark)}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${showWatermark ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <div 
                className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${showWatermark ? 'translate-x-4' : 'translate-x-0'}`} 
              />
            </button>

            {/* Input Field with Width Transition to reduce layout jump feeling */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showWatermark ? 'w-36 opacity-100 ml-1' : 'w-0 opacity-0 ml-0'}`}>
              <input 
                type="text" 
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value.slice(0, 20))}
                placeholder="自定义文案"
                maxLength={20}
                className="w-full bg-white border border-amber-400 text-gray-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder:text-gray-400"
              />
            </div>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border border-gray-200">
          <span className="text-xs font-bold text-gray-500 pl-2 uppercase tracking-wide">字号:</span>
          <div className="flex items-center">
            {[
              { label: '小', value: FontSize.Small, icon: 'text-xs' },
              { label: '中', value: FontSize.Medium, icon: 'text-sm' },
              { label: '大', value: FontSize.Large, icon: 'text-lg' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={`w-8 py-1 rounded text-xs font-bold transition-all ${
                  fontSize === option.value 
                    ? 'bg-white shadow text-amber-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={option.label}
              >
                <span className={option.icon}>A</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border border-gray-200">
          <span className="text-xs font-bold text-gray-500 pl-2 uppercase tracking-wide">主题:</span>
          <select 
            value={currentTheme}
            onChange={(e) => setTheme(e.target.value as BorderTheme)}
            className="bg-transparent text-sm font-semibold text-gray-700 py-1.5 px-2 rounded focus:outline-none cursor-pointer hover:bg-white transition-colors"
          >
            {themes.map(t => (
              <option key={t} value={t}>{themeNames[t]}</option>
            ))}
          </select>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md ${
             isExporting ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'
          }`}
        >
          {isExporting ? '处理中...' : (
             <>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               导出图片
             </>
          )}
        </button>
      </div>
    </div>
  );
};