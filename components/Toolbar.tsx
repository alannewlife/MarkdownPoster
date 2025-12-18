import React from 'react';

export const Toolbar: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 px-6 bg-white/90 backdrop-blur-md border-b border-gray-200 gap-4 shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <div className="flex items-center gap-3 select-none">
          <img 
            alt="RenRen AI Club" 
            className="h-10 w-auto object-contain drop-shadow-sm" 
            src="https://s2.loli.net/2025/12/16/cxVD2oCAQJ45EMl.png" 
          />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
            <span className="text-xl font-bold text-gray-900 tracking-tight font-sans">
              MarkdownPoster
            </span>
            <div className="relative hidden sm:block">
              {/* 'almost' positioned absolute to the top-left of the subtitle */}
              <span className="absolute -top-3 -left-3 text-[10px] text-gray-400 -rotate-12 font-serif italic font-medium tracking-wide">
                almost
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wide">
                最有品位的Md海报生成器
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};