
import { uploadToImgbb } from '../services/imgbbService';

export interface WeChatCopyResult {
  success: boolean;
  totalImages: number;
  failedImages: number;
  errors: string[];
}

/**
 * Processes the WeChat Preview DOM:
 * 1. Clones the DOM node.
 * 2. Scans for images with Base64 or Blob URLs.
 * 3. Uploads them to ImgBB to get a public URL.
 * 4. Replaces the src in the cloned DOM.
 * 5. Copies the final HTML to clipboard.
 * 
 * Returns a result object detailing success/failure counts.
 */
export const processAndCopyWeChatHtml = async (container: HTMLElement): Promise<WeChatCopyResult> => {
    const contentNode = container.querySelector('.wechat-content');
    if (!contentNode) throw new Error("Content node not found");

    // 1. Clone the node to manipulate without affecting UI
    const clone = contentNode.cloneNode(true) as HTMLElement;

    // 2. Find all images
    const images = Array.from(clone.querySelectorAll('img'));
    
    const errors: string[] = [];
    let failedCount = 0;

    if (images.length > 0) {
        console.log(`Processing ${images.length} images for WeChat export...`);
    }

    // 3. Process images in parallel (Wait for all, don't throw on individual fail)
    await Promise.all(images.map(async (img) => {
        const src = img.src;
        try {
            let base64Data = '';

            // Case A: Image is Base64 (Local Image)
            if (src.startsWith('data:image')) {
                base64Data = src;
            } 
            // Case B: Image is Blob (External Proxied Image)
            else if (src.startsWith('blob:')) {
                const response = await fetch(src);
                const blob = await response.blob();
                base64Data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            // If we have base64 data, upload it
            if (base64Data) {
                const remoteUrl = await uploadToImgbb(base64Data);
                img.src = remoteUrl;
            }
        } catch (e: any) {
            console.error("Failed to process image for WeChat copy", e);
            failedCount++;
            errors.push(e.message || "Unknown upload error");
            // If upload fails, we leave the src as is (or could replace with a placeholder)
            // WeChat might show a broken image, but the text structure is preserved.
        }
    }));

    // 4. Get final HTML with inline styles
    const htmlContent = clone.innerHTML;
    
    // 5. Copy to clipboard
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([clone.innerText || ''], { type: 'text/plain' });
    
    await navigator.clipboard.write([
        new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
        })
    ]);

    return {
        success: failedCount === 0,
        totalImages: images.length,
        failedImages: failedCount,
        errors
    };
};
