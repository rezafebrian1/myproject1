import { GoogleGenAI } from "@google/genai";
import { AngleShot, GenerationRequest } from "../types";

const MAX_RETRIES = 2;

// Map user aspect ratio to API supported ratio
// Gemini supports: "1:1", "3:4", "4:3", "9:16", "16:9"
// We map 4:5 to 3:4 as it's the closest vertical format supported natively
const mapAspectRatio = (ratio: string): string => {
  if (ratio === '4:5') return '3:4';
  return ratio;
};

const getPrompt = (req: GenerationRequest, angle: AngleShot): string => {
  const isFood = req.mode === 'FOOD_DRINK';
  
  let prompt = `Create a high-quality, professional product shot based on the input image. 
  
  **Core Subject:** The product in the input image. It must look EXACTLY like the reference product. Preserve logo, text, and details.
  **Style:** ${req.style.name} (${req.style.description}).
  **Angle/Composition:** ${angle.name}. ${angle.description}.
  **Aspect Ratio Output:** ${req.aspectRatio}.
  **Background:** ${req.background || 'Professional Studio Background matching the style'}.
  `;

  if (isFood && req.bokehLevel) {
    prompt += `**Depth of Field:** Apply a bokeh effect with intensity ${req.bokehLevel}/100. Background should be blurred to focus on the food.\n`;
  }

  if (!isFood && req.fashionOptions) {
    const opts = req.fashionOptions;
    prompt += `**Model Details:**
    - Type: ${opts.ethnicity} ${opts.gender}.
    - Pose: ${opts.pose}.
    - Attire: Model is wearing the product naturally.
    ${opts.isHijab ? '- IMPORTANT: The female model is wearing a stylish Hijab.' : ''}
    `;
  }

  if (req.instructions) {
    prompt += `**Additional User Instructions:** ${req.instructions}\n`;
  }

  prompt += `\n**Quality Modifiers:** Ultra realistic, photorealistic, 8k resolution, high detail, commercial photography, award-winning lighting, sharp focus on product.`;

  return prompt;
};

export const generateImage = async (
  req: GenerationRequest, 
  angle: AngleShot
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = getPrompt(req, angle);
  const ratio = mapAspectRatio(req.aspectRatio);
  
  // Clean base64 string
  const base64Image = req.images[0].replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  let attempt = 0;
  let lastError: any;

  while (attempt <= MAX_RETRIES) {
    try {
      // We use gemini-3-pro-image-preview for high quality as per guidelines for complex tasks
      // Or gemini-2.5-flash-image for speed. The user asked for "Instantly" but also "High Quality".
      // Let's use gemini-2.5-flash-image which is very fast and capable, 
      // but guidelines suggest 3-pro for high quality generation.
      // Given "Product Shots", detail is key. Let's try 3-pro if available, else flash.
      // The prompt logic implies we are generating content (image) from image+text.
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // Using Flash Image for speed/efficiency in this demo
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/png', data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
            // Note: imageConfig is supported on specific models. 
            // If the model doesn't strictly support generating an image *file* via generateContent directly
            // without tools, we might get text. 
            // However, gemini-2.5-flash-image is capable of image-out.
            // We'll rely on the text prompt to drive the aspect ratio mostly, 
            // but if available we pass imageConfig.
            imageConfig: {
              aspectRatio: ratio,
            }
        }
      });
      
      // Parse response to find image
      // Note: The GenAI SDK simplifies this.
      // If the model returns an image, it's usually in parts.
      
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
        }
      }
      
      // If we got here, no image was found in response
      throw new Error("No image generated in response");

    } catch (error) {
      lastError = error;
      attempt++;
      console.warn(`Attempt ${attempt} failed for angle ${angle.name}:`, error);
      if (attempt > MAX_RETRIES) break;
      // Simple backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw lastError || new Error("Failed to generate image after retries");
};