
import { DEFAULT_WRITING_THEME_ID } from './writingThemes';

// -----------------------------------------------------------------------------
// 配置文件 (Config)
// 这是一个纯 YAML 格式的字符串。
// 这里的修改会直接影响海报模式的外观选项和默认值。
// -----------------------------------------------------------------------------

export const THEME_CONFIG_YAML = `
# ==============================================================================
# 全局默认设置 (Defaults)
# 当用户第一次打开应用或重置时使用的值
# ==============================================================================
defaults:
  theme: "MacOS"     # 默认边框主题 ID
  layout: "Base"     # 默认排版主题 ID
  writingTheme: "${DEFAULT_WRITING_THEME_ID}" # 默认写作/阅读主题 ID (引用自 writingThemes.ts)
  fontSize: "Medium" # 默认字号 ID
  padding: "Medium"  # 默认边距 ID
  
  # 署名(水印)默认配置
  watermark:
    show: true
    text: "人人智学社 rrzxs.com"  
    align: "text-center"

# ==============================================================================
# 1. 边框主题 (Border Themes)
# ==============================================================================
borderThemes:
  # ============================================================================
  # [组1] 窗口标题风格 (Window Styles)
  # ============================================================================
  
  # ----------------------------------------------------------------------------
  # [MacOS] 拟物风格
  # ----------------------------------------------------------------------------
  - id: "MacOS"
    name: "MacOS"
    preview: "bg-gray-100 border border-gray-300"
    frame: "bg-[#f3f4f6]"
    card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2"
    customHeader: "macos"
    content: "bg-white text-gray-800"
    prose: "prose-slate"
    watermarkColor: "text-gray-400"
    colors:
      primary: "#3b82f6"
      secondary: "#10b981"
      assist: "#f59e0b"

  # ----------------------------------------------------------------------------
  # [Win11] Windows 11
  # ----------------------------------------------------------------------------
  - id: "Win11"
    name: "Windows 11"
    preview: "bg-[#f3f3f3] border border-gray-300"
    frame: "bg-[#f3f3f3]"
    card: "bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
    header: "h-9 flex items-center px-0 bg-[#f3f3f3] border-b border-gray-200 text-gray-600 select-none"
    customHeader: "win11"
    content: "bg-white text-gray-900"
    prose: "prose-slate"
    watermarkColor: "text-gray-400"
    colors:
      primary: "#3b82f6"
      secondary: "#10b981"
      assist: "#f59e0b"

  # ----------------------------------------------------------------------------
  # [RetroGame] 像素游戏
  # ----------------------------------------------------------------------------
  - id: "RetroGame"
    name: "像素游戏"
    preview: "bg-gray-300 border-2 border-gray-500"
    frame: "bg-[#008080]"
    card: "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] p-1"
    header: "bg-[#000080] h-8 flex items-center px-2 space-x-2 mb-1"
    customHeader: "retro"
    content: "bg-white border-2 border-gray-500 border-b-white border-r-white p-4 text-black"
    prose: "prose-slate prose-headings:uppercase"
    watermarkColor: "text-white/60 font-mono"
    colors:
      primary: "#000080"
      secondary: "#008080"
      assist: "#ffbd2e"

  # ----------------------------------------------------------------------------
  # [Sunset] 日落大道
  # ----------------------------------------------------------------------------
  - id: "Sunset"
    name: "日落大道"
    preview: "bg-gradient-to-br from-orange-100 to-rose-100"
    frame: "bg-[#fff7ed]"
    card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50"
    content: "bg-transparent text-gray-800"
    header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2"
    customHeader: "sunset"
    prose: "prose-orange prose-headings:text-orange-900"
    watermarkColor: "text-orange-300"
    colors:
      primary: "#f97316"
      secondary: "#fb7185"
      assist: "#fef3c7"

  # ----------------------------------------------------------------------------
  # [Candy] 糖果甜心
  # ----------------------------------------------------------------------------
  - id: "Candy"
    name: "糖果甜心"
    preview: "bg-pink-50 border-2 border-pink-400"
    frame: "bg-[#fdf2f8]"
    card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden"
    content: "bg-yellow-50/50 text-gray-800"
    header: "bg-pink-100 border-b border-pink-200 h-12 flex items-center px-5 justify-between select-none"
    customHeader: "candy"
    prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600"
    watermarkColor: "text-pink-300"
    colors:
      primary: "#ec4899"
      secondary: "#a855f7"
      assist: "#fef08a"


  # ============================================================================
  # [组2] 边框/创意风格 (Framed/Light Styles)
  # ============================================================================

  # ----------------------------------------------------------------------------
  # [Minimal] 极简白
  # ----------------------------------------------------------------------------
  - id: "Minimal"
    name: "极简白"
    preview: "bg-white border border-gray-200"
    frame: "bg-[#f9fafb]" 
    card: "bg-white border border-gray-200 shadow-sm"
    content: "bg-white text-gray-900"
    prose: "prose-stone"
    watermarkColor: "text-gray-300"
    colors:
      primary: "#3b82f6"
      secondary: "#111827"
      assist: "#9ca3af"

  # ----------------------------------------------------------------------------
  # [Sketch] 手绘线稿
  # ----------------------------------------------------------------------------
  - id: "Sketch"
    name: "手绘线稿"
    preview: "bg-[#f5f5f4] border-2 border-gray-800"
    frame: "bg-[#f5f5f4]"
    card: "bg-white sketch-border p-2"
    content: "bg-transparent text-gray-900"
    prose: "prose-slate"
    watermarkColor: "text-stone-400"
    colors:
      primary: "#111827"
      secondary: "#3b82f6"
      assist: "#f59e0b"

  # ----------------------------------------------------------------------------
  # [Report] 商业报告
  # ----------------------------------------------------------------------------
  - id: "Report"
    name: "商业报告"
    preview: "bg-[#fbf9f5] relative overflow-hidden after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:border-l-2 after:border-t-2 after:border-[#8B1D1D] after:content-[''] before:absolute before:bottom-1 before:right-1 before:w-3 before:h-3 before:border-r-2 before:border-b-2 before:border-[#8B1D1D] before:content-['']"
    frame: "bg-[#e5e5e5]"
    card: "bg-[#fbf9f5] shadow-2xl relative"
    header: "" 
    customDecor: "report-brackets"
    content: "bg-transparent text-[#2d2a26]"
    prose: "prose-stone prose-headings:font-serif prose-headings:text-[#8B1D1D] prose-headings:font-bold prose-strong:text-[#8B1D1D] prose-blockquote:border-l-[#8B1D1D] prose-a:text-[#b91c1c]"
    watermarkColor: "text-[#8B1D1D]/50"
    colors:
      primary: "#8B1D1D"
      secondary: "#b91c1c"
      assist: "#fee2e2"

  # ----------------------------------------------------------------------------
  # [Ink] 水墨丹青
  # ----------------------------------------------------------------------------
  - id: "Ink"
    name: "水墨丹青"
    preview: "bg-[#f4f1e8] border-double border-4 border-stone-600"
    frame: "bg-[#eaddcf]" 
    card: "bg-[#fdfbf7] border-4 border-double border-[#57534e] shadow-xl relative"
    customDecor: "ink-corners"
    content: "bg-[#fdfbf7] text-[#292524]"
    prose: "prose-stone prose-headings:text-[#1c1917] prose-blockquote:border-l-[#44403c]"
    watermarkColor: "text-[#57534e]"
    colors:
      primary: "#1c1917"
      secondary: "#44403c"
      assist: "#eaddcf"

  # ----------------------------------------------------------------------------
  # [Retro] 复古报刊
  # ----------------------------------------------------------------------------
  - id: "Retro"
    name: "复古报刊"
    preview: "bg-[#fdf6e3] border-double border-4 border-[#b58900]"
    frame: "bg-[#e5dfce]"
    card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl"
    content: "bg-[#fdf6e3] text-[#657b83]"
    prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2]"
    watermarkColor: "text-[#b58900] opacity-40"
    colors:
      primary: "#b58900"
      secondary: "#268bd2"
      assist: "#eee8d5"

  # ----------------------------------------------------------------------------
  # [Glass] 磨砂玻璃 (allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Glass"
    name: "磨砂玻璃"
    allowCustomColor: true
    preview: "bg-gradient-to-br from-indigo-100 to-purple-100 border border-white"
    frame: "bg-gradient-to-br from-indigo-100 to-purple-100"
    card: "bg-white/40 backdrop-blur-xl shadow-2xl rounded-2xl"
    content: "bg-transparent text-gray-900"
    prose: "prose-gray prose-headings:text-gray-900"
    watermarkColor: "text-indigo-300"
    colors:
      primary: "#6366f1"
      secondary: "#a926d9"
      assist: "#49bcdf"


  # ============================================================================
  # [组3] 深色/暗黑风格 (Dark Styles)
  # ============================================================================

  # ----------------------------------------------------------------------------
  # [Neon] 赛博霓虹 (allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Neon"
    name: "赛博霓虹"
    isDark: true
    allowCustomColor: true
    preview: "bg-gray-900 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
    frame: "bg-[#171717]"
    card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden"
    content: "bg-gray-900 text-pink-50"
    prose: "prose-invert prose-p:text-pink-100 prose-li:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 prose-blockquote:text-pink-200 prose-blockquote:border-pink-500 [&_td]:text-pink-50 [&_th]:text-pink-400"
    watermarkColor: "text-pink-900"
    colors:
      primary: "#ec4899"
      secondary: "#22d3ee"
      assist: "#facc15"

  # ----------------------------------------------------------------------------
  # [Aurora] 极光幻境 (allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Aurora"
    name: "极光幻境"
    isDark: true
    allowCustomColor: true
    preview: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    card: "bg-transparent"
    content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl min-h-[600px]"
    prose: "prose-slate"
    watermarkColor: "text-white/80"
    colors:
      primary: "#6366f1"
      secondary: "#a926d9"
      assist: "#49bcdf"

  # ----------------------------------------------------------------------------
  # [Radiance] 流光溢彩 (allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Radiance"
    name: "流光溢彩"
    isDark: true
    allowCustomColor: true
    preview: "bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500"
    frame: "bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500"
    card: "bg-transparent"
    content: "bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 rounded-2xl min-h-[600px] text-white"
    prose: "prose-invert prose-headings:text-white prose-p:text-white/90 prose-strong:text-yellow-100 prose-a:text-yellow-200 [&_td]:text-white/90 [&_th]:text-white [&_tr]:border-white/20"
    watermarkColor: "text-white/60"
    colors:
      primary: "#14b8a6"
      secondary: "#2668d9"
      assist: "#49df5d"

# ==============================================================================
# 2. 排版主题 (Layout Themes)
# 使用 CSS 变量 --mp-primary, --mp-secondary, --mp-assist 来绑定颜色
# ==============================================================================
layoutThemes:
  - id: "Base"
    name: "标准"
    className: "font-sans tracking-normal prose-headings:font-sans prose-headings:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:border-[var(--mp-primary)] prose-h3:mt-7 prose-h3:mb-3 prose-blockquote:rounded-lg prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:bg-[var(--mp-assist)] prose-blockquote:border-l-4 prose-blockquote:border-[var(--mp-primary)] prose-hr:my-10 prose-ul:my-5 prose-ol:my-5 prose-li:my-1 prose-a:text-[var(--mp-primary)] prose-strong:text-[var(--mp-secondary)] prose-em:bg-[var(--mp-assist)] prose-em:px-1 prose-em:rounded-sm prose-em:not-italic prose-li:marker:text-[var(--mp-secondary)]"

  - id: "Classic"
    name: "经典"
    className: "font-serif tracking-tight prose-headings:font-serif prose-headings:font-bold prose-h1:tracking-tight prose-h1:leading-tight prose-h2:mt-12 prose-h2:mb-5 prose-h2:tracking-tight prose-h2:border-b-2 prose-h2:border-[var(--mp-primary)] prose-h2:pb-2 prose-p:leading-8 prose-blockquote:pl-6 prose-blockquote:pr-2 prose-blockquote:py-0 prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-[var(--mp-primary)] prose-hr:my-12 prose-a:text-[var(--mp-secondary)] prose-strong:text-[var(--mp-primary)] prose-em:bg-[var(--mp-assist)] prose-em:px-1 prose-em:not-italic"

  - id: "Vibrant"
    name: "活泼"
    className: "font-mono tracking-wide prose-headings:font-mono prose-headings:font-black prose-headings:text-[var(--mp-primary)] prose-h2:mt-10 prose-h2:mb-4 prose-h2:inline-block prose-h2:rounded-xl prose-h2:px-3 prose-h2:py-1 prose-h2:bg-[var(--mp-primary)] prose-h2:text-white/90 prose-h3:mt-7 prose-h3:mb-3 prose-h3:inline-block prose-h3:rounded-lg prose-h3:px-2 prose-h3:py-0.5 prose-h3:border prose-h3:border-[var(--mp-secondary)] prose-h3:text-[var(--mp-secondary)] prose-blockquote:rounded-xl prose-blockquote:py-4 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:bg-[var(--mp-assist)] prose-hr:my-10 prose-ul:my-5 prose-li:my-1 prose-a:text-[var(--mp-primary)] prose-strong:text-[var(--mp-secondary)] prose-em:bg-[var(--mp-assist)] prose-em:px-1 prose-em:rounded-sm prose-em:not-italic prose-li:marker:text-[var(--mp-primary)]"

# ==============================================================================
# 3. 字体大小 (Font Sizes)
# ==============================================================================
fontSizes:
  - id: "Small"
    label: "S"
    className: "prose-sm"
    icon: "text-xs"

  - id: "Medium"
    label: "M"
    className: "prose-base"
    icon: "text-sm"

  - id: "Large"
    label: "L"
    className: "prose-xl"
    icon: "text-lg"

# ==============================================================================
# 4. 边距大小 (Paddings)
# ==============================================================================
paddings:
  - id: "Narrow"
    label: "窄"
    className: "p-4 sm:p-6"

  - id: "Medium"
    label: "中"
    className: "p-6 sm:p-10"

  - id: "Wide"
    label: "宽"
    className: "p-8 sm:p-16"
`;