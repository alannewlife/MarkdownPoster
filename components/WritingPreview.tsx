
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontSize } from '../types';
import { getFontSizeClass } from '../utils/themeUtils';
import { StableImage } from './StableImage';

interface WritingPreviewProps {
  markdown: string;
  fontSize: FontSize;
  imagePool: Record<string, string>;
  visible: boolean;
  isDarkMode: boolean;
}

export const WritingPreview: React.FC<WritingPreviewProps> = ({
  markdown,
  fontSize,
  imagePool,
  visible,
  isDarkMode
}) => {
  
  // Use isDarkMode to determine text styling, ensuring readability against the app's background.
  // We remove currentStyle.frame to let the parent's background (gray/dark) show through without dots.
  const proseClass = isDarkMode 
    ? 'prose-invert prose-p:text-[#abb2bf] prose-headings:text-[#d4cfbf] prose-a:text-[#61afef] prose-strong:text-[#d19a66] prose-code:text-[#98c379]' 
    : 'prose-slate prose-lg text-gray-800 prose-headings:text-gray-900';

  return (
    <div className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${
        visible ? 'z-10 visible' : 'z-0 invisible'
    } px-8 md:px-16`}>
       <div className={`w-full max-w-4xl mx-auto py-16 min-h-full origin-center transition-all duration-300 ease-out delay-75 ${
           visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
       }`}>
          <div className={`prose max-w-none ${proseClass} ${getFontSizeClass(fontSize)}`}>
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
  );
};
