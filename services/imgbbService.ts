
const IMGBB_API_KEY = '6a2f2d51501ecdbf0733c2e13c3b7445';
const API_URL = 'https://api.imgbb.com/1/upload';

export const uploadToImgbb = async (base64Data: string): Promise<string> => {
  // Remove the data URL prefix (e.g., "data:image/png;base64,")
  const base64Content = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");
  
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64Content);
  // Expiration: 600 seconds (10 minutes) as requested
  formData.append('expiration', '600'); 

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    throw error;
  }
};
