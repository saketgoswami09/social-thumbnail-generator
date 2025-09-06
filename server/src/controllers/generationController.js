// file: backend/src/controllers/generationController.js

import { generateImageFromPrompt } from '../services/imageGenerationService.js';

/**
 * @desc    Generate an image based on a user prompt
 * @route   POST /api/generate/image
 * @access  Private (requires authentication)
 */
export const handleImageGeneration = async (req, res) => {
  const { prompt } = req.body;

  // 1. Basic input validation
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ message: 'A valid text prompt is required.' });
  }

  try {
    // 2. Call the image generation service
    const imageBase64 = await generateImageFromPrompt(prompt);

    // 3. Send successful response
    // We send back the image data in base64 format. The frontend will be able to render this directly.
    res.status(200).json({
      message: 'Image generated successfully',
      imageData: imageBase64,
    });
  } catch (error) {
    // 4. Handle errors from the service aPI call
    console.error('Error in handleImageGeneration controller:', error);
    res.status(500).json({ message: error.message || 'Image generation failed.' });
  }
};