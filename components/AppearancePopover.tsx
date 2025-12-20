
import React from 'react';
import { BorderTheme, FontSize, LayoutTheme, PaddingSize, WatermarkAlign } from '../types';

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
}

// Map themes to visual representations (colors/gradients)
const ThemePreviews: Record<BorderTheme, string> = {
  [BorderTheme.Minimal]: 'bg-white border border-gray-200',
  [BorderTheme.MacOS]: 'bg-gray-100 border border-gray-300',
  [BorderTheme.Neon]: 'bg-gray-900 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]',
  [BorderTheme.Sketch]: 'bg-[#f5f5f4] border-2 border-gray-800',
  [BorderTheme.Retro]: 'bg-[#fdf6e3] border-double border-4 border-[#b58900]',
  [BorderTheme.Glass]: 'bg-gradient-to-br from-indigo-100 to-purple-100 border border-white',
  [BorderTheme.Sunset]: 'bg-gradient-to-br from-orange-100 to-rose-100',
  [BorderTheme.Ocean]: 'bg-cyan-950 border border-cyan-500',
  [BorderTheme.Candy]: 'bg-pink-50 border-2 border-pink-400',
  [BorderTheme.Poster]: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
};

const ThemeNames: Record<BorderTheme, string> = {
  [BorderTheme.Minimal]: 'Minimal',
  [BorderTheme.MacOS]: 'macOS',
  [BorderTheme.Neon]: 'Neon',
  [BorderTheme.Sketch]: 'Sketch',
  [BorderTheme.Retro]: 'Retro',
  [BorderTheme.Glass]: 'Glass',
  [BorderTheme.Sunset]: 'Sunset',
  [BorderTheme.Ocean]: 'Ocean',
  [BorderTheme.Candy]: 'Candy',
  [BorderTheme.Poster]: 'Poster'
};

const LayoutThemeLabels: Record<LayoutTheme, string> = {
  [LayoutTheme.Base]: '标准',
  [LayoutTheme.Classic]: '经典',
  [LayoutTheme.Vibrant]: '活泼'
};

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
  onClose
}) => {
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

      <p className="text-[10px] opacity-60 mb-4 leading-relaxed">
        自定义当前海报的背景、主题、字体大小和署名位置。
      </p>

      {/* 1. Background Grid */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">背景</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.values(BorderTheme).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              title={ThemeNames[t]}
              className={`w-full aspect-square rounded-lg transition-all relative group
                ${ThemePreviews[t]}
                ${currentTheme === t 
                  ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 z-10' 
                  : 'hover:scale-110 hover:shadow-md'
                }
                ${isDarkMode ? 'ring-offset-[#21252b]' : 'ring-offset-white'}
              `}
            >
               {currentTheme === t && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                 </div>
               )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Layout Theme (Segmented Control) */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">排版主题</label>
        <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
          {Object.values(LayoutTheme).map((lt) => (
            <button
              key={lt}
              onClick={() => setLayoutTheme(lt)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                layoutTheme === lt
                  ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {LayoutThemeLabels[lt]}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Font Size & Padding */}
      <div className="mb-6 space-y-4">
        {/* Font Size Row */}
        <div className="flex items-center justify-between">
           <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">文字大小</label>
           <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {[
                { label: 'S', value: FontSize.Small, icon: 'text-xs' },
                { label: 'M', value: FontSize.Medium, icon: 'text-sm' },
                { label: 'L', value: FontSize.Large, icon: 'text-lg' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${
                    fontSize === option.value 
                      ? (isDarkMode ? 'bg-[#3e4451] shadow-sm text-white' : 'bg-white shadow-sm text-gray-900')
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className={option.icon}>T</span>
                </button>
              ))}
           </div>
        </div>

        {/* Padding Row */}
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">边距</label>
            <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {[
                { label: '窄', value: PaddingSize.Narrow },
                { label: '中', value: PaddingSize.Medium },
                { label: '宽', value: PaddingSize.Wide },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPadding(opt.value)}
                  className={`flex-1 h-7 flex items-center justify-center text-xs font-medium rounded transition-all ${
                    padding === opt.value
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
                placeholder="人人智学社 rrzxs.com"
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
    