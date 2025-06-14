
import { GoogleGenAI, GenerateImagesResponse, GeneratedImage } from "@google/genai";

// Assume process.env.API_KEY is set, valid, and accessible as per project guidelines.
// The API key is passed directly to the GoogleGenAI constructor.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'imagen-3.0-generate-002';

export const generateImageFromText = async (prompt: string): Promise<string> => {
  // Direct usage of process.env.API_KEY means no explicit check for apiKey variable is needed here.
  // If API_KEY is not configured in the environment, the GoogleGenAI instantiation or API calls will fail.

  try {
    const response: GenerateImagesResponse = await ai.models.generateImages({
      model: MODEL_NAME,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const firstImage: GeneratedImage = response.generatedImages[0];
      // The 'image' property of GeneratedImage contains 'imageBytes' and 'mimeType'.
      if (firstImage.image && firstImage.image.imageBytes && firstImage.image.mimeType) {
        return `data:${firstImage.image.mimeType};base64,${firstImage.image.imageBytes}`;
      }
    }
    throw new Error('No image data received from API or image data is incomplete.');
  } catch (error) {
    console.error('Error generating image with Gemini API:', error);
    if (error instanceof Error) {
        // Provide more user-friendly error messages for common issues.
        if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID") || error.message.includes("permission denied")) {
            throw new Error("Invalid API Key or insufficient permissions. Please check your environment configuration and Gemini API settings.");
        }
        if (error.message.includes("quota")) {
            throw new Error("API quota exceeded. Please try again later or check your quota limits.");
        }
         throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the AI model.');
  }
};
