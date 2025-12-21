
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { PreviewControlBar } from './components/PreviewControlBar';
import { PosterPreview } from './components/PosterPreview';
import { WritingPreview } from './components/WritingPreview';
import { WeChatPreview } from './components/WeChatPreview';
import { BorderTheme, FontSize, ViewMode, LayoutTheme, PaddingSize, WatermarkAlign, WeChatConfig, WeChatTheme } from './types';
import { cleanImagePool, compressImage } from './utils/imageUtils';
import { DEFAULT_MARKDOWN } from './constants/defaultContent';
import { usePosterExport } from './hooks/usePosterExport';
import { useWeChatExport } from './hooks/useWeChatExport';
import { useProjectExport } from './hooks/useProjectExport';

// LocalStorage Keys
const STORAGE_KEY_MARKDOWN = 'markdown_poster_draft';
const STORAGE_KEY_THEME = 'markdown_poster_theme';
const STORAGE_KEY_LAYOUT_THEME = 'markdown_poster_layout_theme';
const STORAGE_KEY_FONT_SIZE = 'markdown_poster_fontsize';
const STORAGE_KEY_PADDING = 'markdown_poster_padding';
const STORAGE_KEY_WATERMARK_SHOW = 'markdown_poster_watermark_show';
const STORAGE_KEY_WATERMARK_TEXT = 'markdown_poster_watermark_text';
const STORAGE_KEY_WATERMARK_ALIGN = 'markdown_poster_watermark_align';
const STORAGE_KEY_DARK_MODE = 'markdown_poster_dark_mode';
const STORAGE_KEY_IMAGE_POOL = 'markdown_poster_image_pool'; 
const STORAGE_KEY_WECHAT_CONFIG = 'markdown_poster_wechat_config';

// Max History Steps
const MAX_HISTORY_SIZE = 10;

export default function App() {
  // --- STATE INITIALIZATION WITH LOCALSTORAGE ---
  
  // 1. Markdown Content
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MARKDOWN);
    return saved !== null ? saved : DEFAULT_MARKDOWN;
  });

  // 2. Theme
  const [theme, setTheme] = useState<BorderTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return (saved as BorderTheme) || BorderTheme.Minimal;
  });

  // 3. Layout Theme
  const [layoutTheme, setLayoutTheme] = useState<LayoutTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LAYOUT_THEME);
    return (saved as LayoutTheme) || LayoutTheme.Base;
  });

  // 4. Font Size
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    return (saved as FontSize) || FontSize.Medium;
  });

  // 5. Padding (Now controls Frame Width)
  const [padding, setPadding] = useState<PaddingSize>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PADDING);
    return (saved as PaddingSize) || PaddingSize.Medium;
  });
  
  // 6. Watermark Settings
  const [showWatermark, setShowWatermark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WATERMARK_SHOW);
    return saved !== null ? saved === 'true' : true;
  });
  
  const [watermarkText, setWatermarkText] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WATERMARK_TEXT);
    return saved !== null ? saved : "";
  });

  const [watermarkAlign, setWatermarkAlign] = useState<WatermarkAlign>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WATERMARK_ALIGN);
    return (saved as WatermarkAlign) || WatermarkAlign.Right;
  });

  // 7. Dark Mode (with system preference fallback)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DARK_MODE);
    if (saved !== null) {
        return saved === 'true';
    }
    // Fallback to system preference
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // 8. View Mode (Poster vs Writing vs WeChat)
  // Force default to Writing mode on entry, no persistence
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Writing);
  
  // 9. WeChat Config
  const [weChatConfig, setWeChatConfig] = useState<WeChatConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WECHAT_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure new properties exist and handle old format
      return {
          theme: WeChatTheme.Default,
          codeTheme: 'vsDark',
          macCodeBlock: true,
          lineNumbers: true,
          linkReferences: true,
          indent: false,
          justify: true,
          captionType: 'title',
          lineHeight: 'comfortable',
          ...parsed,
          // Force overwrite old string fontSizes if present in ...parsed
          fontSize: (Object.values(FontSize).includes(parsed.fontSize)) ? parsed.fontSize : FontSize.Medium
      };
    }
    return {
      theme: WeChatTheme.Default,
      codeTheme: 'vsDark',
      macCodeBlock: true,
      lineNumbers: true,
      linkReferences: true,
      indent: false,
      justify: true,
      captionType: 'title',
      fontSize: FontSize.Medium,
      lineHeight: 'comfortable'
    };
  });

  // 10. Image Pool (Virtual File System)
  const [imagePool, setImagePool] = useState<Record<string, string>>(() => {
    try {
      const savedPoolStr = localStorage.getItem(STORAGE_KEY_IMAGE_POOL);
      // We read directly from LS here to ensure we cross-reference the *persisted* markdown content
      const savedMarkdown = localStorage.getItem(STORAGE_KEY_MARKDOWN); 
      const contentToCheck = savedMarkdown !== null ? savedMarkdown : DEFAULT_MARKDOWN;

      let pool = savedPoolStr ? JSON.parse(savedPoolStr) : {};

      // --- STARTUP GC LOGIC ---
      const { cleanedPool } = cleanImagePool(pool, contentToCheck, 'Startup');
      
      return cleanedPool;
    } catch (e) {
      console.error("Failed to load image pool", e);
      return {};
    }
  });

  // --- PERSISTENCE EFFECTS ---
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MARKDOWN, markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LAYOUT_THEME, layoutTheme);
  }, [layoutTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, fontSize);
  }, [fontSize]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PADDING, padding);
  }, [padding]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATERMARK_SHOW, String(showWatermark));
  }, [showWatermark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATERMARK_TEXT, watermarkText);
  }, [watermarkText]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATERMARK_ALIGN, watermarkAlign);
  }, [watermarkAlign]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WECHAT_CONFIG, JSON.stringify(weChatConfig));
  }, [weChatConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IMAGE_POOL, JSON.stringify(imagePool));
    } catch (e) {
      console.warn("LocalStorage quota exceeded.", e);
    }
  }, [imagePool]);

  // ---------------------------

  const [leftWidth, setLeftWidth] = useState(50); 
  
  // Refs
  const exportRef = useRef<HTMLDivElement>(null);
  const weChatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- USE EXPORT HOOKS ---
  const { 
      isExporting: isExportingPoster, 
      handleDownloadPoster, 
      handleCopyPoster 
  } = usePosterExport({ 
      exportRef, 
      imagePool, 
      setImagePool, 
      markdown 
  });

  const {
      isCopyingWeChat,
      handleCopyHtml
  } = useWeChatExport({ 
      weChatRef 
  });

  const {
      isExportingZip,
      handleExportZip,
      handleDownloadMarkdown
  } = useProjectExport({
      markdown,
      imagePool
  });

  // --- HISTORY / UNDO SYSTEM ---
  const [history, setHistory] = useState<string[]>(() => [markdown]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- THEME TOGGLE LOGIC ---
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // --- METADATA CALCULATIONS ---
  const wordCount = useMemo(() => {
    return markdown.replace(/\s/g, '').length;
  }, [markdown]);

  const dateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
  }, []);

  const pushToHistory = useCallback((newText: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newText);

    if (nextHistory.length > MAX_HISTORY_SIZE) {
      const slicedHistory = nextHistory.slice(nextHistory.length - MAX_HISTORY_SIZE);
      setHistory(slicedHistory);
      setHistoryIndex(MAX_HISTORY_SIZE - 1);
    } else {
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdown(newText);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (newText !== history[historyIndex]) {
        pushToHistory(newText);
      }
    }, 500);
  };

  const updateMarkdownImmediate = (newText: string) => {
    setMarkdown(newText);
    pushToHistory(newText);
    requestAnimationFrame(() => {
        textareaRef.current?.focus({ preventScroll: true });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault(); 
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
    }
  };
  
  // --- EDITOR ACTION HELPERS ---

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const beforeText = currentText.substring(0, start);
    const afterText = currentText.substring(end);

    const newText = beforeText + textToInsert + afterText;
    const newCursorPos = start + textToInsert.length;

    updateMarkdownImmediate(newText);

    requestAnimationFrame(() => {
        if (textareaRef.current) {
            textareaRef.current.focus({ preventScroll: true });
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    });
  };

  const handleSelectAll = () => {
    textareaRef.current?.focus({ preventScroll: true });
    textareaRef.current?.select();
  };
  
  const handleCopySelection = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    if (textarea.selectionStart === textarea.selectionEnd) return;

    const text = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    
    const selectedText = currentText.substring(start, end);
    const beforeText = currentText.substring(0, start);
    const afterText = currentText.substring(end);

    let newText = '';
    let newCursorPosStart = 0;
    let newCursorPosEnd = 0;

    const textToInsert = selectedText.length > 0 ? selectedText : placeholder;
    newText = beforeText + prefix + textToInsert + suffix + afterText;
    
    if (selectedText.length > 0) {
        newCursorPosStart = end + prefix.length + suffix.length;
        newCursorPosEnd = newCursorPosStart;
    } else {
        if (placeholder.length > 0) {
            newCursorPosStart = start + prefix.length;
            newCursorPosEnd = newCursorPosStart + placeholder.length;
        } else {
            newCursorPosStart = start + prefix.length;
            newCursorPosEnd = newCursorPosStart;
        }
    }

    updateMarkdownImmediate(newText);

    requestAnimationFrame(() => {
        if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newCursorPosStart, newCursorPosEnd);
        }
    });
  };

  const handleLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const text = textarea.value;
    const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;
    const beforeLine = text.substring(0, lineStart);
    const afterLine = text.substring(lineStart);

    const newText = beforeLine + prefix + afterLine;
    updateMarkdownImmediate(newText);

    const newCursorPos = cursorPosition + prefix.length;

    requestAnimationFrame(() => {
        if (textareaRef.current) {
            textareaRef.current.focus({ preventScroll: true });
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    });
  };

  const handleHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const text = textarea.value;
    const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;
    const firstChar = text.charAt(lineStart);
    const prefix = firstChar === '#' ? '#' : '# ';

    const beforeLine = text.substring(0, lineStart);
    const afterLine = text.substring(lineStart);

    const newText = beforeLine + prefix + afterLine;
    updateMarkdownImmediate(newText);

    const newCursorPos = cursorPosition + prefix.length;

    requestAnimationFrame(() => {
        if (textareaRef.current) {
            textareaRef.current.focus({ preventScroll: true });
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    });
  };

  // --- VIRTUAL FILE SYSTEM IMAGE HANDLER ---
  const processImageFile = async (file: File) => {
    try {
        const compressedDataUrl = await compressImage(file);
        if (compressedDataUrl.length > 800 * 1024) { 
             alert("即便经过压缩，图片依然过大，建议上传更小的图片（推荐 < 2MB）。");
             return;
        }

        const imgId = 'img_' + Math.random().toString(36).substr(2, 9);
        
        setImagePool(prev => {
            const newPool = { ...prev, [imgId]: compressedDataUrl };
            try {
                const testStr = JSON.stringify(newPool);
                if (testStr.length > 4.8 * 1024 * 1024) {
                     alert("本地存储空间即将耗尽，请先删除部分旧图片。");
                     return prev;
                }
                return newPool;
            } catch (e) {
                alert("本地存储空间不足，无法添加。");
                return prev;
            }
        });

        insertTextAtCursor(`![](local://${imgId})`);
    } catch (e) {
        console.error("Image processing error:", e);
        alert("处理图片失败，请重试。");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
                processImageFile(file);
            }
            return; 
        }
    }
  };

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    
    const onMouseMove = (e: MouseEvent) => {
        const newWidth = (e.clientX / window.innerWidth) * 100;
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
    document.body.style.userSelect = 'none'; 
  }, []);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          updateMarkdownImmediate(e.target.result);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#23272e]' : 'bg-white'}`}>
      
      <div className="relative z-50">
         <Toolbar 
            isDarkMode={isDarkMode} 
            onToggleTheme={toggleTheme}
            onSaveMarkdown={handleDownloadMarkdown}
            onExportZip={handleExportZip}
            isExportingZip={isExportingZip}
            viewMode={viewMode}
         />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Editor Panel */}
        <div 
          style={{ width: `${leftWidth}%` }}
          className={`flex flex-col z-10 relative transition-colors duration-500
            ${isDarkMode 
                ? 'bg-[#23272e] shadow-none' // Dark Mode
                : 'bg-[#fdfcf5] border-r border-[#e0e0e0] shadow-[4px_0_24px_rgba(0,0,0,0.02)]' // Light Mode
            }
          `}
        >
          {/* Editor Header */}
          <div className={`h-12 flex items-center px-4 justify-between relative z-20 transition-colors duration-500
             ${isDarkMode ? 'bg-[#1e2227] border-b border-[#181a1f]' : 'bg-[#f4f2eb] border-b border-[#e8e6df]'}
          `}>
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#8c8880] uppercase tracking-widest">Editor</span>
                    <a href="https://markdown.com.cn/basic-syntax/headings.html" target="_blank" rel="noopener noreferrer" className="text-[#a8a49c] hover:text-[#8b7e74] transition-colors" title="Markdown 语法帮助">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </a>
                </div>
                <div className="w-px h-4 bg-[#d1d0c9] flex-shrink-0"></div>
                <div className={`flex items-center gap-1 transition-all duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <button onClick={handleHeading} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="标题"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h12M6 20V4M18 20V4"/></svg></button>
                    <button onClick={() => insertMarkdownSyntax('**', '**')} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="粗体"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg></button>
                    <button onClick={() => handleLinePrefix('- ')} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="列表"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                    <button onClick={() => handleLinePrefix('1. ')} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="数字列表"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg></button>
                    <div className={`w-px h-3 mx-1 flex-shrink-0 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300'}`}></div>
                    <button onClick={() => handleLinePrefix('> ')} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="引用"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 9L9 9.01"/><path d="M15 9L14 9.01"/><path d="M3 21V11C3 6.58 6.58 3 11 3h2c4.42 0 8 3.58 8 8v10H3z"/></svg></button>
                    <div className={`w-px h-3 mx-1 flex-shrink-0 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300'}`}></div>
                    <button onClick={() => insertMarkdownSyntax('[', '](https://example.com)', '链接文字')} className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="链接"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></button>
                    <label className={`p-1.5 rounded transition-colors flex-shrink-0 cursor-pointer ${isDarkMode ? 'hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'hover:text-[#8b7e74] hover:bg-[#e0ded7]'}`} title="图片">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </label>
                </div>
             </div>

             <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                   <button type="button" onClick={handleUndo} disabled={historyIndex <= 0} className={`p-1.5 rounded transition-colors ${historyIndex > 0 ? (isDarkMode ? 'text-[#5c6370] hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'text-[#8c8880] hover:text-[#2d2d2d] hover:bg-[#e0ded7]') : 'text-gray-300/20 cursor-not-allowed'}`} title="撤销 (Ctrl+Z)"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg></button>
                   <button type="button" onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded transition-colors ${historyIndex < history.length - 1 ? (isDarkMode ? 'text-[#5c6370] hover:text-[#d4cfbf] hover:bg-[#3e4451]' : 'text-[#8c8880] hover:text-[#2d2d2d] hover:bg-[#e0ded7]') : 'text-gray-300/20 cursor-not-allowed'}`} title="重做 (Ctrl+Shift+Z)"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg></button>
                 </div>
                 <div className={`w-px h-3 mx-1 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300'}`}></div>
                 <div className="flex items-center gap-2">
                    <button onClick={handleSelectAll} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-[#8c8880] hover:text-[#8b7e74]'}`} title="全选"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg><span>全选</span></button>
                    <button onClick={handleCopySelection} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-[#8c8880] hover:text-[#8b7e74]'}`} title="复制选中内容"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg><span>复制</span></button>
                 </div>
                 <button type="button" onClick={() => updateMarkdownImmediate('')} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#5c6370] hover:text-[#e06c75]' : 'text-[#8c8880] hover:text-red-500'}`} title="清空"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span>清空</span></button>
                 <div className={`w-px h-3 mx-1 transition-colors ${isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300'}`}></div>
                 <div className="flex items-center gap-3">
                    <label className={`cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#5c6370] hover:text-[#abb2bf]' : 'text-[#8c8880] hover:text-[#8b7e74]'}`}>
                        <input type="file" accept=".md,.txt" onChange={handleFileImport} className="hidden" />
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg><span>导入</span>
                    </label>
                 </div>
             </div>
          </div>
          <div className="absolute top-[3.5rem] right-8 z-10 pointer-events-none select-none">
             <span className={`text-[10px] font-medium font-sans tracking-widest transition-colors ${isDarkMode ? 'text-[#5c6370]' : 'text-[#8c8880]/60'}`}>
               {wordCount} 字 <span className="mx-1 opacity-50">|</span> {dateStr}
             </span>
          </div>
          <textarea
            ref={textareaRef}
            className={`flex-1 w-full px-8 pb-8 pt-9 resize-none focus:outline-none font-mono text-[15px] leading-[32px] bg-[length:100%_32px] bg-[position:0_0] bg-local transition-colors duration-500 ${isDarkMode ? 'text-[#d4cfbf] bg-[image:linear-gradient(transparent_31px,#333842_31px)] placeholder-[#5c6370] bg-[#23272e]' : 'text-[#2d2d2d] bg-transparent bg-[image:linear-gradient(transparent_31px,#e8e8e8_31px)] placeholder-gray-400/50'}`}
            value={markdown}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="在此输入 Markdown..."
            spellCheck={false}
          />
        </div>

        {/* Resizer Handle */}
        <div className="w-6 -ml-3 h-full z-20 cursor-col-resize flex items-center justify-center group flex-shrink-0 select-none relative" onMouseDown={startResizing} title="拖动调整宽度">
           <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px h-full transition-colors ${isDarkMode ? 'bg-transparent group-hover:bg-[#5c6370]/50' : 'bg-transparent group-hover:bg-[#8b7e74]/50'}`} />
           <div className={`relative z-30 w-2 h-16 border shadow-sm flex flex-col items-center justify-center gap-2 transition-all duration-200 ${isDarkMode ? 'bg-[#1e2227] border-[#181a1f] group-hover:bg-[#2c313a] group-hover:border-[#5c6370]' : 'bg-white border-gray-300 group-hover:border-[#8b7e74] group-hover:bg-[#8b7e74]/10'}`}>
             <div className={`w-0.5 h-0.5 ${isDarkMode ? 'bg-[#5c6370]' : 'bg-gray-400 group-hover:bg-[#8b7e74]'}`} />
             <div className={`w-0.5 h-0.5 ${isDarkMode ? 'bg-[#5c6370]' : 'bg-gray-400 group-hover:bg-[#8b7e74]'}`} />
             <div className={`w-0.5 h-0.5 ${isDarkMode ? 'bg-[#5c6370]' : 'bg-gray-400 group-hover:bg-[#8b7e74]'}`} />
           </div>
        </div>

        {/* Right: Preview Workspace */}
        <div className={`flex-1 flex flex-col min-w-0 relative transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100'}`}>
          
          <PreviewControlBar 
            currentTheme={theme} 
            setTheme={setTheme} 
            layoutTheme={layoutTheme}
            setLayoutTheme={setLayoutTheme}
            padding={padding}
            setPadding={setPadding}
            watermarkAlign={watermarkAlign}
            setWatermarkAlign={setWatermarkAlign}

            onExport={handleDownloadPoster}
            onCopyImage={handleCopyPoster}
            
            onSaveMarkdown={handleDownloadMarkdown}
            onExportZip={handleExportZip}
            isExportingZip={isExportingZip}
            
            isExporting={isExportingPoster || isCopyingWeChat} 
            showWatermark={showWatermark}
            setShowWatermark={setShowWatermark}
            watermarkText={watermarkText}
            setWatermarkText={setWatermarkText}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isDarkMode={isDarkMode}
            
            viewMode={viewMode}
            setViewMode={setViewMode}
            
            weChatConfig={weChatConfig}
            setWeChatConfig={setWeChatConfig}
            onCopyWeChatHtml={handleCopyHtml}
          />
          
          <div className="relative flex-1 min-h-0 overflow-hidden">
             
             {/* --- POSTER MODE RENDER --- */}
             <PosterPreview 
               ref={exportRef}
               visible={viewMode === ViewMode.Poster}
               markdown={markdown}
               theme={theme}
               layoutTheme={layoutTheme}
               fontSize={fontSize}
               padding={padding}
               showWatermark={showWatermark}
               watermarkText={watermarkText}
               watermarkAlign={watermarkAlign}
               imagePool={imagePool}
               isDarkMode={isDarkMode}
             />

            {/* --- WRITING MODE RENDER --- */}
            <WritingPreview 
               visible={viewMode === ViewMode.Writing}
               markdown={markdown}
               fontSize={fontSize}
               imagePool={imagePool}
               isDarkMode={isDarkMode}
            />

            {/* --- WECHAT MODE RENDER --- */}
            <WeChatPreview
               ref={weChatRef}
               visible={viewMode === ViewMode.WeChat}
               markdown={markdown}
               config={weChatConfig}
               imagePool={imagePool}
               isDarkMode={isDarkMode}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
