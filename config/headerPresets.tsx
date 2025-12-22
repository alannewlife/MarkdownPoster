
import React from 'react';

/**
 * 顶部装饰元素预设字典 (Header Presets)
 * 
 * 这里定义了可以在 YAML 配置文件中通过 `customHeader` 字段引用的 JSX 组件。
 * 这样可以将"配置"与"核心渲染逻辑"分离。
 * 
 * 使用方法:
 * 1. 在这里添加新的 key-value，例如 'star': <div>...</div>
 * 2. 在 config/themeConfig.ts 的 YAML 中设置 customHeader: "star"
 */
export const HEADER_PRESETS: Record<string, React.ReactNode> = {
  // ---------------------------------------------------------------------------
  // [MacOS] 经典的红绿灯圆点
  // 通常配合父容器的 space-x-2 使用
  // ---------------------------------------------------------------------------
  'macos': (
    <>
      <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
      <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
    </>
  ),

  // ---------------------------------------------------------------------------
  // [Sunset] 日落大道的双色圆点
  // ---------------------------------------------------------------------------
  'sunset': (
    <div className="flex space-x-1">
      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
    </div>
  ),

  // ---------------------------------------------------------------------------
  // [Candy] 糖果甜心的几何图形
  // ---------------------------------------------------------------------------
  'candy': (
    <>
        <div className="w-4 h-4 rounded-full bg-pink-400 border-2 border-white"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white"></div>
        <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-white"></div>
    </>
  ),

  // ---------------------------------------------------------------------------
  // [Simple] 简单的灰色圆点 (示例扩展)
  // ---------------------------------------------------------------------------
  'simple': (
    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
  )
};
