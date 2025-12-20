
// Helper to handle CORS for initial fetch
export const getCorsFriendlyUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('local://')) return url;
  try {
    const urlObj = new URL(url);
    if (urlObj.origin === window.location.origin) return url;
    // Use wsrv.nl as a high-performance, CORS-enabled image proxy
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`;
  } catch {
    return url;
  }
};

// Convert Data URI to Blob
export const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

// Get Extension from Mime
export const getExtensionFromMime = (mime: string) => {
  switch(mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    case 'image/svg+xml': return 'svg';
    default: return 'png';
  }
};

// Helper function for Image Garbage Collection
export const cleanImagePool = (pool: Record<string, string>, markdownContent: string, sourceLabel: string) => {
    // 1. Identify all image IDs currently used in the Markdown
    const usedIds = new Set<string>();
    // Regex to find strings like: local://img_123456789
    const regex = /local:\/\/(img_[a-z0-9]+)/gi;
    let match;
    // We strictly use markdownContent here to ensure we only keep what's in the text
    while ((match = regex.exec(markdownContent)) !== null) {
      usedIds.add(match[1]); // match[1] is the ID
    }

    // 2. Filter the pool
    const cleanedPool: Record<string, string> = {};
    let removedCount = 0;
    const totalBefore = Object.keys(pool).length;

    Object.keys(pool).forEach(key => {
      if (usedIds.has(key)) {
        cleanedPool[key] = pool[key];
      } else {
        removedCount++;
      }
    });
    
    const remaining = Object.keys(cleanedPool).length;

    // 3. Log Statistics
    console.group(`🧹 Image GC [${sourceLabel}]`);
    console.log(`%cTotal Images: ${totalBefore}`, 'color: gray');
    console.log(`%cUsed Images:  ${remaining}`, 'color: green; font-weight: bold');
    if (removedCount > 0) {
        console.log(`%cCleaned Up:   ${removedCount} (Trash Removed)`, 'color: orange; font-weight: bold');
    } else {
        console.log(`%cCleaned Up:   0`, 'color: gray');
    }
    console.groupEnd();

    return { cleanedPool, removedCount };
};

// Image Compression Helper
export const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Resize logic: maintain aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Canvas context error"));
            return;
        }
        
        // Clear canvas instead of filling white to preserve transparency
        ctx.clearRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as WebP: Supports transparency AND high compression
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
