
import React from 'react';

/**
 * 边框装饰预设字典 (Decor Presets)
 * 
 * 用于在 Card 的四个角落添加复杂的装饰元素。
 * 通过 CSS 绝对定位覆盖在 Card 边缘。
 */
export const DECOR_PRESETS: Record<string, React.ReactNode> = {
  
  // ---------------------------------------------------------------------------
  // [Ink Corners] 水墨/中式转角方框
  // 效果：精致的小方框(8px)，中心对准边框顶点，模拟榫卯结构
  // ---------------------------------------------------------------------------
  'ink-corners': (
    <>
       {/* 
         Logic:
         Square size: w-2 (8px).
         Position: -top-1 (-4px), -left-1 (-4px).
         Result: The 8px square is centered exactly on the 0,0 corner of the card.
         Bg color matches card to mask the underlying border corner.
       */}
       <div className="absolute -top-1 -left-1 w-2 h-2 border-[1.5px] border-[#57534e] bg-[#fdfbf7] z-10" />
       <div className="absolute -top-1 -right-1 w-2 h-2 border-[1.5px] border-[#57534e] bg-[#fdfbf7] z-10" />
       <div className="absolute -bottom-1 -left-1 w-2 h-2 border-[1.5px] border-[#57534e] bg-[#fdfbf7] z-10" />
       <div className="absolute -bottom-1 -right-1 w-2 h-2 border-[1.5px] border-[#57534e] bg-[#fdfbf7] z-10" />
    </>
  ),

  // ---------------------------------------------------------------------------
  // [Baroque Corners] -> [Simple Western] 简约西式
  // 效果：经典的双线转角 (Classic Double Bracket)
  // 风格：简约、西式、优雅 (Simple, Western, Elegant)
  // ---------------------------------------------------------------------------
  'baroque-corners': (
    <>
        {/* Top Left */}
        {/* Color: SaddleBrown / Dark Bronze */}
        <div className="absolute top-3 left-3 w-12 h-12 pointer-events-none text-[#78350f] opacity-80 z-10">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full drop-shadow-sm">
                {/* Outer Bracket (Thicker) */}
                <path d="M 0 48 L 0 0 L 48 0" strokeWidth="2.5" strokeLinecap="square" />
                {/* Inner Bracket (Thinner) */}
                <path d="M 6 48 L 6 6 L 48 6" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
                {/* Corner Accent (Optional tiny square for sharpness) */}
                <rect x="0" y="0" width="2" height="2" fill="currentColor" stroke="none" />
            </svg>
        </div>

        {/* Top Right (Rotate 90) */}
        <div className="absolute top-3 right-3 w-12 h-12 pointer-events-none text-[#78350f] opacity-80 rotate-90 z-10">
             <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full drop-shadow-sm">
                <path d="M 0 48 L 0 0 L 48 0" strokeWidth="2.5" strokeLinecap="square" />
                <path d="M 6 48 L 6 6 L 48 6" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
                <rect x="0" y="0" width="2" height="2" fill="currentColor" stroke="none" />
            </svg>
        </div>

        {/* Bottom Right (Rotate 180) */}
        <div className="absolute bottom-3 right-3 w-12 h-12 pointer-events-none text-[#78350f] opacity-80 rotate-180 z-10">
             <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full drop-shadow-sm">
                <path d="M 0 48 L 0 0 L 48 0" strokeWidth="2.5" strokeLinecap="square" />
                <path d="M 6 48 L 6 6 L 48 6" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
                <rect x="0" y="0" width="2" height="2" fill="currentColor" stroke="none" />
            </svg>
        </div>

        {/* Bottom Left (Rotate 270) */}
        <div className="absolute bottom-3 left-3 w-12 h-12 pointer-events-none text-[#78350f] opacity-80 -rotate-90 z-10">
             <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full drop-shadow-sm">
                <path d="M 0 48 L 0 0 L 48 0" strokeWidth="2.5" strokeLinecap="square" />
                <path d="M 6 48 L 6 6 L 48 6" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
                <rect x="0" y="0" width="2" height="2" fill="currentColor" stroke="none" />
            </svg>
        </div>
    </>
  )
};
