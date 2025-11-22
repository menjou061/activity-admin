import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // API key must be obtained from process.env.API_KEY
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const MODEL_NAME = 'gemini-2.5-flash-image';

// Helper to strip the data URL prefix for the API
const extractBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1] || dataUrl;
};

// Helper to get MIME type
const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/:(.*?);/);
  return match ? match[1] : 'image/png';
};

// Helper to convert remote URL to Data URL if necessary
// This is required because the API expects inlineData to be base64, not a remote URL
const ensureDataUrl = async (url: string): Promise<string> => {
  if (!url.startsWith('http')) return url;

  const fetchBlob = async (targetUrl: string) => {
    try {
      const response = await fetch(targetUrl, { 
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return await response.blob();
    } catch (e) {
      throw e;
    }
  };

  try {
    let blob: Blob;
    try {
      // Attempt 1: Direct Fetch (Works for Unsplash, etc.)
      blob = await fetchBlob(url);
    } catch (e) {
      console.warn("Direct fetch failed, attempting Proxy 1 (corsproxy.io)...", e);
      try {
        // Attempt 2: CORS Proxy
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        blob = await fetchBlob(proxyUrl);
      } catch (e2) {
        console.warn("Proxy 1 failed, attempting Proxy 2 (wsrv.nl)...", e2);
        // Attempt 3: Image Proxy (wsrv.nl) - Robust for images
        // We append &output=png to ensure we get a compatible image blob
        const proxyUrl2 = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`;
        blob = await fetchBlob(proxyUrl2);
      }
    }

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw error;
  }
};

export const generateClothingFromText = async (prompt: string): Promise<string> => {
  const ai = getClient();
  
  const fullPrompt = `Generate a high-quality, flat-lay photo of a clothing item based on this description: "${prompt}". The background should be clean white or neutral. Return only the image.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        // Nano Banana (gemini-2.5-flash-image) config
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating clothing:", error);
    throw error;
  }
};

export const generateTryOn = async (faceImage: string, clothImage: string): Promise<string> => {
  const ai = getClient();

  // Ensure inputs are Base64 Data URLs (handles presets which are HTTP URLs)
  const faceDataUrl = await ensureDataUrl(faceImage);
  const clothDataUrl = await ensureDataUrl(clothImage);

  // Nano Banana supports multimodal input (Image + Image + Text)
  const facePart = {
    inlineData: {
      data: extractBase64(faceDataUrl),
      mimeType: getMimeType(faceDataUrl)
    }
  };

  const clothPart = {
    inlineData: {
      data: extractBase64(clothDataUrl),
      mimeType: getMimeType(clothDataUrl)
    }
  };

  const prompt = `
    Create a full-body photo of the person shown in the first image wearing the clothing shown in the second image.
    - Maintain the identity, facial features, and hairstyle of the person.
    - Adapt the clothing to fit the person's body naturally.
    - The pose should be natural and elegant.
    - High photorealism, 4k resolution style.
    - Output a full body shot.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [facePart, clothPart, { text: prompt }]
      },
      config: {
         imageConfig: {
           aspectRatio: "3:4" // Vertical portrait ratio
         }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No try-on image generated.");

  } catch (error) {
    console.error("Error generating try-on:", error);
    throw error;
  }
};