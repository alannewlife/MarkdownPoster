
import React, { useState, useRef, useEffect } from 'react';
import { BorderTheme, FontSize, ViewMode, LayoutTheme, PaddingSize, WatermarkAlign } from '../types';
import { AppearancePopover } from './AppearancePopover';

interface PreviewControlBarProps {
  currentTheme: BorderTheme;
  setTheme: (theme: BorderTheme) => void;
  
  // New Layout Props
  layoutTheme: LayoutTheme;
  setLayoutTheme: (theme: LayoutTheme) => void;
  padding: PaddingSize;
  setPadding: (val: PaddingSize) => void;
  watermarkAlign: WatermarkAlign;
  setWatermarkAlign: (align: WatermarkAlign) => void;

  onExport: () => void;
  onCopyImage: () => void;
  onSaveMarkdown: () => void;
  onExportZip: () => void;
  isExportingZip: boolean;

  isExporting: boolean;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode?: boolean;
  
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const PreviewControlBar: React.FC<PreviewControlBarProps> = ({ 
  currentTheme, 
  setTheme, 
  layoutTheme,
  setLayoutTheme,
  padding,
  setPadding,
  watermarkAlign,
  setWatermarkAlign,
  onExport,
  onCopyImage,
  onSaveMarkdown,
  onExportZip,
  isExportingZip,
  isExporting,
  showWatermark,
  setShowWatermark,
  watermarkText,
  setWatermarkText,
  fontSize,
  setFontSize,
  isDarkMode = false,
  viewMode,
  setViewMode
}) => {
  const [showAppearance, setShowAppearance] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowAppearance(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`h-12 border-b relative z-40 shrink-0 transition-colors duration-500 
      ${isDarkMode 
        ? 'bg-[#1e2227] border-[#181a1f] text-[#abb2bf]' // Dark Mode
        : 'border-gray-200 bg-gray-50/90 backdrop-blur-sm text-gray-700'
      }`}>
      
      {/* Left: Appearance Controls (Poster Mode Only) */}
      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center">
        {viewMode === ViewMode.Poster && (
            <div className="relative" ref={popoverRef}>
                <button
                    onClick={() => setShowAppearance(!showAppearance)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        showAppearance 
                           ? (isDarkMode ? 'bg-[#2c313a] border-[#e5c07b] text-[#e5c07b]' : 'bg-white border-orange-400 text-orange-600')
                           : (isDarkMode ? 'bg-[#282c34] border-[#3e4451] text-[#abb2bf] hover:bg-[#2c313a]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    <span>自定义外观</span>
                </button>

                {showAppearance && (
                    <AppearancePopover
                        currentTheme={currentTheme}
                        setTheme={setTheme}
                        layoutTheme={layoutTheme}
                        setLayoutTheme={setLayoutTheme}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        padding={padding}
                        setPadding={setPadding}
                        showWatermark={showWatermark}
                        setShowWatermark={setShowWatermark}
                        watermarkText={watermarkText}
                        setWatermarkText={setWatermarkText}
                        watermarkAlign={watermarkAlign}
                        setWatermarkAlign={setWatermarkAlign}
                        isDarkMode={isDarkMode}
                        onClose={() => setShowAppearance(false)}
                    />
                )}
            </div>
        )}
      </div>

      {/* Center: View Mode Switcher */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
         <div className={`flex p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#282c34] border-[#3e4451]' : 'bg-gray-200/50 border-gray-200'}`}>
            <button
               onClick={() => setViewMode(ViewMode.Poster)}
               className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                  viewMode === ViewMode.Poster
                   ? (isDarkMode ? 'bg-[#3e4451] text-[#d4cfbf] shadow-sm' : 'bg-white text-gray-800 shadow-sm')
                   : (isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-gray-400 hover:text-gray-600')
               }`}
            >
               海报
            </button>
            <button
               onClick={() => setViewMode(ViewMode.Writing)}
               className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                  viewMode === ViewMode.Writing
                   ? (isDarkMode ? 'bg-[#3e4451] text-[#d4cfbf] shadow-sm' : 'bg-white text-gray-800 shadow-sm')
                   : (isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-gray-400 hover:text-gray-600')
               }`}
            >
               阅读
            </button>
         </div>
      </div>

      {/* Right: Action Button */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 sm:gap-3 group">
        
        {viewMode === ViewMode.Poster ? (
            // --- POSTER MODE: EXPORT IMAGE ---
            <>
                <button
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${
                    isExporting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : (isDarkMode 
                            ? 'bg-[#e5c07b] text-[#282c34] hover:bg-[#d19a66] active:scale-95' 
                            : 'bg-[#997343] hover:bg-[#85633e] active:scale-95')
                }`}
                disabled={isExporting}
                >
                {isExporting ? (
                    <span className="px-2">处理中...</span>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>导出</span>
                        <svg className="w-3 h-3 ml-0.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </>
                )}
                </button>

                {!isExporting && (
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px] transform origin-top-right scale-95 group-hover:scale-100">
                        <div className={`rounded-lg shadow-xl border overflow-hidden backdrop-blur-sm ring-1 ring-black/5 ${
                        isDarkMode 
                            ? 'bg-[#1e2227]/95 border-[#3e4451]' 
                            : 'bg-white/95 border-gray-100'
                        }`}>
                        
                        <button
                            onClick={onExport}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition-colors ${
                            isDarkMode 
                                ? 'text-[#abb2bf] hover:bg-[#2c313a] hover:text-[#e5c07b]' 
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#997343]'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            保存图片
                        </button>

                        <div className={`h-px w-full ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-100'}`}></div>

                        <button
                            onClick={onCopyImage}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition-colors ${
                            isDarkMode 
                                ? 'text-[#abb2bf] hover:bg-[#2c313a] hover:text-[#e5c07b]' 
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#997343]'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            复制剪贴板
                        </button>

                        </div>
                    </div>
                )}
            </>
        ) : (
            // --- WRITING MODE: SAVE/EXPORT SOURCE ---
            <>
                <button
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold text-white transition-all shadow-sm ${
                    isExportingZip
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : (isDarkMode 
                            ? 'bg-[#e5c07b] text-[#282c34] hover:bg-[#d19a66] active:scale-95' 
                            : 'bg-[#997343] hover:bg-[#85633e] active:scale-95')
                }`}
                disabled={isExportingZip}
                >
                {isExportingZip ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>打包中...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        <span>保存</span>
                        <svg className="w-3 h-3 ml-0.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </>
                )}
                </button>

                {!isExportingZip && (
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[160px] transform origin-top-right scale-95 group-hover:scale-100">
                        <div className={`rounded-lg shadow-xl border overflow-hidden backdrop-blur-sm ring-1 ring-black/5 ${
                        isDarkMode 
                            ? 'bg-[#1e2227]/95 border-[#3e4451]' 
                            : 'bg-white/95 border-gray-100'
                        }`}>
                        
                        <button
                            onClick={onSaveMarkdown}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition-colors ${
                            isDarkMode 
                                ? 'text-[#abb2bf] hover:bg-[#2c313a] hover:text-[#e5c07b]' 
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#997343]'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <div>
                                <div className="font-bold">仅源码 (.md)</div>
                                <div className="text-[10px] opacity-60 font-normal">轻量，不含图片</div>
                            </div>
                        </button>

                        <div className={`h-px w-full ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-100'}`}></div>

                        <button
                            onClick={onExportZip}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition-colors ${
                            isDarkMode 
                                ? 'text-[#abb2bf] hover:bg-[#2c313a] hover:text-[#e5c07b]' 
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#997343]'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            <div>
                                <div className="font-bold">导出工程 (.zip)</div>
                                <div className="text-[10px] opacity-60 font-normal">包含本地与网络图片</div>
                            </div>
                        </button>

                        </div>
                    </div>
                )}
            </>
        )}

      </div>
    </div>
  );
};
    