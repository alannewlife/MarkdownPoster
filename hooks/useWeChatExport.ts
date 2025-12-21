
import { useState, RefObject } from 'react';
import { processAndCopyWeChatHtml, WeChatCopyResult } from '../utils/wechatUtils';

interface UseWeChatExportProps {
  weChatRef: RefObject<HTMLDivElement | null>;
}

export const useWeChatExport = ({ weChatRef }: UseWeChatExportProps) => {
  const [isCopyingWeChat, setIsCopyingWeChat] = useState(false);

  const handleCopyHtml = async (): Promise<WeChatCopyResult | null> => {
    if (isCopyingWeChat || !weChatRef.current) return null;
    setIsCopyingWeChat(true);

    try {
        const result = await processAndCopyWeChatHtml(weChatRef.current);
        return result;
    } catch (e) {
        console.error("Copy HTML failed", e);
        return {
            success: false,
            totalImages: 0,
            failedImages: 0,
            errors: [(e as any).message || 'Unknown error']
        };
    } finally {
        setIsCopyingWeChat(false);
    }
  };

  return {
    isCopyingWeChat,
    handleCopyHtml
  };
};
