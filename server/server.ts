import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import actionRouter from './routes/action.js';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma4:e4b';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Enable CORS for all origins
app.use(cors());

// Parse JSON and URLEncoded bodies with increased limit for base64 images
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    configuredModel: GEMMA_MODEL,
    ollamaHost: OLLAMA_HOST,
    timestamp: new Date().toISOString()
  });
});

// Register routers
app.use('/api/analyze', analyzeRouter);
app.use('/api/action', actionRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Listen on configured port
app.listen(PORT, () => {
  console.log('============================================');
  console.log(`🚀 CodeLens AI Server running on port ${PORT}`);
  console.log(`🤖 Configured AI Model: ${GEMMA_MODEL}`);
  console.log(`🔗 Target Ollama Host: ${OLLAMA_HOST}`);
  console.log('============================================');
});
