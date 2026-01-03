import { GoogleGenAI, Modality, Type } from "@google/genai";
import { getApiKey } from '../components/ApiKeyManager';

// Create client instance helper - SỬA ĐỔI
export const getGeminiClient = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Vui lòng cấu hình API key trước khi sử dụng!');
  }
  
  return new GoogleGenAI({ apiKey: apiKey });
};

/**
 * Transcribes audio/video to SRT format using Gemini Flash.
 */
export async function generateSrtFromVideo(videoBase64: string, mimeType: string, mode: 'audio' | 'visual') {
  try {
    const ai = getGeminiClient();
    const systemInstruction = `
      You are an expert subtitler. 
      Task: Extract ${mode === 'audio' ? 'dialogue' : 'hardcoded subtitles'} from the provided video segment and output ONLY valid SRT format.
      Format Rules:
      - Index
      - StartTime --> EndTime (HH:MM:SS,mmm)
      - Subtitle text
      - Blank line
      Language: Maintain the original language. If multi-lingual, transcribe as is.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: videoBase64, mimeType } },
          { text: `Extract all subtitles and output in SRT format. Focus on ${mode === 'audio' ? 'spoken audio' : 'on-screen text/hard subs'}.` }
        ]
      },
      config: {
        systemInstruction,
        temperature: 0.1, // Low temperature for high accuracy in transcription
      }
    });

    return response.text || '';
  } catch (error: any) {
    // Xử lý lỗi API key không hợp lệ
    if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('403')) {
      localStorage.removeItem('gemini_api_key');
      throw new Error('API key không hợp lệ! Vui lòng cấu hình lại.');
    }
    throw error;
  }
}

/**
 * Generates video using Veo 3.1 Fast.
 */
export async function generateVeoVideo(prompt: string, aspectRatio: '16:9' | '9:16') {
  try {
    const ai = getGeminiClient();
    const apiKey = getApiKey(); // Lấy API key để dùng trong download link
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Polling for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");
    
    // SỬA ĐỔI: Dùng apiKey từ localStorage thay vì process.env
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    return await response.blob();
  } catch (error: any) {
    if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('403')) {
      localStorage.removeItem('gemini_api_key');
      throw new Error('API key không hợp lệ! Vui lòng cấu hình lại.');
    }
    throw error;
  }
}

/**
 * Analyzes image content using Gemini Pro.
 */
export async function analyzeImage(imageBase64: string, mimeType: string, prompt: string) {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt }
        ]
      }
    });
    return response.text || '';
  } catch (error: any) {
    if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('403')) {
      localStorage.removeItem('gemini_api_key');
      throw new Error('API key không hợp lệ! Vui lòng cấu hình lại.');
    }
    throw error;
  }
}