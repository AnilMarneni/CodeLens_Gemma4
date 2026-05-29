import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { OllamaService } from '../services/ollama.js';

const router = Router();

// POST /api/analyze - Accepts multipart/form-data with 'image' field
router.post('/', (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    // Handle Multer upload errors
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const start = Date.now();

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded. Please select a valid screenshot.' });
      }

      // Query Ollama service with image buffer
      const analysis = await OllamaService.analyzeImage(req.file.buffer);
      
      // Calculate real processing duration
      const durationSeconds = parseFloat(((Date.now() - start) / 1000).toFixed(2));
      
      // Stamp metadata to response
      const resultsWithMetadata = {
        ...analysis,
        processingTime: durationSeconds,
        modelUsed: process.env.GEMMA_MODEL || 'gemma4:e4b',
      };
      
      return res.json(resultsWithMetadata);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      return res.status(500).json({ 
        error: error.message || 'An error occurred during AI analysis. Please verify Ollama is running.' 
      });
    }
  });
});

export default router;
