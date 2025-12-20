import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toPng, toBlob } from 'html-to-image';
import { Toolbar } from './components/Toolbar';
import { PreviewControlBar } from './components/PreviewControlBar';
import { BorderTheme, BorderStyleConfig, FontSize, ViewMode, LayoutTheme, PaddingSize, WatermarkAlign } from './types';
// @ts-ignore
import JSZip from 'jszip';
// @ts-ignore
import FileSaver from 'file-saver';

const DEFAULT_MARKDOWN = `# Markdown 海报生成器

![](https://picsum.photos/600/300)

\`Markdown Poster\` 是一个工具，让你用 Markdown 制作优雅的图文海报。 ✨

## 它的主要功能：

1. 将 *Markdown* 转化为 **图文海报**
2. 可以 **自定义**
   - [x] 文本主题背景
   - [x] 字体大小
   - [x] 画布宽度
   - [x] 署名位置
3. 所见即所得，可**下载为PNG 图片**或者复制图片到**剪贴板**。
4. 最大亮点，可以直接**黏贴图片**，或者**选择本地图片**插入编辑器

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

// Helper to handle CORS for initial fetch
const getCorsFriendlyUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('local://')) return url;
  try {
    const urlObj = new URL(url);
    if (urlObj.origin === window.location.origin) return url;
    // Use wsrv.nl as a high-performance, CORS-enabled image proxy
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`;
  } catch {
    return url;
  }
};

// Convert Data URI to Blob
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

// Get Extension from Mime
const getExtensionFromMime = (mime: string) => {
  switch(mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    case 'image/svg+xml': return 'svg';
    default: return 'png';
  }
};

// NEW: Helper function for Image Garbage Collection
const cleanImagePool = (pool: Record<string, string>, markdownContent: string, sourceLabel: string) => {
    // 1. Identify all image IDs currently used in the Markdown
    const usedIds = new Set<string>();
    // Regex to find strings like: local://img_123456789
    const regex = /local:\/\/(img_[a-z0-9]+)/gi;
    let match;
    // We strictly use markdownContent here to ensure we only keep what's in the text
    while ((match = regex.exec(markdownContent)) !== null) {
      usedIds.add(match[1]); // match[1] is the ID
    }

    // 2. Filter the pool
    const cleanedPool: Record<string, string> = {};
    let removedCount = 0;
    const totalBefore = Object.keys(pool).length;

    Object.keys(pool).forEach(key => {
      if (usedIds.has(key)) {
        cleanedPool[key] = pool[key];
      } else {
        removedCount++;
      }
    });
    
    const remaining = Object.keys(cleanedPool).length;

    // 3. Log Statistics
    console.group(`🧹 Image GC [${sourceLabel}]`);
    console.log(`%cTotal Images: ${totalBefore}`, 'color: gray');
    console.log(`%cUsed Images:  ${remaining}`, 'color: green; font-weight: bold');
    if (removedCount > 0) {
        console.log(`%cCleaned Up:   ${removedCount} (Trash Removed)`, 'color: orange; font-weight: bold');
    } else {
        console.log(`%cCleaned Up:   0`, 'color: gray');
    }
    console.groupEnd();

    return { cleanedPool, removedCount };
};

// NEW: Image Compression Helper (Updated to use WebP for transparency support)
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Resize logic: maintain aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Canvas context error"));
            return;
        }
        
        // UPDATED: Clear canvas instead of filling white to preserve transparency
        ctx.clearRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as WebP: Supports transparency AND high compression
        // Fallback to image/jpeg if browser doesn't support webp (rare nowadays)
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// NEW: StableImage Component with VFS support
// We use 'any' for props to handle react-markdown specific props like 'node' comfortably
const StableImage = ({ src, alt, imagePool, node, ...props }: any) => {
  const [blobSrc, setBlobSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    setIsLoading(true);

    // 1. Handle Virtual File System (local://)
    if (src.startsWith('local://')) {
      const imgId = src.replace('local://', '');
      const localData = imagePool?.[imgId];
      
      if (localData) {
        if (isMounted) {
            setBlobSrc(localData);
            setIsLoading(false);
        }
      } else {
        // Fallback or error state for missing local image
        console.warn(`Image ID ${imgId} not found in pool.`);
        if (isMounted) setIsLoading(false);
      }
      return; 
    }

    // 2. Handle External Images via Proxy
    const proxyUrl = getCorsFriendlyUrl(src);

    fetch(proxyUrl)
      .then(response => response.blob())
      .then(blob => {
        if (isMounted) {
          const objectUrl = URL.createObjectURL(blob);
          setBlobSrc(objectUrl);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load image blob", err);
        if (isMounted) {
          setBlobSrc(proxyUrl);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (blobSrc && blobSrc.startsWith('blob:')) {
        URL.revokeObjectURL(blobSrc);
      }
    };
  }, [src, imagePool]); 

  if (isLoading) {
    return (
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-300">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
    );
  }

  return (
    <img 
      src={blobSrc || ""} 
      alt={alt} 
      {...props} 
      className="w-full h-auto rounded-lg shadow-sm mx-auto block object-cover"
    />
  );
};

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
const STORAGE_KEY_VIEW_MODE = 'markdown_poster_view_mode';

// Max History Steps
const MAX_HISTORY_SIZE = 10;

// Helper to determine if a theme is dark-based (for Writing Mode contrast)
const isThemeDark = (theme: BorderTheme) => {
  return [BorderTheme.Neon, BorderTheme.Ocean, BorderTheme.Poster].includes(theme);
};

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
    return (saved as BorderTheme) || BorderTheme.MacOS;
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

  // 8. View Mode (Poster vs Writing)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
    return (saved as ViewMode) || ViewMode.Poster;
  });

  // 9. Image Pool (Virtual File System)
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
    localStorage.setItem(STORAGE_KEY_VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IMAGE_POOL, JSON.stringify(imagePool));
    } catch (e) {
      console.warn("LocalStorage quota exceeded.", e);
    }
  }, [imagePool]);

  // ---------------------------

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false); 
  const [exportVersion, setExportVersion] = useState(0);
  const [exportAction, setExportAction] = useState<'download' | 'copy' | null>(null);
  const [leftWidth, setLeftWidth] = useState(50); 
  
  const exportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const getThemeStyles = (themeName: BorderTheme): BorderStyleConfig => {
    switch (themeName) {
      case BorderTheme.Poster:
        return {
          frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600", 
          card: "bg-transparent", 
          content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl min-h-[600px]",
          prose: "prose-slate prose-lg",
          header: "hidden",
          watermarkColor: "text-white/80"
        };
      case BorderTheme.Sunset:
        return {
          frame: "bg-[#fff7ed]",
          card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50",
          content: "bg-transparent text-gray-800",
          prose: "prose-orange prose-headings:text-orange-900",
          header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2",
          watermarkColor: "text-orange-300"
        };
      case BorderTheme.Ocean:
        return {
          frame: "bg-[#0f172a]",
          card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative",
          content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50",
          prose: "prose-invert prose-headings:text-cyan-200 prose-a:text-cyan-400 [&_td]:text-cyan-50 [&_th]:text-cyan-200",
          header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2",
          watermarkColor: "text-cyan-800"
        };
      case BorderTheme.Candy:
        return {
          frame: "bg-[#fdf2f8]",
          card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden",
          content: "bg-yellow-50/50 text-gray-800 font-comic",
          prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600",
          header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3",
          watermarkColor: "text-pink-300"
        };
      case BorderTheme.Neon:
        return {
          frame: "bg-[#171717]",
          card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden",
          content: "bg-gray-900 text-pink-50",
          prose: "prose-invert prose-p:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 [&_td]:text-pink-50 [&_th]:text-pink-400",
          watermarkColor: "text-pink-900"
        };
      case BorderTheme.Sketch:
        return {
          frame: "bg-[#f5f5f4]",
          card: "bg-white sketch-border p-2",
          content: "bg-transparent text-gray-900 font-comic", 
          prose: "prose-slate prose-headings:font-comic",
          watermarkColor: "text-stone-400"
        };
      case BorderTheme.Retro:
        return {
          frame: "bg-[#e5dfce]",
          card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl",
          content: "bg-[#fdf6e3] text-[#657b83]",
          prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif",
          watermarkColor: "text-[#b58900] opacity-40"
        };
      case BorderTheme.Glass:
        return {
          frame: "bg-gradient-to-br from-indigo-100 to-purple-100",
          card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5",
          content: "bg-transparent text-gray-900",
          prose: "prose-gray prose-headings:text-gray-900 font-sans",
          watermarkColor: "text-indigo-300"
        };
      case BorderTheme.Minimal:
        return {
          frame: "bg-[#f9fafb]",
          card: "bg-white border border-gray-200 shadow-sm",
          content: "bg-white text-gray-900",
          prose: "prose-stone",
          watermarkColor: "text-gray-300"
        };
      case BorderTheme.MacOS:
      default:
        return {
          frame: "bg-[#f3f4f6]",
          card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
          header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2",
          content: "bg-white text-gray-800",
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

  // Maps LayoutTheme to typography classes
  const getLayoutClass = (layout: LayoutTheme) => {
    switch (layout) {
      case LayoutTheme.Classic:
        return 'font-serif tracking-tight prose-headings:font-serif';
      case LayoutTheme.Vibrant:
        // UPDATED: Added yellow background to em (italic) tags for Vibrant theme
        return 'font-mono tracking-wide prose-headings:font-mono prose-headings:font-black [&_em]:bg-yellow-200 dark:[&_em]:bg-yellow-600 [&_em]:text-black dark:[&_em]:text-white [&_em]:px-1 [&_em]:rounded-sm [&_em]:not-italic';
      case LayoutTheme.Base:
      default:
        return 'font-sans tracking-normal prose-headings:font-sans';
    }
  };

  // Dynamic padding style object
  const getFramePaddingClass = (val: PaddingSize) => {
    switch (val) {
        case PaddingSize.Narrow: return 'p-4 sm:p-6';
        case PaddingSize.Wide: return 'p-8 sm:p-16';
        case PaddingSize.Medium: default: return 'p-6 sm:p-10';
    }
  };

  const currentStyle = useMemo(() => getThemeStyles(theme), [theme]);

  const handleExport = (type: 'download' | 'copy') => {
    const { cleanedPool, removedCount } = cleanImagePool(imagePool, markdown, 'Pre-Export');
    
    if (removedCount > 0) {
        setImagePool(cleanedPool);
    }

    setIsExporting(true);
    setExportAction(type);
    setExportVersion(v => v + 1);
  };

  // NEW: Handle Zip Export
  const handleExportZip = async () => {
    if (isExportingZip) return;
    setIsExportingZip(true);

    try {
        const zip = new JSZip();
        const assetsFolder = zip.folder("assets");
        
        let processedMarkdown = markdown;
        let networkImageCounter = 0;
        const replacements = new Map<string, string>(); 
        
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        const matches = [...markdown.matchAll(imageRegex)];
        
        for (const match of matches) {
            const originalSrc = match[2];
            if (replacements.has(originalSrc)) continue;

            try {
                if (originalSrc.startsWith('local://')) {
                    const imgId = originalSrc.replace('local://', '');
                    const base64Data = imagePool[imgId];
                    
                    if (base64Data) {
                        const mime = base64Data.split(';')[0].split(':')[1];
                        const ext = getExtensionFromMime(mime);
                        const filename = `${imgId}.${ext}`;
                        const blob = dataURItoBlob(base64Data);
                        assetsFolder?.file(filename, blob);
                        replacements.set(originalSrc, `./assets/${filename}`);
                    }
                } else if (originalSrc.startsWith('http')) {
                    const fetchUrl = getCorsFriendlyUrl(originalSrc);
                    const response = await fetch(fetchUrl);
                    if (!response.ok) throw new Error(`Failed to fetch ${originalSrc}`);
                    
                    const blob = await response.blob();
                    const ext = getExtensionFromMime(blob.type);
                    const filename = `net_img_${Date.now()}_${networkImageCounter}.${ext}`;
                    networkImageCounter++;

                    assetsFolder?.file(filename, blob);
                    replacements.set(originalSrc, `./assets/${filename}`);
                }
            } catch (err) {
                console.error(`Failed to process image: ${originalSrc}`, err);
            }
        }

        replacements.forEach((newPath, oldSrc) => {
            // Fix: replaceAll is not supported in ES2020 target, using split/join instead
            processedMarkdown = processedMarkdown.split(`(${oldSrc})`).join(`(${newPath})`);
        });

        zip.file("index.md", processedMarkdown);
        const content = await zip.generateAsync({ type: "blob" });
        const saveAs = (FileSaver as any).saveAs || FileSaver;
        saveAs(content, `markdown-project-${Date.now()}.zip`);

    } catch (e) {
        console.error("Export Zip Failed", e);
        alert("打包导出失败，请检查网络或重试。");
    } finally {
        setIsExportingZip(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `markdown-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (exportVersion === 0 || !exportAction) return; 

    const performExport = async () => {
      if (!exportRef.current) return;

      try {
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 800)));
        const images = Array.from(exportRef.current.querySelectorAll('img')) as HTMLImageElement[];
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
            });
        }));
        await new Promise(resolve => setTimeout(resolve, 200));

        const options = { 
          pixelRatio: 2,
          skipAutoScale: true,
          cacheBust: false, 
        };

        if (exportAction === 'download') {
            const dataUrl = await toPng(exportRef.current, options);
            const link = document.createElement('a');
            link.download = `markdownposter-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } else if (exportAction === 'copy') {
            const blob = await toBlob(exportRef.current, options);
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ [blob.type]: blob })
                ]);
                alert('图片已复制到剪贴板！'); 
            }
        }
      } catch (error) {
        console.error('Export failed', error);
        alert('操作失败，请重试。');
      } finally {
        setIsExporting(false);
        setExportAction(null);
      }
    };

    performExport();
  }, [exportVersion, exportAction]);

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
        <div className={`flex-1 flex flex-col min-w-0 relative transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1d23]' : 'bg-gray-100/80'}`}>
          
          <PreviewControlBar 
            currentTheme={theme} 
            setTheme={setTheme} 
            // New props
            layoutTheme={layoutTheme}
            setLayoutTheme={setLayoutTheme}
            padding={padding}
            setPadding={setPadding}
            watermarkAlign={watermarkAlign}
            setWatermarkAlign={setWatermarkAlign}

            onExport={() => handleExport('download')}
            onCopyImage={() => handleExport('copy')}
            
            onSaveMarkdown={handleDownloadMarkdown}
            onExportZip={handleExportZip}
            isExportingZip={isExportingZip}
            
            isExporting={isExporting}
            showWatermark={showWatermark}
            setShowWatermark={setShowWatermark}
            watermarkText={watermarkText}
            setWatermarkText={setWatermarkText}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isDarkMode={isDarkMode}
            
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          {/* Conditional Rendering based on ViewMode */}
          {viewMode === ViewMode.Poster ? (
             /* --- POSTER MODE RENDER --- */
             <div className={`flex-1 overflow-y-auto flex flex-col items-center transition-all duration-500 [background-size:20px_20px] ${
                isDarkMode 
                  ? 'bg-[radial-gradient(#333842_1px,transparent_1px)]' 
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]'
            }`}>
               <div className="w-full pt-10 pb-24 px-8 flex justify-center min-h-min">
                <div 
                  ref={exportRef}
                  key={`export-container-${exportVersion}`}
                  // Updated: Use dynamic padding based on frame settings
                  className={`w-full md:w-[75%] max-w-none transition-all duration-300 ease-in-out flex flex-col ${getFramePaddingClass(padding)} ${currentStyle.frame}`}
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
                    
                    {/* Content Container with fixed padding now, since outer frame handles variable width */}
                    <div 
                        className={`p-10 prose max-w-none ${currentStyle.prose} ${currentStyle.content} ${getFontSizeClass(fontSize)} ${getLayoutClass(layoutTheme)} min-h-[500px] [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!overflow-hidden [&_pre]:!max-h-none [&>:last-child]:mb-0`}
                    >
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        urlTransform={(value) => value}
                        components={{
                          img: (props) => <StableImage {...props} imagePool={imagePool} />
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
          ) : (
            /* --- WRITING MODE RENDER --- */
            <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-colors duration-500 ${currentStyle.frame} px-8 md:px-16`}>
               <div className="w-full max-w-4xl mx-auto py-16 min-h-full">
                  <div className={`prose max-w-none ${isThemeDark(theme) ? 'prose-invert prose-p:text-[#abb2bf] prose-headings:text-[#d4cfbf]' : 'prose-slate prose-lg'} ${getFontSizeClass(fontSize)}`}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        urlTransform={(value) => value}
                        components={{
                          img: (props) => <StableImage {...props} imagePool={imagePool} />
                        }}
                      >
                        {markdown}
                      </ReactMarkdown>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}