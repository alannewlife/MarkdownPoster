import React, { useState, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toPng } from 'html-to-image';
import { Toolbar } from './components/Toolbar';
import { BorderTheme, BorderStyleConfig, FontSize } from './types';

const DEFAULT_MARKDOWN = `# Markdown 海报生成器

![](https://picsum.photos/600/300)

Markdown Poster 是一个工具，让你用 Markdown 制作优雅的图文海报。 ✨

## 它的主要功能：

1. 将 Markdown 转化为 **图文海报**
2. 可以 **自定义**
   - 文本主题背景
   - 字体大小
   - 画布宽度
   - 署名
3. 所见即所得，可**下载为 PNG 图片**。

## 适用场景：

| 场景 | 描述 | 推荐主题 |
| :--- | :--- | :--- |
| 📝 **笔记分享** | 分享学习心得、读书笔记 | 极简白、macOS |
| 🎨 **创意展示** | 展示代码片段、诗歌 | 赛博霓虹、海报模式 |
| 📢 **社交媒体** | 朋友圈、推特长文 | 日落渐变、糖果甜心 |

## 代码示例

\`\`\`javascript
function createArt() {
  const inspiration = "🌟 Inspiration";
  return \`Make it beautiful: \${inspiration}\`;
}
\`\`\`

> "设计不仅仅是外观和感觉，设计是工作原理。" —— 史蒂夫·乔布斯

[访问我们的网站 rrzxs.com](https://rrzxs.com)
`;

export default function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState<BorderTheme>(BorderTheme.MacOS);
  const [fontSize, setFontSize] = useState<FontSize>(FontSize.Medium);
  const [isExporting, setIsExporting] = useState(false);
  
  // Watermark State - Default is empty to show placeholder in input, fallback text used in preview
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("");

  // Layout State for Resizable Splitter
  const [leftWidth, setLeftWidth] = useState(50); // Percentage
  
  const exportRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    
    const onMouseMove = (e: MouseEvent) => {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        // Limit width between 20% and 80%
        if (newWidth >= 20 && newWidth <= 80) {
            setLeftWidth(newWidth);
        }
    };
    
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent selection while dragging
  }, []);

  const getThemeStyles = (themeName: BorderTheme): BorderStyleConfig => {
    switch (themeName) {
      case BorderTheme.Poster:
        return {
          // UPDATED: Gradient is now the frame itself
          frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600", 
          // UPDATED: Card is transparent to avoid double-border look
          card: "bg-transparent", 
          // UPDATED: Content keeps the white box look
          content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl p-8 min-h-[600px]",
          prose: "prose-slate prose-lg",
          header: "hidden",
          watermarkColor: "text-white/80"
        };
      case BorderTheme.Sunset:
        return {
          frame: "bg-[#fff7ed]", // orange-50
          card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50",
          content: "bg-transparent text-gray-800 p-10",
          prose: "prose-orange prose-headings:text-orange-900",
          header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2",
          watermarkColor: "text-orange-300"
        };
      case BorderTheme.Ocean:
        return {
          frame: "bg-[#0f172a]", // slate-900 dark frame
          card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative",
          content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50 p-10",
          prose: "prose-invert prose-headings:text-cyan-200 prose-a:text-cyan-400",
          header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2",
          watermarkColor: "text-cyan-800"
        };
      case BorderTheme.Candy:
        return {
          frame: "bg-[#fdf2f8]", // pink-50
          card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden",
          content: "bg-yellow-50/50 text-gray-800 p-8 font-comic",
          prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600",
          header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3",
          watermarkColor: "text-pink-300"
        };
      case BorderTheme.Neon:
        return {
          frame: "bg-[#171717]", // neutral-900
          card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden",
          content: "bg-gray-900 text-pink-50 p-8",
          prose: "prose-invert prose-p:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300",
          watermarkColor: "text-pink-900" // Darker pink for subtle watermark on black
        };
      case BorderTheme.Sketch:
        return {
          frame: "bg-[#f5f5f4]", // stone-100
          card: "bg-white sketch-border p-2 bg-white",
          content: "bg-white text-gray-900 p-8 font-comic",
          prose: "prose-slate prose-headings:font-comic",
          watermarkColor: "text-stone-400"
        };
      case BorderTheme.Retro:
        return {
          frame: "bg-[#e5dfce]", // slightly darker than card
          card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl",
          content: "bg-[#fdf6e3] text-[#657b83] p-10",
          prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif",
          watermarkColor: "text-[#b58900] opacity-40"
        };
      case BorderTheme.Glass:
        return {
          frame: "bg-gradient-to-br from-indigo-100 to-purple-100",
          card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5",
          content: "bg-transparent text-gray-900 p-8",
          prose: "prose-gray prose-headings:text-gray-900 font-sans",
          watermarkColor: "text-indigo-300"
        };
      case BorderTheme.Minimal:
        return {
          frame: "bg-[#f9fafb]", // gray-50
          card: "bg-white border border-gray-200 shadow-sm",
          content: "bg-white text-gray-900 p-10",
          prose: "prose-stone",
          watermarkColor: "text-gray-300"
        };
      case BorderTheme.MacOS:
      default:
        return {
          frame: "bg-[#f3f4f6]", // gray-100
          card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
          header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2",
          content: "bg-white text-gray-800 p-8",
          prose: "prose-slate",
          watermarkColor: "text-gray-400"
        };
    }
  };

  const getFontSizeClass = (size: FontSize) => {
    switch (size) {
      case FontSize.Small: return 'prose-sm';
      case FontSize.Large: return 'prose-xl';
      case FontSize.Medium: default: return 'prose-base';
    }
  };

  const currentStyle = useMemo(() => getThemeStyles(theme), [theme]);

  // Use a reliable image proxy to handle CORS issues for any external image
  const getCorsFriendlyUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    
    // Check if it's an external URL
    try {
      const urlObj = new URL(url);
      // Skip proxy for same origin (if any, though in this app likely not)
      if (urlObj.origin === window.location.origin) return url;
      
      // Use wsrv.nl as a high-performance, CORS-enabled image proxy
      return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`;
    } catch {
      return url;
    }
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      // Ensure fonts and images are loaded
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dataUrl = await toPng(exportRef.current, { 
        cacheBust: true,
        pixelRatio: 2, 
        // useCORS removed as it is not a valid option for html-to-image
      });
      
      const link = document.createElement('a');
      link.download = `markdownposter-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed', error);
      alert('导出图片失败。这可能是因为网络连接问题，或图片服务限制了访问。');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setMarkdown(e.target.result);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toolbar 
        currentTheme={theme} 
        setTheme={setTheme} 
        onExport={handleExport}
        isExporting={isExporting}
        showWatermark={showWatermark}
        setShowWatermark={setShowWatermark}
        watermarkText={watermarkText}
        setWatermarkText={setWatermarkText}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor Panel */}
        <div 
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col border-r border-gray-200 bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
          <div className="h-10 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/50">
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">输入源码</span>
                <a 
                  href="https://markdown.com.cn/basic-syntax/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                  title="Markdown 语法帮助"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
             </div>
             <label className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-wide">
                <input 
                  type="file" 
                  accept=".md,.txt" 
                  onChange={handleFileImport} 
                  className="hidden" 
                />
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                导入
             </label>
          </div>
          <textarea
            className="flex-1 w-full p-6 resize-none focus:outline-none text-gray-700 font-mono text-sm leading-relaxed"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="在此输入 Markdown..."
            spellCheck={false}
          />
        </div>

        {/* Resizer Handle */}
        <div
          className="w-4 -ml-2 h-full z-20 cursor-col-resize flex items-center justify-center hover:bg-amber-500/5 transition-colors group flex-shrink-0 select-none"
          onMouseDown={startResizing}
        >
           <div className="w-1 h-8 rounded-full bg-gray-300 group-hover:bg-amber-400 transition-colors shadow-sm" />
        </div>

        {/* Right: Preview Workspace */}
        <div className="flex-1 bg-gray-100/80 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] overflow-y-auto relative flex flex-col items-center min-w-0">
          
          <div className="w-full py-10 px-8 flex justify-center min-h-min">
            
            {/* 
                THE EXPORT FRAME 
                Outer container captured by export. 
                UPDATED: Reduced padding to p-4 sm:p-6 (about half of previous).
            */}
            <div 
              ref={exportRef}
              className={`w-full max-w-2xl transition-all duration-300 ease-in-out flex flex-col p-4 sm:p-6 ${currentStyle.frame}`}
            >
              
              {/* The Inner Card */}
              <div className={`w-full ${currentStyle.card}`}>
                {/* Conditional Header Rendering */}
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
                      <div className="flex-1 text-center text-xs text-orange-800/50 font-bold uppercase tracking-widest">日落模式</div>
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
                   <div className={currentStyle.header}>
                      <div className="text-[10px] text-cyan-500/50 font-mono">SYS.01 // 在线</div>
                   </div>
                )}
                
                {/* Content Body */}
                <div className={`prose max-w-none ${currentStyle.prose} ${currentStyle.content} ${getFontSizeClass(fontSize)} min-h-[500px]`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({node, ...props}) => (
                        <img 
                          {...props} 
                          src={getCorsFriendlyUrl(typeof props.src === 'string' ? props.src : undefined)}
                          className="max-w-full h-auto rounded-lg shadow-sm mx-auto block"
                          loading="eager" 
                          crossOrigin="anonymous" 
                        />
                      )
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Footer Watermark (Now outside the card, inside the frame) */}
              {showWatermark && (
                <div className={`mt-6 text-right opacity-60 text-[10px] tracking-widest font-bold ${currentStyle.watermarkColor}`}>
                  {watermarkText || "人人智学社 rrzxs.com"}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}