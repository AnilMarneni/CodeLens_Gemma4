/// <reference types="vite/client" />
import { AnalysisResult, ActionResult } from '../types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiService {
  /**
   * Send image to backend for structured analysis
   */
  public static async analyzeImage(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to analyze screenshot.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Fallback if not JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Trigger follow-up AI action on the screenshot
   */
  public static async executeAction(
    analysisType: string,
    action: string,
    image: File | string
  ): Promise<ActionResult> {
    let response: Response;

    if (typeof image === 'string') {
      // Base64 payload - Send as application/json
      response = await fetch(`${API_URL}/api/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType,
          action,
          image,
        }),
      });
    } else {
      // File payload - Send as multipart/form-data
      const formData = new FormData();
      formData.append('analysisType', analysisType);
      formData.append('action', action);
      formData.append('image', image);

      response = await fetch(`${API_URL}/api/action`, {
        method: 'POST',
        body: formData,
      });
    }

    if (!response.ok) {
      let errorMessage = 'Failed to execute follow-up action.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Fallback
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}
