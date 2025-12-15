import React, { useState, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toPng } from 'html-to-image';
import { Toolbar } from './components/Toolbar';
import { BorderTheme, BorderStyleConfig } from './types';

const DEFAULT_MARKDOWN = `# Markdown 海报生成器

![](https://picsum.photos/600/300)

Markdown Poster 是一个工具，让你用 Markdown 制作优雅的图文海报。 ✨

## 它的主要功能：

1. 将 Markdown 转化为 **图文海报**
2. 可以 **自定义** 文本主题、背景、字体大小
3. 可以复制图片到 **剪贴板**，或者 **下载为PNG图片**
4. 所见即所得

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
  const [isExporting, setIsExporting] = useState(false);
  
  // Watermark State
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("人人智学社 rrzxs.com");

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
          card: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl ring-4 ring-purple-100/50",
          content: "bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-xl p-10 min-h-[600px]",
          prose: "prose-slate prose-lg",
          header: "h-2" // Minimal spacer
        };
      case BorderTheme.Sunset:
        return {
          card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50",
          content: "bg-transparent text-gray-800 p-10",
          prose: "prose-orange prose-headings:text-orange-900",
          header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2"
        };
      case BorderTheme.Ocean:
        return {
          card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative",
          content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50 p-10",
          prose: "prose-invert prose-headings:text-cyan-200 prose-a:text-cyan-400",
          header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2"
        };
      case BorderTheme.Candy:
        return {
          card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden",
          content: "bg-yellow-50/50 text-gray-800 p-8 font-comic",
          prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600",
          header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3"
        };
      case BorderTheme.Neon:
        return {
          card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden",
          content: "bg-gray-900 text-pink-50 p-8",
          prose: "prose-invert prose-p:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300",
        };
      case BorderTheme.Sketch:
        return {
          card: "bg-white sketch-border p-2 bg-white",
          content: "bg-white text-gray-900 p-8 font-comic",
          prose: "prose-slate prose-headings:font-comic",
        };
      case BorderTheme.Retro:
        return {
          card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl",
          content: "bg-[#fdf6e3] text-[#657b83] p-10",
          prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif",
        };
      case BorderTheme.Glass:
        return {
          card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5",
          content: "bg-transparent text-gray-900 p-8",
          prose: "prose-gray prose-headings:text-gray-900 font-sans",
        };
      case BorderTheme.Minimal:
        return {
          card: "bg-white border border-gray-200 shadow-sm",
          content: "bg-white text-gray-900 p-10",
          prose: "prose-stone",
        };
      case BorderTheme.MacOS:
      default:
        return {
          card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
          header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2",
          content: "bg-white text-gray-800 p-8",
          prose: "prose-slate",
        };
    }
  };

  const currentStyle = useMemo(() => getThemeStyles(theme), [theme]);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      // Small delay to ensure styles are stable
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(exportRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // High resolution
        style: {
          margin: '0', // Reset margin in capture
        }
      });
      
      const link = document.createElement('a');
      link.download = `markframe-export-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed', error);
      alert('导出图片失败。');
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
    // Reset the input value so the same file can be selected again if needed
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
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor Panel */}
        <div 
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col border-r border-gray-200 bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
          <div className="h-10 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50/50">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">输入源码</span>
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
            {/* The Themed Preview Card */}
            <div 
              ref={exportRef}
              className={`w-full max-w-2xl transition-all duration-300 ease-in-out ${currentStyle.card}`}
            >
              {/* Conditional Header Rendering */}
              {theme === BorderTheme.MacOS && (
                <div className={currentStyle.header}>
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  {/* Text removed */}
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
              <div className={`prose max-w-none ${currentStyle.prose} ${currentStyle.content} min-h-[500px]`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
              
              {/* Footer Watermark */}
              {showWatermark && (
                <div className={`px-8 pb-6 pt-2 text-right opacity-50 text-[10px] uppercase tracking-widest font-bold ${
                  theme === BorderTheme.Neon ? 'text-pink-300' : 
                  theme === BorderTheme.Ocean ? 'text-cyan-300' :
                  theme === BorderTheme.Sunset ? 'text-orange-900' :
                  theme === BorderTheme.Poster ? 'text-white/80' :
                  'text-gray-400'
                }`}>
                  {watermarkText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}