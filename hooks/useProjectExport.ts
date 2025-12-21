
import { useState } from 'react';
import { getCorsFriendlyUrl, getExtensionFromMime, dataURItoBlob } from '../utils/imageUtils';
// @ts-ignore
import JSZip from 'jszip';
// @ts-ignore
import FileSaver from 'file-saver';

interface UseProjectExportProps {
  markdown: string;
  imagePool: Record<string, string>;
}

export const useProjectExport = ({ markdown, imagePool }: UseProjectExportProps) => {
  const [isExportingZip, setIsExportingZip] = useState(false);

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
            const fullLinkContent = match[2]; // e.g. 'url "title"' or just 'url'
            if (replacements.has(fullLinkContent)) continue;

            let actualUrl = fullLinkContent.trim();
            let titlePart = '';
            
            // Try to separate URL and title
            const urlParts = fullLinkContent.match(/^(\S+)(\s+["'].*["'])?$/);
            if (urlParts) {
                actualUrl = urlParts[1];
                titlePart = urlParts[2] || '';
            }

            try {
                if (actualUrl.startsWith('local://')) {
                    const imgId = actualUrl.replace('local://', '');
                    const base64Data = imagePool[imgId];
                    
                    if (base64Data) {
                        const mime = base64Data.split(';')[0].split(':')[1];
                        const ext = getExtensionFromMime(mime);
                        const filename = `${imgId}.${ext}`;
                        const blob = dataURItoBlob(base64Data);
                        assetsFolder?.file(filename, blob);
                        
                        const newContent = `./assets/${filename}${titlePart}`;
                        replacements.set(fullLinkContent, newContent);
                    }
                } else if (actualUrl.startsWith('http')) {
                    const fetchUrl = getCorsFriendlyUrl(actualUrl);
                    const response = await fetch(fetchUrl);
                    if (!response.ok) throw new Error(`Failed to fetch ${actualUrl}`);
                    
                    const blob = await response.blob();
                    const ext = getExtensionFromMime(blob.type);
                    const filename = `net_img_${Date.now()}_${networkImageCounter}.${ext}`;
                    networkImageCounter++;

                    assetsFolder?.file(filename, blob);
                    
                    const newContent = `./assets/${filename}${titlePart}`;
                    replacements.set(fullLinkContent, newContent);
                }
            } catch (err) {
                console.error(`Failed to process image: ${fullLinkContent}`, err);
            }
        }

        replacements.forEach((newPath, oldSrc) => {
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

  return {
    isExportingZip,
    handleExportZip,
    handleDownloadMarkdown
  };
};
