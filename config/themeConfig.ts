
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
    # card: 大圆角(rounded-xl)，深阴影(shadow-2xl)
    card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    # header: 模拟窗口顶部，灰色背景+底边线
    header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2"
    customHeader: "macos" # 使用预设字典中的 'macos' 渲染红绿灯
    content: "bg-white text-gray-800"
    prose: "prose-slate"
    watermarkColor: "text-gray-400"

  # ----------------------------------------------------------------------------
  # [Win11] Windows 11 (NEW)
  # ----------------------------------------------------------------------------
  - id: "Win11"
    name: "Windows 11"
    preview: "bg-[#f3f3f3] border border-gray-300"
    frame: "bg-[#f3f3f3]"
    # UPDATED: Removed opacity from border to match MacOS solid border style
    card: "bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
    # Added border-b border-gray-200 to mimic the content separation
    header: "h-9 flex items-center px-0 bg-[#f3f3f3] border-b border-gray-200 text-gray-600 select-none"
    customHeader: "win11"
    content: "bg-white text-gray-900"
    prose: "prose-slate"
    watermarkColor: "text-gray-400"

  # ----------------------------------------------------------------------------
  # [RetroGame] 像素游戏
  # ----------------------------------------------------------------------------
  - id: "RetroGame"
    name: "像素游戏"
    preview: "bg-gray-300 border-2 border-gray-500"
    frame: "bg-[#008080]" # 经典的 Windows 默认青色背景
    # card: 经典的 Win95 浮雕效果 (border-t-white, border-b-black)
    card: "bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] p-1"
    # header: 深蓝色标题栏，白色文字
    header: "bg-[#000080] h-8 flex items-center px-2 space-x-2 mb-1"
    customHeader: "retro" # 像素按钮
    # [解耦] 移除了 font-mono，保留了边框颜色设定
    content: "bg-white border-2 border-gray-500 border-b-white border-r-white p-4 text-black"
    prose: "prose-slate prose-headings:uppercase"
    watermarkColor: "text-white/60 font-mono"

  # ----------------------------------------------------------------------------
  # [Sunset] 日落大道
  # ----------------------------------------------------------------------------
  - id: "Sunset"
    name: "日落大道"
    preview: "bg-gradient-to-br from-orange-100 to-rose-100"
    frame: "bg-[#fff7ed]"
    # card: 橙色到玫瑰色的微渐变背景，橙色外发光 (ring)
    card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50"
    content: "bg-transparent text-gray-800"
    header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2"
    customHeader: "sunset" # 特殊装饰
    prose: "prose-orange prose-headings:text-orange-900"
    watermarkColor: "text-orange-300"

  # ----------------------------------------------------------------------------
  # [Candy] 糖果甜心
  # ----------------------------------------------------------------------------
  - id: "Candy"
    name: "糖果甜心"
    preview: "bg-pink-50 border-2 border-pink-400"
    frame: "bg-[#fdf2f8]"
    # card: 粗粉色边框，硬阴影 (8px 8px 0px) 打造波普风
    card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden"
    # [解耦] 移除了 font-comic
    content: "bg-yellow-50/50 text-gray-800"
    # UPDATED: Header changed to pink background (consistent with style), removed text in preset
    header: "bg-pink-100 border-b border-pink-200 h-12 flex items-center px-5 justify-between select-none"
    customHeader: "candy"
    prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600"
    watermarkColor: "text-pink-300"


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

  # ----------------------------------------------------------------------------
  # [Sketch] 手绘线稿 (Moved here after Minimal)
  # ----------------------------------------------------------------------------
  - id: "Sketch"
    name: "手绘线稿"
    preview: "bg-[#f5f5f4] border-2 border-gray-800"
    frame: "bg-[#f5f5f4]"
    card: "bg-white sketch-border p-2"
    content: "bg-transparent text-gray-900"
    prose: "prose-slate"
    watermarkColor: "text-stone-400"

  # ----------------------------------------------------------------------------
  # [Report] 商业报告 (MOVED after Sketch, replaced Elegant)
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

  # ----------------------------------------------------------------------------
  # [Ink] 水墨丹青
  # ----------------------------------------------------------------------------
  - id: "Ink"
    name: "水墨丹青"
    preview: "bg-[#f4f1e8] border-double border-4 border-stone-600"
    # frame: 宣纸/米色背景
    frame: "bg-[#eaddcf]" 
    # card: 使用 border-4 border-double (双线), 配合 customDecor 的小方框
    # 颜色 #57534e 是 stone-600
    card: "bg-[#fdfbf7] border-4 border-double border-[#57534e] shadow-xl relative"
    # 添加新的装饰字段
    customDecor: "ink-corners"
    content: "bg-[#fdfbf7] text-[#292524]"
    prose: "prose-stone prose-headings:text-[#1c1917] prose-blockquote:border-l-[#44403c]"
    watermarkColor: "text-[#57534e]"

  # ----------------------------------------------------------------------------
  # [Retro] 复古报刊
  # ----------------------------------------------------------------------------
  - id: "Retro"
    name: "复古报刊"
    preview: "bg-[#fdf6e3] border-double border-4 border-[#b58900]"
    frame: "bg-[#e5dfce]"
    card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl"
    content: "bg-[#fdf6e3] text-[#657b83]"
    # [解耦] 移除了 font-serif
    prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2]"
    watermarkColor: "text-[#b58900] opacity-40"

  # ----------------------------------------------------------------------------
  # [Glass] 磨砂玻璃 (UPDATED: allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Glass"
    name: "磨砂玻璃"
    allowCustomColor: true
    preview: "bg-gradient-to-br from-indigo-100 to-purple-100 border border-white"
    frame: "bg-gradient-to-br from-indigo-100 to-purple-100"
    # UPDATED: Removed border-white/40 as requested. Pure glass effect.
    card: "bg-white/40 backdrop-blur-xl shadow-2xl rounded-2xl"
    content: "bg-transparent text-gray-900"
    # [解耦] 移除了 font-sans
    prose: "prose-gray prose-headings:text-gray-900"
    watermarkColor: "text-indigo-300"


  # ============================================================================
  # [组3] 深色/暗黑风格 (Dark Styles)
  # ============================================================================

  # ----------------------------------------------------------------------------
  # [Neon] 赛博霓虹 (UPDATED: allowCustomColor)
  # ----------------------------------------------------------------------------
  - id: "Neon"
    name: "赛博霓虹"
    isDark: true
    allowCustomColor: true
    preview: "bg-gray-900 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
    frame: "bg-[#171717]"
    # Default pink glow, overwritten by custom color if selected
    card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden"
    content: "bg-gray-900 text-pink-50"
    prose: "prose-invert prose-p:text-pink-100 prose-li:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 prose-blockquote:text-pink-200 prose-blockquote:border-pink-500 [&_td]:text-pink-50 [&_th]:text-pink-400"
    watermarkColor: "text-pink-900"

  # ----------------------------------------------------------------------------
  # [Aurora] 极光幻境 (Renamed from Poster)
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

  # ----------------------------------------------------------------------------
  # [Radiance] 流光溢彩
  # ----------------------------------------------------------------------------
  - id: "Radiance"
    name: "流光溢彩"
    isDark: true
    allowCustomColor: true
    # Distinct gradient (Teal/Blue/Purple) to separate from Aurora (Indigo/Pink)
    # Using 'via-blue-500' to center it on blue, contrasting Aurora's center of purple
    preview: "bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500"
    frame: "bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500"
    card: "bg-transparent"
    # content: 高通透毛玻璃，让背景色透出来
    content: "bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 rounded-2xl min-h-[600px] text-white"
    # prose: Added specific table styling ([&_td], [&_th], [&_tr]) to ensure white text in tables
    prose: "prose-invert prose-headings:text-white prose-p:text-white/90 prose-strong:text-yellow-100 prose-a:text-yellow-200 [&_td]:text-white/90 [&_th]:text-white [&_tr]:border-white/20"
    watermarkColor: "text-white/60"

# ==============================================================================
# 2. 排版主题 (Layout Themes)
# ==============================================================================
layoutThemes:
  - id: "Base"
    name: "标准"
    className: "font-sans tracking-normal prose-headings:font-sans"

  - id: "Classic"
    name: "经典"
    className: "font-serif tracking-tight prose-headings:font-serif"

  - id: "Vibrant"
    name: "活泼"
    className: "font-mono tracking-wide prose-headings:font-mono prose-headings:font-black [&_em]:bg-yellow-200 dark:[&_em]:bg-yellow-600 [&_em]:text-black dark:[&_em]:text-white [&_em]:px-1 [&_em]:rounded-sm [&_em]:not-italic"

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
