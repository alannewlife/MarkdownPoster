
import React, { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { BorderTheme, LayoutTheme, FontSize, PaddingSize, WatermarkAlign } from '../types';
import { getThemeStyles, getFontSizeClass, getLayoutClass, getFramePaddingClass } from '../utils/themeUtils';
import { StableImage } from './StableImage';
import { remarkRuby } from '../utils/markdownPlugins';
import { RubyRender } from './RubyRender';
import { HEADER_PRESETS } from '../config/headerPresets'; 
import { DECOR_PRESETS } from '../config/decorPresets'; // Import new Decor Presets

interface PosterPreviewProps {
  markdown: string;
  theme: BorderTheme;
  layoutTheme: LayoutTheme;
  fontSize: FontSize;
  padding: PaddingSize;
  showWatermark: boolean;
  watermarkText: string;
  watermarkAlign: WatermarkAlign;
  imagePool: Record<string, string>;
  isDarkMode: boolean;
  visible: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  customThemeColor?: string;
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(({
  markdown,
  theme,
  layoutTheme,
  fontSize,
  padding,
  showWatermark,
  watermarkText,
  watermarkAlign,
  imagePool,
  isDarkMode,
  visible,
  containerRef,
  onScroll,
  customThemeColor
}, ref) => {
  const currentStyle = useMemo(() => getThemeStyles(theme, customThemeColor), [theme, customThemeColor]);

  return (
    <div 
        ref={containerRef}
        onScroll={onScroll}
        className={`absolute inset-0 overflow-y-auto flex flex-col items-center [background-size:20px_20px] ${
            visible ? 'z-10 visible' : 'z-0 invisible'
         } ${
            isDarkMode 
              ? 'bg-[radial-gradient(#333842_1px,transparent_1px)]' 
              : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]'
        }`}
    >
       <div className={`w-full flex flex-col items-center min-h-min pt-10 pb-24 px-8 origin-center transition-all duration-300 ease-out delay-75 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
       }`}>
          <div 
            ref={ref}
            className={`w-full md:w-[75%] max-w-none flex flex-col ${getFramePaddingClass(padding)} ${currentStyle.frame}`}
            style={currentStyle.frameStyle}
          >
            
            <div 
                className={`w-full relative ${currentStyle.card}`} 
                style={currentStyle.cardStyle} 
            > 
              {/* Added 'relative' to ensure decorations position correctly relative to the card */}
              
              {/* 1. Custom Decorations (Corners, Frames) */}
              {currentStyle.customDecor && DECOR_PRESETS[currentStyle.customDecor] && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                      {DECOR_PRESETS[currentStyle.customDecor]}
                  </div>
              )}
              
              {/* 2. Custom Header */}
              {currentStyle.header && (
                  <div className={currentStyle.header}>
                      {currentStyle.customHeader && HEADER_PRESETS[currentStyle.customHeader]}
                  </div>
              )}
              
              {/* 3. Main Content */}
              <div 
                  className={`p-10 prose max-w-none ${currentStyle.prose} ${currentStyle.content} ${getFontSizeClass(fontSize)} ${getLayoutClass(layoutTheme)} min-h-[500px] [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!overflow-hidden [&_pre]:!max-h-none [&>:last-child]:mb-0`}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath, remarkRuby]}
                  rehypePlugins={[rehypeKatex]}
                  urlTransform={(value) => value}
                  components={{
                    img: (props) => <StableImage {...props} imagePool={imagePool} />,
                    a: ({ node, href, children, ...props }) => {
                        if (href && href.startsWith('ruby:')) {
                            const reading = href.replace('ruby:', '');
                            const decodedReading = decodeURIComponent(reading);
                            return <RubyRender baseText={children} reading={decodedReading} {...props} />;
                        }
                        return <a href={href} {...props}>{children}</a>;
                    }
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>

            {showWatermark && (
              <div className={`mt-6 opacity-60 text-[10px] tracking-widest font-bold ${currentStyle.watermarkColor} ${watermarkAlign}`}>
                {watermarkText || "输入您的署名"}
              </div>
            )}

          </div>
      </div>
    </div>
  );
});

PosterPreview.displayName = 'PosterPreview';
