
import React, { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Highlight, themes } from 'prism-react-renderer';
import { WeChatConfig, LayoutTheme, FontSize } from '../types';
import { getWeChatFontSize, getWeChatLineHeight } from '../utils/themeUtils';
import { StableImage } from './StableImage';
import { remarkRuby } from '../utils/markdownPlugins';
import { RubyRender } from './RubyRender';

interface WeChatPreviewProps {
  markdown: string;
  config: WeChatConfig;
  imagePool: Record<string, string>;
  isDarkMode: boolean;
  visible: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
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

// --- HELPER: Color manipulation ---
const hexToRgba = (hex: string, alpha: number) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return hex; // Fallback
}

// --- INLINE STYLE DEFINITIONS ---
// Dynamically generate styles based on Layout and Color
const getDynamicStyles = (layout: LayoutTheme, primaryColor: string) => {
    const commonHeader = { fontWeight: 'bold', marginTop: '1.5em', marginBottom: '1em', lineHeight: '1.4' };
    const commonBlockquote = { 
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: '1em', 
        paddingBottom: '1em', 
        margin: '1.5em 0',
        fontSize: '0.95em',
        borderRadius: '4px'
    };

    // Derived Colors
    const faintBg = hexToRgba(primaryColor, 0.08); // Very light background
    const borderBg = hexToRgba(primaryColor, 0.2); // Light border

    switch(layout) {
        // --- VIBRANT LAYOUT ---
        case LayoutTheme.Vibrant:
            return {
                h1: { ...commonHeader, textAlign: 'center' as const, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '0.5em', color: primaryColor }, 
                // H2: Pill Shape with White Text
                h2: { ...commonHeader, background: primaryColor, color: 'white', padding: '0.2em 1em', borderRadius: '20px', display: 'inline-block', boxShadow: `0 2px 5px ${hexToRgba(primaryColor, 0.3)}` },
                h3: { ...commonHeader, color: primaryColor, borderLeft: `4px solid ${primaryColor}`, paddingLeft: '0.5em' },
                list: { color: primaryColor },
                // Blockquote: Full Colored Box
                blockquote: { ...commonBlockquote, backgroundColor: faintBg, color: '#334155', borderLeft: `4px solid ${primaryColor}` }, 
                link: { color: primaryColor, fontWeight: 'bold', textDecoration: 'none', borderBottom: `1px dashed ${primaryColor}` },
                hr: { border: '0', borderTop: `1px solid ${borderBg}`, margin: '2em 0' },
            };

        // --- CLASSIC LAYOUT ---
        case LayoutTheme.Classic:
            return {
                h1: { ...commonHeader, textAlign: 'center' as const, color: '#1f2937', letterSpacing: '0.05em', borderBottom: '1px solid #e5e5e5', paddingBottom: '1em' },
                // H2: Top/Bottom Border Lines
                h2: { ...commonHeader, textAlign: 'center' as const, color: primaryColor, borderTop: `1px solid ${primaryColor}`, borderBottom: `1px solid ${primaryColor}`, padding: '0.5em 0', display: 'block', width: '100%' },
                h3: { ...commonHeader, color: '#374151', fontWeight: 'bold' },
                list: { color: primaryColor },
                blockquote: { ...commonBlockquote, borderLeft: 'none', borderTop: `2px solid ${primaryColor}`, borderBottom: `2px solid ${primaryColor}`, fontStyle: 'italic', color: '#4b5563', backgroundColor: 'transparent', textAlign: 'center' as const },
                link: { color: primaryColor, textDecoration: 'underline', textUnderlineOffset: '4px' },
                hr: { border: '0', borderTop: '1px solid #111827', margin: '2em 0' },
            };

        // --- STANDARD / BASE LAYOUT ---
        case LayoutTheme.Base:
        default:
            return {
                h1: { ...commonHeader, borderBottom: '1px solid #e5e5e5', paddingBottom: '0.5em', color: '#111' },
                // H2: Left Thick Border
                h2: { ...commonHeader, borderLeft: `4px solid ${primaryColor}`, paddingLeft: '0.5em', color: primaryColor },
                h3: { ...commonHeader, color: '#333', fontWeight: 'bold' },
                list: { color: primaryColor },
                blockquote: { ...commonBlockquote, borderLeft: `4px solid ${hexToRgba(primaryColor, 0.4)}`, backgroundColor: '#f9fafb', color: '#6b7280' },
                link: { color: primaryColor, textDecoration: 'none' },
                hr: { border: '0', borderTop: '1px solid #e5e5e5', margin: '2em 0' },
            };
    }
};

export const WeChatPreview = forwardRef<HTMLDivElement, WeChatPreviewProps>(({
  markdown,
  config,
  imagePool,
  isDarkMode,
  visible,
  containerRef,
  onScroll
}, ref) => {
  
  const themeStyle = useMemo(() => getDynamicStyles(config.layout || LayoutTheme.Base, config.primaryColor || '#07c160'), [config.layout, config.primaryColor]);

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
      letterSpacing: '0.05em',
      color: '#333333',
      textAlign: (config.justify ? 'justify' : 'left') as any,
      maxWidth: '100%',
      boxSizing: 'border-box' as const,
      fontFamily: config.layout === LayoutTheme.Classic ? '"Songti SC", "Noto Serif SC", serif' : '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif'
  };

  // 1. Process Markdown for Footnotes & Header Info
  const { processedMarkdown, footnotes, headerInfo } = useMemo(() => {
     let text = markdown;
     let extractedTitle = "";
     
     // Extract Title (First H1)
     const titleMatch = text.match(/^#\s+(.*$)/m);
     if (titleMatch) {
         extractedTitle = titleMatch[1];
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
            // Avoid footnote processing for Ruby links
            if (url.startsWith('ruby:')) return match;

            linkCounter++;
            links.push(`${linkText}: ${url}`);
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
      // Custom Checkbox for Task Lists
      input: ({ type, checked }: any) => {
        if (type !== 'checkbox') return null;
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.2em',
                height: '1.2em',
                marginRight: '0.4em',
                transform: 'translateY(0.1em)',
                flexShrink: 0,
                verticalAlign: 'middle'
            }}>
                {checked ? (
                    <svg viewBox="0 0 24 24" fill="none" style={{width: '100%', height: '100%'}}>
                       <rect x="2" y="2" width="20" height="20" rx="4" fill={config.primaryColor} />
                       <path d="M7 12l3 3l7-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" style={{width: '100%', height: '100%'}}>
                       <rect x="2" y="2" width="20" height="20" rx="4" stroke="#d1d5db" strokeWidth="2" fill="transparent" />
                    </svg>
                )}
            </span>
        );
      },

      pre: ({ children }: any) => {
          const codeElement = children as React.ReactElement<any>;
          if (!React.isValidElement(codeElement)) return <pre>{children}</pre>;

          const props = codeElement.props as { className?: string; children?: React.ReactNode };
          const className = props?.className || '';
          const codeContent = String(props?.children || '').replace(/\n$/, '');
          const match = /language-(\w+)/.exec(className);
          const prismTheme = getPrismTheme(config.codeTheme);

          // Determine if theme is dark for header styling
          const isDarkTheme = ['vsDark', 'dracula', 'nightOwl', 'oceanicNext'].includes(config.codeTheme);
          
          // Get background from theme or fallback
          const themeBg = prismTheme.plain.backgroundColor || (isDarkTheme ? '#1e1e1e' : '#f6f8fa');
          const themeColor = prismTheme.plain.color || (isDarkTheme ? '#d4d4d4' : '#24292e');

          // Use <section> for WeChat compatibility (preserves styles better than div)
          return (
             <section style={{ 
                 margin: '1.5em 0', 
                 borderRadius: '8px', 
                 boxShadow: '0 0 0 1px rgba(0,0,0,0.03)', 
                 overflow: 'hidden', 
                 fontSize: '13px', 
                 lineHeight: '1.6',
                 backgroundColor: themeBg, // Applied Theme Background
                 color: themeColor,
                 maxWidth: '100%',
                 position: 'relative' // For positioning
             }}>
                {config.macCodeBlock && (
                    <section style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '12px 16px', 
                        // Adapt header background: translucent on dark, solid light gray on light
                        backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : '#e6e8eb', 
                        borderBottom: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #dce0e3'
                    }}>
                        <span style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56', display: 'inline-block'}}></span>
                        <span style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block'}}></span>
                        <span style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f', display: 'inline-block'}}></span>
                    </section>
                )}
                <div style={{
                    padding: '16px',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch'
                }}>
                    <Highlight
                        theme={prismTheme}
                        code={codeContent}
                        language={match ? match[1] : 'text'}
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className={className} style={{ 
                            ...style, 
                            margin: 0, 
                            padding: 0, 
                            fontFamily: '"Operator Mono", "JetBrains Mono", Consolas, Monaco, Menlo, monospace',
                            backgroundColor: 'transparent', // Important: Let wrapper handle BG
                            float: 'left', 
                            minWidth: '100%',
                        }}>
                            {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} style={{display: 'block', whiteSpace: 'pre'}}>
                                {config.lineNumbers && (
                                    <span style={{
                                        display: 'inline-block', 
                                        userSelect: 'none', 
                                        opacity: 0.4, 
                                        textAlign: 'right', 
                                        width: '2.5em', 
                                        paddingRight: '1em',
                                        marginRight: '0.5em',
                                        borderRight: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                                    }}>
                                        {i + 1}
                                    </span>
                                )}
                                <span style={{display: 'inline-block'}}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                            ))}
                        </pre>
                        )}
                    </Highlight>
                    <div style={{clear: 'both'}}></div>
                </div>
             </section>
          );
      },

      code({ node, className, children, ...props }: any) {
        const content = String(children || '');
        if (/^\[\d+\]$/.test(content)) {
            return (
                <sup style={{ fontSize: '0.7em', color: '#9ca3af', marginLeft: '2px', verticalAlign: 'super' }}>
                    {children}
                </sup>
            );
        }

        // Faint background based on primary color for inline code
        const inlineCodeBg = hexToRgba(config.primaryColor, 0.1);
        const inlineCodeColor = config.primaryColor;

        return (
            <code 
              style={{ 
                  margin: '0 4px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '0.9em',
                  fontWeight: '600',
                  backgroundColor: inlineCodeBg, // Dynamic BG
                  color: inlineCodeColor,         // Dynamic Color
                  ...props.style
              }}
              {...props}
            >
                {children}
            </code>
        );
      },

      img: ({ node, ...props }: any) => {
          let caption = "";
          if (config.captionType === 'title' && props.title) caption = props.title;
          else if (config.captionType === 'alt' && props.alt) caption = props.alt;
          
          return (
              <section style={{display: 'block', margin: '1.5em 0', textAlign: 'center'}}>
                  <span style={{display: 'block', maxWidth: '100%', overflow: 'hidden', borderRadius: '6px'}}>
                    {/* The StableImage component now handles data-id passing */}
                    <StableImage {...props} imagePool={imagePool} style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}} />
                  </span>
                  {caption && (
                      <span style={{display: 'block', marginTop: '0.6em', fontSize: '13px', color: '#888', lineHeight: '1.4'}}>
                          {caption}
                      </span>
                  )}
              </section>
          );
      },
      p: ({node, children, ...props}: any) => {
          return (
              <p 
                 style={{ 
                     ...commonTextStyle,
                     marginBottom: '1.5em',
                     textIndent: config.indent ? '2em' : '0',
                     minHeight: '1em', // Prevents empty P collapse
                     ...(props.style || {}) // Merge external styles (important for Blockquote last-child override)
                 }}
              >
                  {children}
              </p>
          );
      },
      h1: ({node, children}: any) => <h1 style={{...themeStyle.h1, fontSize: headingSizes.h1}}>{children}</h1>,
      h2: ({node, children}: any) => <h2 style={{...themeStyle.h2, fontSize: headingSizes.h2}}>{children}</h2>,
      h3: ({node, children}: any) => <h3 style={{...themeStyle.h3, fontSize: headingSizes.h3}}>{children}</h3>,
      blockquote: ({node, children}: any) => {
          // Flatten children to handle cases where react-markdown returns mixed arrays of text and elements
          const childrenArray = React.Children.toArray(children);
          
          // Find the index of the last valid React element (ignoring text nodes/whitespace)
          // This ensures we target the actual last paragraph or element
          let lastElementIndex = -1;
          for (let i = childrenArray.length - 1; i >= 0; i--) {
              if (React.isValidElement(childrenArray[i])) {
                  lastElementIndex = i;
                  break;
              }
          }

          return (
            <section style={{...themeStyle.blockquote, ...commonTextStyle}}>
                {childrenArray.map((child, index) => {
                        // Apply margin-bottom: 0 only to the last valid element
                        if (index === lastElementIndex && React.isValidElement(child)) {
                            const element = child as React.ReactElement<any>;
                            return React.cloneElement(element, {
                                style: {
                                    ...(element.props.style || {}),
                                    marginBottom: 0
                                }
                            });
                        }
                        return child;
                })}
            </section>
          );
      },
      ul: ({node, className, children}: any) => {
        // Detect task list (Gfm)
        const isTaskList = className?.includes('contains-task-list');
        return (
            <ul style={{
                paddingLeft: isTaskList ? '0' : '1.5em', 
                marginBottom: '1.5em', 
                listStyleType: isTaskList ? 'none' : 'disc', 
                color: (themeStyle.list as any).color
            }}>
                {children}
            </ul>
        );
      },
      ol: ({node, children}: any) => <ol style={{paddingLeft: '1.5em', marginBottom: '1.5em', listStyleType: 'decimal', color: (themeStyle.list as any).color}}>{children}</ol>,
      li: ({node, className, children}: any) => {
         const isTaskList = className?.includes('task-list-item');
         return (
             <li style={{
                ...commonTextStyle, 
                marginBottom: '0.2em', 
                paddingLeft: isTaskList ? '0' : '0.2em',
                listStyleType: isTaskList ? 'none' : 'inherit',
                display: isTaskList ? 'flex' : 'list-item', // Use Flex for task list to align checkbox
                alignItems: isTaskList ? 'flex-start' : undefined
             }}>
                {children}
             </li>
         );
      },
      a: ({node, href, children}: any) => {
        // Intercept Ruby links in WeChat preview too
        if (href && href.startsWith('ruby:')) {
            const reading = href.replace('ruby:', '');
            const decodedReading = decodeURIComponent(reading);
            return <RubyRender baseText={children} reading={decodedReading} style={{ fontSize: 'inherit', color: 'inherit' }} />;
        }
        return <a href={href} style={themeStyle.link}>{children}</a>;
      },
      hr: ({node}: any) => <hr style={themeStyle.hr} />,
      
      table: ({node, children}: any) => (
         <section style={{overflowX: 'auto', margin: '1.5em 0', borderRadius: '4px', border: '1px solid #e5e7eb'}}>
            <table style={{minWidth: '100%', borderCollapse: 'collapse', fontSize: '14px', lineHeight: '1.5'}}>
              {children}
            </table>
         </section>
      ),
      thead: ({node, children}: any) => <thead style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>{children}</thead>,
      tbody: ({node, children}: any) => <tbody>{children}</tbody>,
      tr: ({node, children}: any) => <tr style={{borderBottom: '1px solid #e5e7eb'}}>{children}</tr>,
      th: ({node, children}: any) => (
          <th style={{padding: '0.75em 1em', textAlign: 'left', fontWeight: 'bold', color: '#374151', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap'}}>
            {children}
          </th>
      ),
      td: ({node, children}: any) => (
          <td style={{padding: '0.75em 1em', color: '#4b5563', borderRight: '1px solid #e5e7eb', verticalAlign: 'top'}}>
             {children}
          </td>
      )
  }), [config, themeStyle, imagePool, baseFontSize, lineHeightValue, headingSizes, commonTextStyle]);

  return (
    <div 
        ref={containerRef}
        onScroll={onScroll}
        className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${visible ? 'z-10 visible' : 'z-0 invisible'} transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100'}`}
    >
        <div className={`w-full min-h-full flex justify-center py-8 origin-center transition-all duration-300 ease-out delay-75 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
            
            {/* Simulation Phone Frame */}
            <div className={`relative flex flex-col items-center rounded-[3rem] p-3 shadow-2xl border transition-colors duration-500
                 ${isDarkMode 
                    ? 'bg-[#2c313a] border-[#3e4451] shadow-black/50' 
                    : 'bg-white border-gray-200 shadow-xl'
                 }
            `}> 
                {/* Screen Wrapper */}
                <div className={`relative overflow-hidden rounded-[2.5rem] border-[4px] ${isDarkMode ? 'border-[#1a1d23]' : 'border-gray-50'}`}>
                    
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                         <div className={`w-36 h-6 rounded-b-2xl shadow-sm ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100'}`}></div>
                    </div>

                    {/* Content Container */}
                    <div 
                        className="w-[375px] md:w-[480px] bg-white min-h-[800px] relative flex flex-col"
                        ref={ref}
                    >   
                        {/* Header */}
                        <div className="px-5 pt-12 pb-2">
                            <h1 style={{fontSize: '22px', fontWeight: 'bold', lineHeight: '1.4', color: '#333', marginBottom: '0.75em', letterSpacing: '0.025em'}}>
                                {headerInfo.title}
                            </h1>
                            <div style={{display: 'flex', alignItems: 'center', fontSize: '14px', color: 'rgba(0,0,0,0.4)', marginBottom: '1.5em'}}>
                                <span style={{marginRight: '10px'}}>原创</span>
                                <span style={{marginRight: '10px', color: '#576b95', fontWeight: '500'}}>{headerInfo.author}</span>
                                <span style={{marginRight: '10px', color: '#576b95'}}>{headerInfo.account}</span>
                                <span>{headerInfo.date}</span>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 px-4 pb-12 wechat-content">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath, remarkRuby]}
                                rehypePlugins={[rehypeKatex]}
                                components={components}
                                urlTransform={(value) => value} // IMPORTANT: Allow local:// protocol for StableImage
                            >
                                {processedMarkdown}
                            </ReactMarkdown>

                            {/* Footnotes */}
                            {config.linkReferences && footnotes.length > 0 && (
                                <div style={{marginTop: '3em', paddingTop: '1.5em', borderTop: '1px dashed #e5e7eb'}}>
                                    <h4 style={{fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '0.75em'}}>引用链接</h4>
                                    <div style={{fontSize: '12px', color: '#6b7280'}}>
                                        {footnotes.map((fn, idx) => (
                                            <div key={idx} style={{marginBottom: '4px', display: 'flex', gap: '4px', wordBreak: 'break-all'}}>
                                                <span style={{flexShrink: 0, width: '1.5em', textAlign: 'center', opacity: 0.6}}>[{idx + 1}]</span>
                                                <span>{fn}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{padding: '24px 16px', fontSize: '14px', color: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', marginTop: 'auto', backgroundColor: '#fff'}}>
                           <div style={{display: 'flex', gap: '24px'}}>
                              <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span style={{fontSize: '16px'}}>❤</span> 3
                              </span>
                              <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span style={{fontSize: '16px'}}>★</span> 8
                              </span>
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
