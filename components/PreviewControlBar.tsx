import React from 'react';
import { BorderTheme, FontSize } from '../types';

interface PreviewControlBarProps {
  currentTheme: BorderTheme;
  setTheme: (theme: BorderTheme) => void;
  onExport: () => void;
  onCopyImage: () => void; // New prop
  isExporting: boolean;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode?: boolean; // Changed from isZenMode
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
  onCopyImage,
  isExporting,
  showWatermark,
  setShowWatermark,
  watermarkText,
  setWatermarkText,
  fontSize,
  setFontSize,
  isDarkMode = false
}) => {
  return (
    <div className={`h-12 border-b flex items-center justify-between px-4 sm:px-6 gap-4 relative z-20 shrink-0 transition-colors duration-500 
      ${isDarkMode 
        ? 'bg-[#1e2227] border-[#181a1f] text-[#abb2bf]' // Dark Mode
        : 'border-gray-200 bg-gray-50/90 backdrop-blur-sm text-gray-700'
      }`}>
      
      {/* Dynamic Centered Controls Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden min-w-0">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar max-w-full px-2">
          
          {/* Watermark Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline transition-colors ${isDarkMode ? 'text-[#5c6370]' : 'text-gray-400'}`}>署名</span>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setShowWatermark(!showWatermark)}
                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                  showWatermark 
                    ? (isDarkMode ? 'bg-[#98c379]' : 'bg-gray-700') // Earthy Green for active
                    : (isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300')
                }`}
              >
                <div 
                  className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${showWatermark ? 'translate-x-4' : 'translate-x-0'}`} 
                />
              </button>

              {/* Input Field */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showWatermark ? 'w-32 sm:w-48 opacity-100' : 'w-0 opacity-0'}`}>
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value.slice(0, 30))}
                  placeholder="人人智学社 rrzxs.com"
                  maxLength={30}
                  className={`w-full text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-500 ${
                    isDarkMode 
                      ? 'bg-[#282c34] border border-[#3e4451] text-[#d4cfbf] focus:ring-[#abb2bf]/30' 
                      : 'bg-white border border-gray-300 text-gray-700 focus:ring-gray-400'
                  }`}
                />
              </div>
          </div>

          <div className={`h-4 w-px flex-shrink-0 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-200'}`}></div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline transition-colors ${isDarkMode ? 'text-[#5c6370]' : 'text-gray-400'}`}>字号</span>
            <div className={`flex items-center rounded-md border p-0.5 transition-colors ${isDarkMode ? 'bg-[#282c34] border-[#3e4451]' : 'bg-gray-200/50 border-gray-200'}`}>
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
                      ? (isDarkMode ? 'bg-[#3e4451] shadow-sm text-[#d4cfbf]' : 'bg-white shadow-sm text-gray-800')
                      : (isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-gray-400 hover:text-gray-600')
                  }`}
                  title={option.label}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`h-4 w-px flex-shrink-0 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-200'}`}></div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline transition-colors ${isDarkMode ? 'text-[#5c6370]' : 'text-gray-400'}`}>主题</span>
            <select 
              value={currentTheme}
              onChange={(e) => setTheme(e.target.value as BorderTheme)}
              className={`text-xs font-bold py-1 pl-2 pr-6 rounded focus:outline-none cursor-pointer hover:border-opacity-50 transition-colors h-7 focus:ring-1 appearance-none border ${
                isDarkMode 
                  ? 'bg-[#282c34] border-[#3e4451] text-[#d4cfbf] hover:border-[#abb2bf] focus:ring-[#abb2bf]/30' 
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-gray-200'
              }`}
              style={{
                backgroundImage: isDarkMode 
                  ? `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239da5b4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`
                  : `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.25rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em'
              }}
            >
              {themes.map(t => (
                <option key={t} value={t} className={isDarkMode ? 'bg-[#282c34]' : ''}>{themeNames[t]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Actions (Fixed Right) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Copy Image Button */}
        <button
          onClick={onCopyImage}
          disabled={isExporting}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all shadow-sm ${
            isExporting 
              ? 'bg-gray-400 text-white' 
              : (isDarkMode 
                  ? 'bg-[#3e4451] text-[#d4cfbf] hover:bg-[#4b5263] active:scale-95 border border-[#181a1f]' 
                  : 'bg-[#997343] text-white hover:bg-[#85633e] active:scale-95')
          }`}
          title="复制图片到剪贴板"
        >
           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
           <span className="hidden sm:inline">复制</span>
        </button>

        {/* Download Button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${
              isExporting 
                ? 'bg-gray-400' 
                : (isDarkMode 
                    ? 'bg-[#e5c07b] text-[#282c34] hover:bg-[#d19a66] active:scale-95' // Earthy Gold/Orange
                    : 'bg-[#997343] hover:bg-[#85633e] active:scale-95')
          }`}
          title="导出为 PNG"
        >
          {isExporting ? '处理中...' : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span className="hidden sm:inline">导出</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};