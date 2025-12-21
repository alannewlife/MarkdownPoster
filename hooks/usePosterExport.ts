
import React, { useState, RefObject } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { cleanImagePool } from '../utils/imageUtils';

interface UsePosterExportProps {
  exportRef: RefObject<HTMLDivElement | null>;
  imagePool: Record<string, string>;
  setImagePool: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  markdown: string;
}

export const usePosterExport = ({ exportRef, imagePool, setImagePool, markdown }: UsePosterExportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const preparePosterForExport = async () => {
    // 1. Clean up unused images from pool before export
    const { cleanedPool, removedCount } = cleanImagePool(imagePool, markdown, 'Pre-Export');
    if (removedCount > 0) {
      setImagePool(cleanedPool);
    }
    
    if (!exportRef.current) throw new Error("Export container not found");
    
    // 2. Wait for all images inside the poster to fully load
    // This helps prevent blank images in the generated PNG
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 300)));
    const images = Array.from(exportRef.current.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
        });
    }));
  };

  const handleDownloadPoster = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
        await preparePosterForExport();
        if (!exportRef.current) return;
        
        const dataUrl = await toPng(exportRef.current, { pixelRatio: 2, skipAutoScale: true, cacheBust: false });
        const link = document.createElement('a');
        link.download = `markdownposter-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (e) {
        console.error("Download failed", e);
        alert("导出失败，请重试。");
    } finally {
        setIsExporting(false);
    }
  };

  const handleCopyPoster = async (): Promise<{success: boolean, message?: string}> => {
    if (isExporting) return { success: false, message: 'Processing' };
    setIsExporting(true);
    try {
        await preparePosterForExport();
        if (!exportRef.current) throw new Error("DOM missing");

        const blob = await toBlob(exportRef.current, { pixelRatio: 2, skipAutoScale: true, cacheBust: false });
        if (!blob) throw new Error("Failed to generate image");

        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
        return { success: true };
    } catch (e: any) {
        console.error("Copy failed", e);
        return { success: false, message: e.message || "Unknown error" };
    } finally {
        setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleDownloadPoster,
    handleCopyPoster
  };
};