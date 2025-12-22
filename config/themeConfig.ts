
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
  
  # 署名(水印)默认配置
  watermark:
    show: true
    text: "人人智学社 rrzxs.com"  
    align: "text-right"

# ==============================================================================
# 1. 边框主题 (Border Themes)
# 
# [海报结构图解 / Anatomy]
# -----------------------------------------------------------
# |  frame (整个背景视窗/外框)                                |
# |   ___________________________________________________   |
# |  |  card (卡片容器: 控制圆角/阴影/边框线)               |  |
# |  |   _____________________________________________   |  |
# |  |  |  header (可选: 顶部栏/状态栏)                 |  |  |
# |  |  |  [ customHeader 装饰元素 ]                   |  |  |
# |  |  |_____________________________________________|  |  |
# |  |   _____________________________________________   |  |
# |  |  |  content (内容区域: 背景色/默认文字色)         |  |  |
# |  |  |                                             |  |  |
# |  |  |  [ Title ] (由 prose-headings 控制)          |  |  |
# |  |  |  Paragraph text... (由 prose-p 控制)         |  |  |
# |  |  |_____________________________________________|  |  |
# |  |___________________________________________________|  |
# |                                                         |
# |      watermarkColor (底部署名颜色)                       |
# |_________________________________________________________|
#
# [字段详解字典]
# 
# 1. id / name: 
#    - 程序的唯一标识符和UI显示的名称。
#
# 2. frame (外层背景):
#    - bg-gray-100: 纯色背景。
#    - bg-gradient-to-br from-x to-y: 渐变背景。
#    - p-4: (不建议在此处设padding，padding由全局配置控制)。
#
# 3. card (卡片容器):
#    - bg-white: 卡片本身的颜色。
#    - rounded-xl: 圆角大小 (sm, md, lg, xl, 2xl, 3xl)。
#    - shadow-2xl: 投影深度 (sm, md, lg, xl, 2xl)。
#    - border: 描边 (border, border-2, border-4)。
#    - overflow-hidden: 确保内部内容不溢出圆角。
#    - backdrop-blur-xl: 毛玻璃模糊效果 (需配合透明背景)。
#
# 4. header (顶部装饰栏 - 可选):
#    - h-8 / h-10: 高度。
#    - flex items-center: 弹性布局，内容垂直居中。
#    - border-b: 底部细线。
#    - customHeader: 'macos' | 'sunset' | 'candy' (渲染特殊形状)。
#    
#    [扩展开发指南]:
#    自定义装饰元素的 JSX 代码已抽离到独立文件，修改更方便：
#    1. 打开 config/headerPresets.tsx
#    2. 在 HEADER_PRESETS 对象中添加新的 key 和对应的 JSX。
#    3. 回到此处(YAML)，设置 customHeader: "your-new-key" 即可。
#
# 5. content (内容区域):
#    - text-gray-900: 设定非 Markdown 元素的默认文字颜色。
#    - bg-transparent: 通常设为透明，透出 card 的背景。
#
# 6. prose (排版插件配置 - 核心文字颜色 & 元素样式):
#    Tailwind Typography 提供了非常细致的元素控制。
#    格式均为: prose-[元素]:样式类 (例如 prose-headings:text-blue-500)
#
#    [基础色阶] (必须选一个作为基底):
#    - prose-slate, prose-gray, prose-zinc, prose-neutral, prose-stone
#    - prose-invert (反色模式，用于深色背景，自动将黑色文字转为白色)
#
#    [可配置元素大全]:
#    1. 全局与标题
#       - prose-body: 正文默认文字
#       - prose-headings: 所有标题 (h1-h6)
#       - prose-h1 / prose-h2 / prose-h3 ...: 单独控制某级标题
#       - prose-p: 段落
#       - prose-lead: 导语 (文章开头的第一个大字号段落)
#
#    2. 强调与链接
#       - prose-a: 链接 (可控颜色/下划线/悬停)
#       - prose-strong: 加粗文本 (**text**)
#       - prose-em: 斜体文本 (*text*)
#
#    3. 引用与代码
#       - prose-blockquote: 引用块 (边框颜色/文字)
#       - prose-code: 行内代码 (\`code\`)
#       - prose-pre: 代码块容器
#
#    4. 列表
#       - prose-ol: 有序列表容器
#       - prose-ul: 无序列表容器
#       - prose-li: 列表项
#       - prose-marker: 列表前面的点(bullet)或数字(1.)的颜色
#
#    5. 表格与分割线
#       - prose-hr: 分割线 (---)
#       - prose-table: 表格容器
#       - prose-th: 表头
#       - prose-td: 单元格
#       - prose-tr: 表格行
#
#    6. 媒体
#       - prose-img: 图片
#       - prose-figure: 图片外层容器
#       - prose-figcaption: 图片标题/注脚
#
#    [高级用法 - 任意修改]:
#    如果 prose-xxx 不够用，可以使用 Tailwind 的任意子元素选择器 [&_tag]:
#    - [&_p]:text-red-500  (强制所有 p 变红)
#    - [&_.katex]:text-blue-500 (强制数学公式变蓝)
#
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
    content: "bg-yellow-50/50 text-gray-800 font-comic"
    header: "bg-pink-100 border-b-4 border-pink-400 h-10 flex items-center px-4 space-x-3"
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
    preview: "bg-white border border-gray-200" # 设置面板中的预览圆圈样式
    # frame: 极浅的灰色背景
    frame: "bg-[#f9fafb]" 
    # card: 纯白背景，极细的灰色边框，微弱阴影
    card: "bg-white border border-gray-200 shadow-sm"
    # content: 默认黑字
    content: "bg-white text-gray-900"
    # prose: 使用 Stone 色系 (偏暖灰)
    prose: "prose-stone"
    watermarkColor: "text-gray-300"

  # ----------------------------------------------------------------------------
  # [Sketch] 手绘线稿
  # ----------------------------------------------------------------------------
  - id: "Sketch"
    name: "手绘线稿"
    preview: "bg-[#f5f5f4] border-2 border-gray-800"
    frame: "bg-[#f5f5f4]"
    # card: sketch-border 是 index.html 里定义的 CSS 类 (波浪线边框)
    card: "bg-white sketch-border p-2"
    content: "bg-transparent text-gray-900 font-comic"
    # prose: 标题强制使用 Comic 字体
    prose: "prose-slate prose-headings:font-comic"
    watermarkColor: "text-stone-400"

  # ----------------------------------------------------------------------------
  # [Retro] 复古报刊
  # ----------------------------------------------------------------------------
  - id: "Retro"
    name: "复古报刊"
    preview: "bg-[#fdf6e3] border-double border-4 border-[#b58900]"
    frame: "bg-[#e5dfce]"
    # card: 双实线边框 (border-double)，深黄色 (#b58900)
    card: "bg-[#fdf6e3] border-4 border-double border-[#b58900] rounded-sm shadow-xl"
    content: "bg-[#fdf6e3] text-[#657b83]"
    # prose: 强制标题为深黄色，链接为蓝色
    prose: "prose-headings:text-[#b58900] prose-a:text-[#268bd2] font-serif"
    watermarkColor: "text-[#b58900] opacity-40"

  # ----------------------------------------------------------------------------
  # [Glass] 磨砂玻璃
  # ----------------------------------------------------------------------------
  - id: "Glass"
    name: "磨砂玻璃"
    preview: "bg-gradient-to-br from-indigo-100 to-purple-100 border border-white"
    frame: "bg-gradient-to-br from-indigo-100 to-purple-100"
    # card: 
    # - bg-white/40: 40%不透明度的白色
    # - backdrop-blur-xl: 背景模糊滤镜
    # - ring-1: 1px的内发光微边框
    card: "bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl ring-1 ring-black/5"
    content: "bg-transparent text-gray-900"
    prose: "prose-gray prose-headings:text-gray-900 font-sans"
    watermarkColor: "text-indigo-300"


  # ============================================================================
  # [组3] 深色/暗黑风格 (Dark Styles)
  # ============================================================================

  # ----------------------------------------------------------------------------
  # [Ocean] 深海极客 (深色模式示例)
  # ----------------------------------------------------------------------------
  - id: "Ocean"
    name: "深海极客"
    isDark: true # 告诉编辑器 UI 切换到深色适配
    preview: "bg-cyan-950 border border-cyan-500"
    frame: "bg-[#0f172a]"
    # card: 深青色背景，青色发光边框/阴影
    card: "bg-cyan-950 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden relative"
    content: "bg-gradient-to-b from-cyan-900/50 to-blue-950/50 text-cyan-50"
    header: "bg-cyan-900/40 border-b border-cyan-800 h-8 flex items-center justify-end px-4 space-x-2"
    # prose 详解:
    # - prose-invert: 基础反色
    # - prose-p:text-cyan-50: 强制段落文字为亮青白色 (解决默认黑色看不见的问题)
    # - prose-headings:text-cyan-200: 标题为亮青色
    # - prose-blockquote:text-cyan-100: 引用块文字颜色
    prose: "prose-invert prose-p:text-cyan-50 prose-li:text-cyan-50 prose-headings:text-cyan-200 prose-strong:text-cyan-200 prose-blockquote:text-cyan-100 prose-blockquote:border-cyan-500 prose-a:text-cyan-400 [&_td]:text-cyan-50 [&_th]:text-cyan-200"
    watermarkColor: "text-cyan-800"

  # ----------------------------------------------------------------------------
  # [Neon] 赛博霓虹 (深色模式示例)
  # ----------------------------------------------------------------------------
  - id: "Neon"
    name: "赛博霓虹"
    isDark: true
    preview: "bg-gray-900 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
    frame: "bg-[#171717]"
    # card: 深灰背景，粉色霓虹发光边框
    card: "bg-gray-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] rounded-xl overflow-hidden"
    content: "bg-gray-900 text-pink-50"
    # prose 详解:
    # - prose-invert: 基础反色
    # - prose-p:text-pink-100: 段落为粉白色
    # - prose-strong:text-cyan-300: 强调文字为青色 (撞色设计)
    # - prose-code:text-yellow-300: 代码为黄色
    prose: "prose-invert prose-p:text-pink-100 prose-li:text-pink-100 prose-headings:text-pink-400 prose-strong:text-cyan-300 prose-code:text-yellow-300 prose-blockquote:text-pink-200 prose-blockquote:border-pink-500 [&_td]:text-pink-50 [&_th]:text-pink-400"
    watermarkColor: "text-pink-900"

  # ----------------------------------------------------------------------------
  # [Poster] 纯享模式
  # ----------------------------------------------------------------------------
  - id: "Poster"
    name: "海报模式"
    isDark: true
    preview: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    # frame: 强烈的紫粉渐变背景
    frame: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    card: "bg-transparent"
    # content: 使用半透明白底 (white/95) 承载文字，自身带圆角和阴影
    content: "bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl min-h-[600px]"
    prose: "prose-slate"
    watermarkColor: "text-white/80"

# ==============================================================================
# 2. 排版主题 (Layout Themes)
# 
# 控制海报内部文字的"气质"与"性格"。
# 通过组合字体族(Font Family)、字间距(Tracking)和特殊的排版修饰符来实现。
#
# [字段详解]
# - id, name: 标识符与显示名称。
# - className: 一组 Tailwind CSS 类名，叠加在 content 容器上。
#   常用类说明:
#   - font-sans / font-serif / font-mono: 字体族。
#   - tracking-tight / tracking-wide: 字间距控制。
#   - prose-headings:font-xxx: 单独控制标题字体。
#   - [&_em]:bg-xxx: 自定义任意子元素样式，这里修改了斜体(em)的样式。
# ==============================================================================
layoutThemes:
  # ----------------------------------------------------------------------------
  # [Base] 标准
  # ----------------------------------------------------------------------------
  - id: "Base"
    name: "标准"
    # className: 
    # - font-sans: 使用系统无衬线字体 (如 Helvetica, Arial, PingFang SC)
    # - tracking-normal: 标准字间距
    # - prose-headings:font-sans: 标题也保持无衬线
    className: "font-sans tracking-normal prose-headings:font-sans"

  # ----------------------------------------------------------------------------
  # [Classic] 经典
  # ----------------------------------------------------------------------------
  - id: "Classic"
    name: "经典"
    # className:
    # - font-serif: 使用衬线字体 (如 Times New Roman, Songti SC)，适合文学/正式内容
    # - tracking-tight: 稍微收紧字间距，更有报刊印刷感
    # - prose-headings:font-serif: 标题保持衬线
    className: "font-serif tracking-tight prose-headings:font-serif"

  # ----------------------------------------------------------------------------
  # [Vibrant] 活泼
  # ----------------------------------------------------------------------------
  - id: "Vibrant"
    name: "活泼"
    # className (复杂样式详解):
    # - font-mono: 使用等宽字体 (如 Courier, JetBrains Mono)，带有科技/手账感
    # - tracking-wide: 增加字间距，呼吸感更强
    # - prose-headings:font-black: 标题使用极粗字重
    # - [&_em]:... : 自定义斜体样式 (Markdown中的 *text*)
    #    - bg-yellow-200: 给斜体文字加黄色背景 (记号笔效果)
    #    - text-black: 强制文字黑色
    #    - not-italic: 去掉倾斜，只保留高亮
    #    - px-1 rounded-sm: 内边距和圆角
    className: "font-mono tracking-wide prose-headings:font-mono prose-headings:font-black [&_em]:bg-yellow-200 dark:[&_em]:bg-yellow-600 [&_em]:text-black dark:[&_em]:text-white [&_em]:px-1 [&_em]:rounded-sm [&_em]:not-italic"

# ==============================================================================
# 3. 字体大小 (Font Sizes)
# 
# 基于 Tailwind Typography (prose) 插件的比例缩放系统。
# 注意：prose-sm/base/xl 不仅影响字号，还会自动调整行高(line-height)和段落间距(margin)。
# ==============================================================================
fontSizes:
  # ----------------------------------------------------------------------------
  # [Small] 紧凑 (Small)
  # ----------------------------------------------------------------------------
  - id: "Small"
    label: "S"
    # prose-sm: 适合长文信息密度高的情况
    className: "prose-sm"
    # icon: UI面板上显示的预览图标大小类名
    icon: "text-xs"

  # ----------------------------------------------------------------------------
  # [Medium] 适中 (Default)
  # ----------------------------------------------------------------------------
  - id: "Medium"
    label: "M"
    # prose-base: 标准 1rem (16px) 基础字号
    className: "prose-base"
    icon: "text-sm"

  # ----------------------------------------------------------------------------
  # [Large] 宽松 (Large)
  # ----------------------------------------------------------------------------
  - id: "Large"
    label: "L"
    # prose-xl: 适合金句、海报标题，字号大，冲击力强
    className: "prose-xl"
    icon: "text-lg"

# ==============================================================================
# 4. 边距大小 (Paddings)
# 
# 控制海报内容(Markdown)与卡片边缘之间的留白区域。
# [响应式边距说明]
# 这里的 className 通常包含两个值，例如 "p-6 sm:p-10"：
# 1. p-6: 默认值，适用于手机端 (小屏幕)。
# 2. sm:p-10: "sm:" 前缀表示当屏幕宽度大于 640px (平板/电脑) 时生效的值。
# 这样设计是为了保证在手机上不浪费空间，而在电脑上拥有足够的呼吸感。
# ==============================================================================
paddings:
  # ----------------------------------------------------------------------------
  # [Narrow] 窄边距
  # ----------------------------------------------------------------------------
  - id: "Narrow"
    label: "窄"
    # className:
    # - p-4: 移动端 (16px)
    # - sm:p-6: 桌面端 (24px)
    className: "p-4 sm:p-6"

  # ----------------------------------------------------------------------------
  # [Medium] 适中
  # ----------------------------------------------------------------------------
  - id: "Medium"
    label: "中"
    # className:
    # - p-6: 移动端 (24px)
    # - sm:p-10: 桌面端 (40px) - 默认推荐值
    className: "p-6 sm:p-10"

  # ----------------------------------------------------------------------------
  # [Wide] 宽边距 (留白艺术)
  # ----------------------------------------------------------------------------
  - id: "Wide"
    label: "宽"
    # className:
    # - p-8: 移动端 (32px)
    # - sm:p-16: 桌面端 (64px) - 适合诗歌或短句
    className: "p-8 sm:p-16"
`;
