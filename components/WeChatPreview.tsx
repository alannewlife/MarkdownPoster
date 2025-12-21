
import React, { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import { WeChatConfig, WeChatTheme, FontSize } from '../types';
import { getWeChatFontSize, getWeChatLineHeight } from '../utils/themeUtils';
import { StableImage } from './StableImage';

interface WeChatPreviewProps {
  markdown: string;
  config: WeChatConfig;
  imagePool: Record<string, string>;
  isDarkMode: boolean;
  visible: boolean;
}

// Map config theme strings to Prism themes
const getPrismTheme = (themeName: string) => {
    switch(themeName) {
        case 'vsDark': return themes.vsDark;
        case 'vsLight': return themes.vsLight;
        case 'dracula': return themes.dracula;
        case 'github': return themes.github;
        case 'nightOwl': return themes.nightOwl;
        case 'oceanicNext': return themes.oceanicNext;
        default: return themes.vsDark;
    }
};

// WeChat Theme Style Definitions
const getThemeStyles = (theme: WeChatTheme) => {
    switch(theme) {
        case WeChatTheme.Lovely:
            return {
                h1: 'border-b-2 border-pink-300 text-pink-500',
                h2: 'border-l-4 border-pink-400 pl-3 text-pink-600 bg-pink-50 py-1 rounded-r',
                h3: 'text-pink-500 before:content-["♥"] before:mr-2 before:text-pink-300',
                list: 'text-pink-500',
                blockquote: 'border-l-4 border-pink-300 bg-pink-50 text-gray-600',
                link: 'text-pink-500 border-b border-pink-300',
                image: 'rounded-xl shadow-lg border-4 border-pink-100',
                hr: 'border-pink-200 border-dashed',
            };
        case WeChatTheme.Tech:
            return {
                h1: 'text-center border-b-2 border-blue-600 pb-2 text-blue-800',
                h2: 'bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1 rounded-sm shadow-md inline-block',
                h3: 'text-blue-700 border-l-4 border-blue-600 pl-2',
                list: 'text-blue-600',
                blockquote: 'bg-slate-800 text-slate-300 border-l-4 border-blue-500 rounded',
                link: 'text-blue-600 font-bold',
                image: 'rounded shadow-2xl border border-gray-200',
                hr: 'border-blue-200',
            };
        case WeChatTheme.Simple:
            return {
                h1: 'text-center text-gray-800 font-black tracking-widest border-b-2 border-black pb-4',
                h2: 'text-center text-gray-900 border-y border-gray-200 py-2 font-bold',
                h3: 'font-bold text-gray-800',
                list: 'text-black',
                blockquote: 'border-l-2 border-black pl-4 italic text-gray-600 font-serif',
                link: 'text-gray-800 underline decoration-1 underline-offset-4',
                image: 'grayscale hover:grayscale-0 transition-all duration-500',
                hr: 'border-gray-900',
            };
        case WeChatTheme.Default:
        default:
            return {
                h1: 'border-b pb-2 border-gray-200',
                h2: 'border-l-4 border-[#07c160] pl-3 text-[#07c160]',
                h3: 'text-[#07c160] font-bold',
                list: 'text-[#07c160]',
                blockquote: 'border-l-4 border-gray-300 bg-gray-50 text-gray-500 rounded-r',
                link: 'text-[#576b95]',
                image: 'rounded-lg',
                hr: 'border-gray-200',
            };
    }
};

export const WeChatPreview = forwardRef<HTMLDivElement, WeChatPreviewProps>(({
  markdown,
  config,
  imagePool,
  isDarkMode,
  visible
}, ref) => {
  
  const themeStyle = getThemeStyles(config.theme || WeChatTheme.Default);

  // Determine actual font size in pixels using centralized helper
  const baseFontSize = useMemo(() => {
      return getWeChatFontSize(config.fontSize);
  }, [config.fontSize]);

  // Determine line height value using centralized helper
  const lineHeightValue = useMemo(() => {
      return getWeChatLineHeight(config.lineHeight);
  }, [config.lineHeight]);
  
  // Font sizes for Headings (scaled)
  const headingSizes = useMemo(() => {
      // Scale factors: H1: 1.6x, H2: 1.4x, H3: 1.2x
      const base = parseInt(baseFontSize.replace('px', ''), 10);
      return {
          h1: `${Math.round(base * 1.6)}px`,
          h2: `${Math.round(base * 1.4)}px`,
          h3: `${Math.round(base * 1.2)}px`,
      }
  }, [baseFontSize]);

  // Common Typography Style Object
  const commonTextStyle = {
      fontSize: baseFontSize,
      lineHeight: lineHeightValue,
      letterSpacing: '0.05em'
  };

  // 1. Process Markdown for Footnotes & Header Info
  const { processedMarkdown, footnotes, headerInfo } = useMemo(() => {
     let text = markdown;
     let extractedTitle = "";
     
     // Extract Title (First H1)
     const titleMatch = text.match(/^#\s+(.*$)/m);
     if (titleMatch) {
         extractedTitle = titleMatch[1];
         // Remove Title (H1) from the body text so it doesn't appear twice
         text = text.replace(/^#\s+(.*$)\n?/m, '');
     } else {
         extractedTitle = "无标题";
     }

     // Process Links to Footnotes if enabled
     const links: string[] = [];
     if (config.linkReferences) {
        let linkCounter = 0;
        const linkRegex = /([^!]|^)\[([^\]]+)\]\(([^)]+)\)/g;
        
        text = text.replace(linkRegex, (match, prefix, linkText, url) => {
            if (url.startsWith('#')) return match; 
            linkCounter++;
            links.push(`${linkText}: ${url}`);
            // Use inline code syntax `[n]` which we will intercept in the custom code renderer
            // to render as a superscript. This avoids needing rehype-raw for HTML tags.
            return `${prefix}[${linkText}](${url})\`[${linkCounter}]\``;
        });
     }

     return { 
         processedMarkdown: text, 
         footnotes: links,
         headerInfo: {
             title: extractedTitle,
             date: new Date().toLocaleDateString('zh-CN'),
             author: "人人智学社",
             account: "人人智学社"
         }
     };
  }, [markdown, config.linkReferences]);

  // 2. Custom Renderers
  const components = useMemo(() => ({
      // Handle Blocks: 'pre' is only used for code blocks in Markdown
      pre: ({ children }: any) => {
          // Extract data from the child 'code' element
          const codeElement = children as React.ReactElement<any>;
          // Safety: ensure it is a React Element
          if (!React.isValidElement(codeElement)) return <pre>{children}</pre>;

          const props = codeElement.props as { className?: string; children?: React.ReactNode };
          const className = props?.className || '';
          const codeContent = String(props?.children || '').replace(/\n$/, '');
          const match = /language-(\w+)/.exec(className);

          return (
             <div className="my-4 rounded-lg overflow-hidden shadow-sm text-sm bg-opacity-50" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                {config.macCodeBlock && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#f6f6f6] border-b border-[#e5e5e5]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                    </div>
                )}
                <Highlight
                    theme={getPrismTheme(config.codeTheme)}
                    code={codeContent}
                    language={match ? match[1] : 'text'}
                >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={`${className} p-4 overflow-x-auto`} style={{ ...style, margin: 0, fontFamily: '"JetBrains Mono", Consolas, monospace' }}>
                        {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })} className="table-row">
                            {config.lineNumbers && (
                                <span className="table-cell select-none opacity-30 text-right pr-4 w-8">{i + 1}</span>
                            )}
                            <span className="table-cell">
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </span>
                        </div>
                        ))}
                    </pre>
                    )}
                </Highlight>
             </div>
          );
      },

      // Handle Inline: 'code' is triggered for both
      code({ node, className, children, ...props }: any) {
        const content = String(children || '');
        // Intercept our special footnote markers `[1]` and render as superscript
        if (/^\[\d+\]$/.test(content)) {
            return (
                <sup className="text-[0.65rem] text-gray-400 font-normal ml-0.5 select-none" style={{ verticalAlign: 'super' }}>
                    {children}
                </sup>
            );
        }

        return (
            <code 
              className="mx-1 px-1.5 py-0.5 rounded-md font-semibold font-mono text-[0.9em] break-words" 
              style={{ 
                  backgroundColor: 'rgba(135, 131, 120, 0.15)',
                  color: 'inherit',
              }}
              {...props}
            >
                {children}
            </code>
        );
      },

      img: ({ node, ...props }: any) => {
          let caption = "";
          // Determine caption based on configuration
          if (config.captionType === 'title' && props.title) {
              caption = props.title;
          } else if (config.captionType === 'alt' && props.alt) {
              caption = props.alt;
          }
          
          return (
              <span className="block my-6 text-center group">
                  <span className={`block mx-auto max-w-full overflow-hidden ${themeStyle.image}`}>
                    <StableImage {...props} imagePool={imagePool} className="max-w-full h-auto mx-auto block" />
                  </span>
                  {caption && (
                      <span className="block mt-2 text-[14px] text-[#888] font-normal tracking-wide leading-normal">
                          {caption}
                      </span>
                  )}
              </span>
          );
      },
      p: ({node, children}: any) => {
          return (
              <p 
                 className={`mb-4 text-[#3f3f3f] ${config.justify ? 'text-justify' : ''} ${config.indent ? 'indent-[2em]' : ''}`} 
                 style={{ 
                     ...commonTextStyle,
                     margin: '0 0 1.5em 0', // 20px spacing between paragraphs
                 }}
              >
                  {children}
              </p>
          );
      },
      h1: ({node, children}: any) => <h1 style={{fontSize: headingSizes.h1, lineHeight: lineHeightValue}} className={`font-bold mt-8 mb-6 ${themeStyle.h1}`}>{children}</h1>,
      h2: ({node, children}: any) => <h2 style={{fontSize: headingSizes.h2, lineHeight: lineHeightValue}} className={`font-bold mt-8 mb-6 flex items-center ${themeStyle.h2}`}>{children}</h2>,
      h3: ({node, children}: any) => <h3 style={{fontSize: headingSizes.h3, lineHeight: lineHeightValue}} className={`font-bold mt-6 mb-4 ${themeStyle.h3}`}>{children}</h3>,
      blockquote: ({node, children}: any) => (
          <blockquote className={`pl-4 py-2 my-4 ${themeStyle.blockquote}`} style={commonTextStyle}>
              {children}
          </blockquote>
      ),
      ul: ({node, children}: any) => <ul className="list-disc pl-5 mb-4 space-y-1 marker:text-gray-300">{children}</ul>,
      ol: ({node, children}: any) => <ol className="list-decimal pl-5 mb-4 space-y-1 marker:text-gray-400">{children}</ol>,
      li: ({node, children}: any) => (
         <li 
            className="text-[#3f3f3f]"
            style={commonTextStyle}
         >
            {children}
         </li>
      ),
      a: ({node, children, href}: any) => <a href={href} className={`${themeStyle.link} break-all hover:opacity-80 transition-opacity`}>{children}</a>,
      hr: ({node}: any) => <hr className={`my-8 border-t-2 ${themeStyle.hr}`} />,
      
      // Table Support
      table: ({node, children}: any) => (
         <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-200" style={{fontSize: baseFontSize, lineHeight: lineHeightValue}}>
              {children}
            </table>
         </div>
      ),
      thead: ({node, children}: any) => <thead className="bg-gray-50">{children}</thead>,
      tbody: ({node, children}: any) => <tbody>{children}</tbody>,
      tr: ({node, children}: any) => <tr className="border-b border-gray-200 last:border-0">{children}</tr>,
      th: ({node, children}: any) => (
          <th className="px-4 py-2 text-left font-bold text-gray-700 border-r border-gray-200 last:border-0 whitespace-nowrap">
            {children}
          </th>
      ),
      td: ({node, children}: any) => (
          <td className="px-4 py-2 text-gray-600 border-r border-gray-200 last:border-0 align-top">
             {children}
          </td>
      )
  }), [config, themeStyle, imagePool, baseFontSize, lineHeightValue, headingSizes, commonTextStyle]);

  return (
    <div className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${visible ? 'z-10 visible' : 'z-0 invisible'} transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100'}`}>
        <div className={`w-full min-h-full flex justify-center py-8 origin-center transition-all duration-300 ease-out delay-75 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
            
            {/* Simulation Phone Frame - Subtle & Aesthetic */}
            <div className={`relative flex flex-col items-center rounded-[3rem] p-3 shadow-2xl border transition-colors duration-500
                 ${isDarkMode 
                    ? 'bg-[#2c313a] border-[#3e4451] shadow-black/50' 
                    : 'bg-white border-gray-200 shadow-xl'
                 }
            `}> 
                {/* Screen Wrapper with Border (Glass edge simulation) */}
                <div className={`relative overflow-hidden rounded-[2.5rem] border-[4px] ${isDarkMode ? 'border-[#1a1d23]' : 'border-gray-50'}`}>
                    
                    {/* Notch Hint - Very subtle */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                         <div className={`w-36 h-6 rounded-b-2xl shadow-sm ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100'}`}></div>
                    </div>

                    {/* Simulation Phone Content Container */}
                    <div 
                        className="w-[375px] md:w-[414px] bg-white min-h-[800px] relative flex flex-col"
                        ref={ref}
                    >   
                        {/* WeChat Header */}
                        <div className="px-5 pt-12 pb-2">
                            <h1 className="text-[22px] font-bold leading-[1.4] text-[#333] mb-3 tracking-wide">
                                {headerInfo.title}
                            </h1>
                            <div className="flex items-center text-[14px] text-[rgba(0,0,0,0.4)] mb-6">
                                <span className="mr-2.5">原创</span>
                                <span className="mr-2.5 text-[#576b95] font-medium tracking-wide">{headerInfo.author}</span>
                                <span className="mr-2.5 text-[#576b95] tracking-wide">{headerInfo.account}</span>
                                <span>{headerInfo.date}</span>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 px-4 pb-12 wechat-content">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={components}
                            >
                                {processedMarkdown}
                            </ReactMarkdown>

                            {/* Footnotes Section */}
                            {config.linkReferences && footnotes.length > 0 && (
                                <div className="mt-12 pt-6 border-t border-dashed border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">引用链接</h4>
                                    <div className="space-y-2 text-xs text-gray-500">
                                        {footnotes.map((fn, idx) => (
                                            <div key={idx} className="break-all flex gap-1">
                                                <span className="shrink-0 inline-block text-center w-5 opacity-60">[{idx + 1}]</span>
                                                <span>{fn}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WeChat Footer (Fixed look) */}
                        <div className="px-4 py-6 text-sm text-[rgba(0,0,0,0.4)] flex items-center justify-between border-t border-gray-100 mt-auto bg-white">
                            <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 hover:text-[#576b95] cursor-pointer transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                <span>3</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-[#576b95] cursor-pointer transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                                <span>8</span>
                            </div>
                            <span className="hover:text-[#576b95] cursor-pointer transition-colors">推荐</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

WeChatPreview.displayName = 'WeChatPreview';
