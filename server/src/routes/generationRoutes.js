// file: backend/src/routes/generationRoutes.js

import express from 'express';
import { handleImageGeneration } from '../controllers/generationController.js';

const router = express.Router();

// Route: POST /api/generate/image
router.post('/image', handleImageGeneration);

export default router;