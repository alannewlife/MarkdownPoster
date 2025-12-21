





import React from 'react';
import { WeChatConfig, WeChatTheme, FontSize } from '../types';

interface WeChatAppearancePopoverProps {
  config: WeChatConfig;
  setConfig: (config: WeChatConfig) => void;
  isDarkMode: boolean;
  onClose: () => void;
}

const CodeThemes = [
  { label: 'Dark', value: 'vsDark' },
  { label: 'Light', value: 'vsLight' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Github', value: 'github' },
  { label: 'NightOwl', value: 'nightOwl' },
  { label: 'Oceanic', value: 'oceanicNext' },
];

const ThemeOptions = [
  { label: '经典', value: WeChatTheme.Default, color: 'bg-[#07c160]' },
  { label: '粉嫩', value: WeChatTheme.Lovely, color: 'bg-pink-400' },
  { label: '科技', value: WeChatTheme.Tech, color: 'bg-blue-600' },
  { label: '极简', value: WeChatTheme.Simple, color: 'bg-gray-800' },
];

export const WeChatAppearancePopover: React.FC<WeChatAppearancePopoverProps> = ({
  config,
  setConfig,
  isDarkMode,
  onClose
}) => {
  
  const updateConfig = (key: keyof WeChatConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className={`absolute top-full right-0 mt-2 w-[340px] rounded-xl shadow-2xl border p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right duration-200 select-none
      ${isDarkMode 
        ? 'bg-[#21252b] border-[#181a1f] text-gray-200 shadow-black/50' 
        : 'bg-white border-gray-200 text-gray-800 shadow-gray-200/50'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold opacity-90">公众号排版配置</h3>
        <button onClick={onClose} className="opacity-50 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* 1. Theme Selection */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">主题风格</label>
        <div className="grid grid-cols-4 gap-2">
          {ThemeOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => updateConfig('theme', t.value)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all
                 ${config.theme === t.value
                    ? (isDarkMode ? 'bg-[#3e4451] border-[#07c160] ring-1 ring-[#07c160]' : 'bg-green-50 border-green-500 ring-1 ring-green-500')
                    : (isDarkMode ? 'bg-[#2c313a] border-[#181a1f] hover:bg-[#323842]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                 }
              `}
            >
               <div className={`w-6 h-6 rounded-full shadow-sm ${t.color}`}></div>
               <span className="text-[10px] font-medium opacity-80">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Typography Controls (Font Size & Line Height) */}
      <div className="mb-5 space-y-3">
        {/* Font Size */}
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">正文字号</label>
            <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {[
                { label: '小', value: FontSize.Small },
                { label: '中', value: FontSize.Medium },
                { label: '大', value: FontSize.Large }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateConfig('fontSize', opt.value)}
                  className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${
                    config.fontSize === opt.value
                      ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
        </div>

        {/* Line Height */}
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">行间距</label>
            <div className={`flex w-[180px] p-0.5 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
              {[
                { label: '紧凑', value: 'compact' },
                { label: '舒适', value: 'comfortable' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateConfig('lineHeight', opt.value)}
                  className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${
                    config.lineHeight === opt.value
                      ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* 3. Code Block Theme */}
      <div className="mb-5">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">代码块主题</label>
        <div className="relative">
          <select 
             value={config.codeTheme}
             onChange={(e) => updateConfig('codeTheme', e.target.value)}
             className={`w-full text-xs p-2 rounded-lg border appearance-none focus:outline-none focus:ring-1 ${
                isDarkMode 
                ? 'bg-[#2c313a] border-[#181a1f] text-gray-200 focus:ring-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-400'
             }`}
          >
             {CodeThemes.map(theme => (
               <option key={theme.value} value={theme.value}>{theme.label}</option>
             ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* 4. Caption Format */}
      <div className="mb-5">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">图注格式</label>
        <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-[#2c313a] border-[#181a1f]' : 'bg-gray-100 border-gray-200'}`}>
          {[
             { label: 'Title优先', value: 'title' },
             { label: 'Alt优先', value: 'alt' },
             { label: '不显示', value: 'none' }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateConfig('captionType', opt.value)}
              className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${
                config.captionType === opt.value
                  ? (isDarkMode ? 'bg-[#3e4451] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Toggles */}
      <div className="space-y-3">
        {[
           { label: 'Mac 代码块', key: 'macCodeBlock' },
           { label: '代码块行号', key: 'lineNumbers' },
           { label: '微信外链转底部引用', key: 'linkReferences' },
           { label: '段落首行缩进', key: 'indent' },
           { label: '段落两端对齐', key: 'justify' },
        ].map((item) => (
           <div key={item.key} className="flex items-center justify-between">
              <label className="text-xs font-medium opacity-80">{item.label}</label>
              <button 
                onClick={() => updateConfig(item.key as keyof WeChatConfig, !config[item.key as keyof WeChatConfig])}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                    config[item.key as keyof WeChatConfig]
                    ? (isDarkMode ? 'bg-[#98c379]' : 'bg-green-500') 
                    : (isDarkMode ? 'bg-[#3e4451]' : 'bg-gray-300')
                }`}
              >
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                      config[item.key as keyof WeChatConfig] ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
           </div>
        ))}
      </div>
      
      {/* Reset Button */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-300/30">
        <button
           onClick={() => setConfig({
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
           })}
           className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          重置配置
        </button>
      </div>

    </div>
  );
};
