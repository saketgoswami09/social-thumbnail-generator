// file: backend/testApiModels.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config'; // Load environment variables

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not found. Make sure .env file is set up correctly.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listAvailableModels() {
  console.log('Fetching list of available models from Google AI Studio...');
  try {
    const result = await genAI.listModels();

    console.log('--- Full Model List ---');
    for (const model of result.models) {
      console.log(`Model Name: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description.substring(0, 80)}...`);
      console.log('-------------------------');
    }

    // Filter for models likely supporting image generation
    const imageModels = result.models.filter(model =>
      model.name.includes('imagen') || model.name.includes('image')
    );

    console.log('\n--- Suggested Image Generation Models ---');
    if (imageModels.length > 0) {
      imageModels.forEach(model => console.log(model.name));
    } else {
      console.log('No specific image generation models found. Check full list for multimodal models like Gemini.');
    }

  } catch (error) {
    console.error('Error fetching model list:', error);
  }
}

listAvailableModels();