export interface AnalysisResult {
  type: string;
  confidence: number;
  aiInsight: string;
  developerImpact: string;
  summary: string;
  keyFindings: string[];
  issues: string[];
  suggestions: string[];
  nextSteps: string[];
  processingTime?: number; // in seconds, e.g. 2.3
  modelUsed?: string; // e.g. "gemma4:e4b"
}

export interface HistoryItem {
  id: string;
  imageName: string;
  imageSize: string;
  imageType: string;
  imageUrl: string; // Base64 or object URL
  timestamp: string;
  results: AnalysisResult;
}

export interface ActionResult {
  title: string;
  content: string;
}
