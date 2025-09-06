import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates an image based on a text prompt using Google Gemini.
 * @param {string} prompt - The image description.
 * @returns {Promise<string>} The base64 string of the image.
 */
export const generateImageFromPrompt = async (prompt) => {
  console.log(`[ImageGenService] Initiating image generation for prompt: "${prompt}"`);

  try {
    // --- FIX #1: Model Name Correction ---
    // Replaced "imagegeneration" with a valid, powerful multimodal model.
    // Use "gemini-1.5-pro-latest" or "gemini-pro" for tasks like this.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Generate content.
    const result = await model.generateContent(prompt);
    const response = result.response;

    // --- FIX #2: Response Parsing Correction ---
    // 1. Check if candidates array exists and has content.
    if (!response.candidates || response.candidates.length === 0) {
      // Check for prompt feedback (e.g., safety blocks) if no candidates are returned.
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(
          `Prompt blocked due to: ${response.promptFeedback.blockReason}`
        );
      }
      throw new Error("No candidates found in API response.");
    }

    // 2. Access the first candidate from the array.
    const candidate = response.candidates[0];

    // 3. Add safety checks before accessing parts.
    if (!candidate.content || !candidate.content.parts) {
      throw new Error("Invalid response structure: content or parts missing.");
    }

    // 4. Find the image part more reliably by checking the mimeType.
    const imagePart = candidate.content.parts.find(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith("image/")
    );

    if (!imagePart) {
      // If no image part, log potential text response for debugging.
      const textPart = candidate.content.parts.find((part) => part.text);
      if (textPart) {
        console.warn("[ImageGenService] API returned text instead of image:", textPart.text);
        throw new Error(`API returned text instead of image. Check prompt or model capabilities.`);
      }
      throw new Error("No image data found in API response payload.");
    }

    console.log("[ImageGenService] Image generated successfully.");
    return imagePart.inlineData.data; // Return base64 string

  } catch (error) {
    console.error("[ImageGenService] Error during image generation:", error.message);
    // Re-throw a clean error for the controller to handle.
    throw new Error(`Google AI API Error: ${error.message}`);
  }
};