import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { OllamaService } from '../services/ollama.js';

const router = Router();

// POST /api/action - Executes follow-up developer actions on screenshots
// Can accept JSON body { analysisType, action, image: "data:image/png;base64,..." }
// OR multipart/form-data with fields analysisType, action, and file image.
router.post('/', (req: Request, res: Response, next) => {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('application/json')) {
    // Handle JSON payload containing base64 string
    const { analysisType, action, image } = req.body;
    
    if (!analysisType || !action) {
      return res.status(400).json({ error: 'Missing analysisType or action parameters.' });
    }
    
    if (!image) {
      return res.status(400).json({ error: 'Missing image parameter (base64 expected).' });
    }

    // Extract base64 content
    let base64Data = image;
    if (image.includes('base64,')) {
      base64Data = image.split('base64,')[1];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    OllamaService.performAction(analysisType, action, buffer)
      .then((result) => res.json(result))
      .catch((error) => {
        console.error('Error running AI action:', error);
        res.status(500).json({ error: error.message || 'AI action execution failed.' });
      });
  } else {
    // Handle multipart form upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const { analysisType, action } = req.body;
        
        if (!analysisType || !action) {
          return res.status(400).json({ error: 'Missing analysisType or action parameters in form data.' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No image file uploaded.' });
        }

        const result = await OllamaService.performAction(analysisType, action, req.file.buffer);
        return res.json(result);
      } catch (error: any) {
        console.error('Error running AI action from file:', error);
        return res.status(500).json({ error: error.message || 'AI action execution failed.' });
      }
    });
  }
});

export default router;
