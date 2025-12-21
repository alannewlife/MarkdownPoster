
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
  visible
}, ref) => {
  const currentStyle = useMemo(() => getThemeStyles(theme), [theme]);

  return (
    <div className={`absolute inset-0 overflow-y-auto flex flex-col items-center [background-size:20px_20px] ${
        visible ? 'z-10 visible' : 'z-0 invisible'
     } ${
        isDarkMode 
          ? 'bg-[radial-gradient(#333842_1px,transparent_1px)]' 
          : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]'
    }`}>
       <div className={`w-full flex flex-col items-center min-h-min pt-10 pb-24 px-8 origin-center transition-all duration-300 ease-out delay-75 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
       }`}>
          <div 
            ref={ref}
            className={`w-full md:w-[75%] max-w-none flex flex-col ${getFramePaddingClass(padding)} ${currentStyle.frame}`}
          >
            
            <div className={`w-full ${currentStyle.card}`}>
              {theme === BorderTheme.MacOS && (
                <div className={currentStyle.header}>
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                </div>
              )}

              {theme === BorderTheme.Sunset && (
                <div className={currentStyle.header}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                    </div>
                </div>
              )}

              {theme === BorderTheme.Candy && (
                <div className={currentStyle.header}>
                    <div className="w-4 h-4 rounded-full bg-pink-400 border-2 border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-white"></div>
                </div>
              )}

              {theme === BorderTheme.Ocean && (
                <div className={currentStyle.header}></div>
              )}
              
              <div 
                  className={`p-10 prose max-w-none ${currentStyle.prose} ${currentStyle.content} ${getFontSizeClass(fontSize)} ${getLayoutClass(layoutTheme)} min-h-[500px] [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!overflow-hidden [&_pre]:!max-h-none [&>:last-child]:mb-0`}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath, remarkRuby]}
                  rehypePlugins={[rehypeKatex]}
                  urlTransform={(value) => value}
                  components={{
                    img: (props) => <StableImage {...props} imagePool={imagePool} />,
                    // Intercept Links to check for Ruby protocol
                    a: ({ node, href, children, ...props }) => {
                        if (href && href.startsWith('ruby:')) {
                            const reading = href.replace('ruby:', '');
                            // Decode URI component in case reading has special chars
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
                {watermarkText || "人人智学社 rrzxs.com"}
              </div>
            )}

          </div>
      </div>
    </div>
  );
});

PosterPreview.displayName = 'PosterPreview';
