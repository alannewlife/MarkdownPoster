
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
  theme: "Minimal"   # 默认边框主题 ID
  layout: "Base"     # 默认排版主题 ID
  fontSize: "Medium" # 默认字号 ID
  padding: "Medium"  # 默认边距 ID
  
  # 新增：署名(水印)默认配置
  watermark:
    show: true
    # 初始默认水印文案 (用户首次进入时的默认值)
    text: "人人智学社 rrzxs.com"  
    align: "text-right"          # 可选: text-left, text-center, text-right

# ==============================================================================
# 1. 边框主题 (Border Themes)
# 
# [字段说明 - 为什么有的主题字段不一样？]
# 不同的主题拥有不同的 DOM 结构，因此我们使用"可选字段"来控制渲染逻辑：
# 
# - id, name: (必填) 唯一标识和显示名称
# - frame:    (必填) 最外层背景样式 (Tailwind class)
# - card:     (必填) 内容卡片容器样式 (边框、圆角、阴影)
# - content:  (必填) 文字区域背景色和文字颜色
# - prose:    (必填) 排版插件样式 (如 prose-slate, prose-invert)
# 
# [可选字段 - 仅在需要时配置]:
# - header:       如果存在，会渲染一个顶部栏容器
# - dots:         (需要配合 header) 如果为 true，会在顶部栏渲染 MacOS 风格红绿灯
# - customHeader: (需要配合 header) 特殊值 'sunset' | 'candy'，渲染自定义形状的装饰
# - isDark:       如果为 true，UI 会切换到深色模式逻辑(调整文字对比度)
# ==============================================================================
borderThemes:
  # --- 基础风格 ---
  - id: "Minimal"
    name: "极简白"
    # 设计思路：最干净的白纸黑字，适合正式文档
    frame: "bg-[#f9fafb]"
    card: "bg-white border border-gray-200 shadow-sm"
    content: "bg-white text-gray-900"
    prose: "prose-stone"
    watermarkColor: "text-gray-300"
    preview: "bg-white border border-gray-200"

  - id: "MacOS"
    name: "MacOS"
    # 设计思路：经典的窗口风格，带有标志性的红绿灯
    frame: "bg-[#f3f4f6]"
    card: "bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    # 这里的 header 字段触发了顶部栏的渲染
    header: "bg-gray-100 border-b border-gray-200 h-8 flex items-center px-4 space-x-2"
    content: "bg-white text-gray-800"
    prose: "prose-slate"
    watermarkColor: "text-gray-400"
    preview: "bg-gray-100 border border-gray-300"
    dots: true # 触发红绿灯组件渲染

  - id: "Glass"
    name: "磨砂玻璃"
    # 设计思路：现代 UI 风格，使用 backdrop-blur 实现毛玻璃效果
    frame: "bg-gradient-to-br from-indigo-100 to-purple-100"
    card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5"
    content: "bg-transparent text-gray-900"
    prose: "prose-gray prose-headings:text-gray-900 font-sans"
    watermarkColor: "text-indigo-300"
    preview: "bg-gradient-to-br from-indigo-100 to-purple-100 border border-white"

  # --- 艺术风格 ---
  - id: "Sketch"
    name: "手绘线稿"
    # 设计思路：模拟漫画或手绘草图，使用自定义 CSS 类 sketch-border
    frame: "bg-[#f5f5f4]"
    card: "bg-white sketch-border p-2"
    content: "bg-transparent text-gray-900 font-comic"
    prose: "prose-slate prose-headings:font-comic"
    watermarkColor: "text-stone-400"
    preview: "bg-[#f5f5f4] border-2 border-gray-800"

  - id: "Retro"
    name: "复古报刊"
    # 设计思路：泛黄的纸张，双线边框，衬线字体
    frame: "bg-[#e5dfce]"
    card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl"
    content: "bg-[#fdf6e3] text-[#657b83]"
    prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif"
    watermarkColor: "text-[#b58900] opacity-40"
    preview: "bg-[#fdf6e3] border-double border-4 border-[#b58900]"

  # --- 多彩风格 ---
  - id: "Sunset"
    name: "日落大道"
    # 设计思路：温暖的橙红色调，特殊的圆点装饰
    frame: "bg-[#fff7ed]"
    card: "bg-gradient-to-br from-orange-50 to-rose-50 border-4 border-orange-200 shadow-[0_20px_50px_-12px_rgba(251,146,60,0.5)] rounded-2xl overflow-hidden ring-4 ring-orange-100/50"
    content: "bg-transparent text-gray-800"
    header: "bg-orange-100/50 border-b border-orange-200/50 h-10 flex items-center px-4 space-x-2"
    prose: "prose-orange prose-headings:text-orange-900"
    watermarkColor: "text-orange-300"
    preview: "bg-gradient-to-br from-orange-100 to-rose-100"
    customHeader: "sunset" # 触发 Sunset 特有的两个圆点装饰

  - id: "Ocean"
    name: "深海极客"
    # 设计思路：暗色调，科技感，适合代码展示
    frame: "bg-[#0f172a]"
    card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative"
    content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50"
    header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2"
    prose: "prose-invert prose-headings:text-cyan-200 prose-a:text-cyan-400 [&_td]:text-cyan-50 [&_th]:text-cyan-200"
    watermarkColor: "text-cyan-800"
    preview: "bg-cyan-950 border border-cyan-500"
    isDark: true # 标记为深色主题，反转文字颜色

  - id: "Candy"
    name: "糖果甜心"
    # 设计思路：高饱和度的粉色，活泼的装饰
    frame: "bg-[#fdf2f8]"
    card: "bg-white border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-3xl overflow-hidden"
    content: "bg-yellow-50/50 text-gray-800 font-comic"
    header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3"
    prose: "prose-pink prose-headings:text-pink-600 prose-strong:text-purple-600"
    watermarkColor: "text-pink-300"
    preview: "bg-pink-50 border-2 border-pink-400"
    customHeader: "candy" # 触发 Candy 特有的三个彩色圆点

  - id: "Neon"
    name: "赛博霓虹"
    # 设计思路：高对比度，黑底粉字
    frame: "bg-[#171717]"
    card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden"
    content: "bg-gray-900 text-pink-50"
    prose: "prose-invert prose-p:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 [&_td]:text-pink-50 [&_th]:text-pink-400"
    watermarkColor: "text-pink-900"
    preview: "bg-gray-900 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
    isDark: true

  - id: "Poster"
    name: "海报模式"
    # 设计思路：纯背景色，无卡片边框，强调内容本身
    frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    card: "bg-transparent"
    content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl min-h-[600px]"
    prose: "prose-slate"
    watermarkColor: "text-white/80"
    preview: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    isDark: true

# ==============================================================================
# 2. 排版主题 (Layout Themes)
# 定义字体的样式（字体族、字重、特殊标记颜色等）
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
    # 这里定义了活泼主题复杂的 CSS 样式，例如 em 标签的黄色背景
    className: "font-mono tracking-wide prose-headings:font-mono prose-headings:font-black [&_em]:bg-yellow-200 dark:[&_em]:bg-yellow-600 [&_em]:text-black dark:[&_em]:text-white [&_em]:px-1 [&_em]:rounded-sm [&_em]:not-italic"

# ==============================================================================
# 3. 字体大小 (Font Sizes)
# className 对应 Tailwind 的 typography 插件类名
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
# 控制外框和卡片之间的距离
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
