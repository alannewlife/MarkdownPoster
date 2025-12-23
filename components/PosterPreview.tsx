import React, { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import { BorderTheme, LayoutTheme, FontSize, PaddingSize, WatermarkAlign } from '../types';
import { getThemeStyles, getFontSizeClass, getLayoutClass, getFramePaddingClass } from '../utils/themeUtils';
import { StableImage } from './StableImage';
import { remarkRuby, remarkCenter } from '../utils/markdownPlugins';
import { RubyRender } from './RubyRender';
import { HEADER_PRESETS } from '../config/headerPresets'; 
import { DECOR_PRESETS } from '../config/decorPresets'; 
import { ThemeRegistry } from '../utils/themeRegistry';

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
  
  const themeStyle = useMemo(() => getThemeStyles(theme, customThemeColor), [theme, customThemeColor]);
  
  const fontSizeClass = getFontSizeClass(fontSize);
  const layoutClass = getLayoutClass(layoutTheme);
  const paddingClass = getFramePaddingClass(padding);

  return (
    <div 
        ref={containerRef}
        onScroll={onScroll}
        className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${
            visible ? 'z-10 visible' : 'z-0 invisible'
        }`}
    >
       <div className={`w-full min-h-full flex justify-center items-start py-8 sm:py-16 origin-center transition-all duration-300 ease-out delay-75 ${
           visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
       }`}>
          {/* Main Poster Frame */}
          <div 
            ref={ref}
            id="poster-node"
            className={`
                relative flex flex-col transition-all duration-500 ease-in-out
                ${paddingClass}
                ${themeStyle.frame}
            `}
            style={{
                width: '100%',
                maxWidth: '640px',
                // Dynamic Frame Styles (Gradients, Images)
                ...themeStyle.frameStyle
            }}
          >
            {/* The Card (Inner Container) */}
            <div className={`
                relative flex flex-col z-10
                ${themeStyle.card}
            `}
            style={{
                // Dynamic Card Styles (Border colors, Shadows for Neon/Glass)
                ...themeStyle.cardStyle
            }}
            >
                {/* 1. Custom Header (If defined in theme) */}
                {themeStyle.customHeader && HEADER_PRESETS[themeStyle.customHeader] && (
                    <div className={themeStyle.header}>
                         {HEADER_PRESETS[themeStyle.customHeader]}
                    </div>
                )}
                
                {/* 1.1 Custom Decor (If defined in theme) */}
                {themeStyle.customDecor && DECOR_PRESETS[themeStyle.customDecor] && (
                     <>
                        {DECOR_PRESETS[themeStyle.customDecor]}
                     </>
                )}

                {/* 2. Content Area */}
                <div className={`
                    flex-1
                    px-8 py-8 sm:px-12 sm:py-10
                    ${themeStyle.content}
                    ${layoutClass}
                `}>
                    <div className={`prose max-w-none ${themeStyle.prose} ${fontSizeClass}`}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkRuby, remarkCenter]}
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
            </div>

            {/* 3. Watermark / Signature */}
            {showWatermark && (
                <div className={`mt-6 z-10 ${watermarkAlign} ${themeStyle.watermarkColor}`}>
                   <div className="text-sm font-medium opacity-80 font-sans tracking-wider">
                       {watermarkText}
                   </div>
                </div>
            )}
          </div>
       </div>
    </div>
  );
});

PosterPreview.displayName = 'PosterPreview';
