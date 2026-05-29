import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma4:e4b';

export interface AnalysisResponse {
  type: string;
  confidence: number;
  aiInsight: string;
  developerImpact: string;
  summary: string;
  keyFindings: string[];
  issues: string[];
  suggestions: string[];
  nextSteps: string[];
}

export interface ActionResponse {
  title: string;
  content: string;
}

export class OllamaService {
  /**
   * Helper to convert buffer to base64 string
   */
  private static bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  /**
   * Universal fetch helper for Ollama
   */
  private static async queryOllama(prompt: string, base64Image?: string, forceJson: boolean = true): Promise<string> {
    const url = `${OLLAMA_HOST}/api/generate`;
    const payload: any = {
      model: GEMMA_MODEL,
      prompt: prompt,
      stream: false,
    };

    if (base64Image) {
      payload.images = [base64Image];
    }

    if (forceJson) {
      payload.format = 'json';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          throw new Error(`Model '${GEMMA_MODEL}' not found. Make sure you have run 'ollama pull ${GEMMA_MODEL}'`);
        }
        throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
      }

      const data: any = await response.json();
      return data.response;
    } catch (error: any) {
      // Check for connection refusal
      if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
        throw new Error('Ollama service is unreachable. Please make sure Ollama is running locally (http://localhost:11434).');
      }
      throw error;
    }
  }

  /**
   * Analyze developer screenshot and output initial structured analysis
   */
  public static async analyzeImage(imageBuffer: Buffer): Promise<AnalysisResponse> {
    const base64Image = this.bufferToBase64(imageBuffer);

    const prompt = `You are an expert software engineer, system architect, UI reviewer, debugging specialist, and technical mentor.

Analyze the uploaded image.

First determine which category best matches:
- Error Screenshot
- Code Screenshot
- LeetCode Problem
- UI Mockup
- System Design Diagram
- Technical Documentation
- Terminal Output
- GitHub Screenshot
- Other

Then provide your response in JSON format only matching this schema structure exactly:
{
  "type": "The category name determined from the list above",
  "confidence": 85, // An integer confidence percentage (0 to 100) on how sure you are of the category and details
  "aiInsight": "A high-level human-readable insight summarizing the issue (e.g. 'This screenshot appears to show a React routing configuration issue caused by a missing dependency, preventing successful application startup.')",
  "developerImpact": "A brief explanation of why this issue/screenshot matters to the developer (e.g. 'Application cannot compile until the missing dependency is resolved.')",
  "summary": "A concise technical summary of what the screenshot contains",
  "keyFindings": ["A short, punchy summary of key finding 1", "key finding 2"],
  "issues": ["Identify issue 1", "Identify issue 2"],
  "suggestions": ["Actionable optimization suggestions 1", "suggestion 2"],
  "nextSteps": ["Immediate next step 1", "next step 2"]
}

Rules:
- Be concise.
- Be accurate.
- Be actionable.
- Focus on software engineering.
- Avoid unnecessary conversational text or markdown code wraps. Return JSON only.`;

    const rawResponse = await this.queryOllama(prompt, base64Image, true);
    
    try {
      const parsed = JSON.parse(rawResponse.trim());
      // Enforce default fields if some are missing
      return {
        type: parsed.type || 'Other',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 80,
        aiInsight: parsed.aiInsight || 'No critical high-level insights generated.',
        developerImpact: parsed.developerImpact || 'Developer impact has not been mapped.',
        summary: parsed.summary || 'Uploaded screenshot analysis.',
        keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : []
      };
    } catch (e) {
      throw new Error(`Failed to parse AI response as JSON. Raw response: ${rawResponse.substring(0, 100)}...`);
    }
  }

  /**
   * Perform a secondary contextual action or answer a custom user follow-up question
   */
  public static async performAction(
    analysisType: string,
    action: string,
    imageBuffer: Buffer
  ): Promise<ActionResponse> {
    const base64Image = this.bufferToBase64(imageBuffer);
    
    // Choose appropriate instruction based on the action key or custom chat query
    let actionInstruction = '';

    if (action === 'generate_fix') {
      actionInstruction = 'Generate a detailed, step-by-step hotfix for the error shown in the screenshot. Include code snippets, commands, or configuration changes needed. Format all code blocks properly in markdown.';
    } else if (action === 'explain_error') {
      actionInstruction = 'Provide a deep dive explanation of the error shown in the screenshot. Detail why it occurs, what systems are affected, and what best practices prevent it from happening again.';
    } else if (action === 'generate_solution') {
      actionInstruction = 'Provide the optimal solution for this LeetCode problem. Write complete, clean code in TypeScript or Python, explain the algorithmic approach, and state the Time Complexity and Space Complexity.';
    } else if (action === 'show_optimal_pattern') {
      actionInstruction = 'Analyze the LeetCode problem and explain the optimal algorithmic pattern (e.g. Two Pointers, Dynamic Programming, BFS/DFS, Sliding Window) suitable for this problem. Do not write code, focus on strategies and patterns.';
    } else if (action === 'generate_components') {
      actionInstruction = 'Act as a premium frontend engineer. Analyze the visual elements of this mockup and write a fully-styled React functional component with mock data to build it. Add premium design styles.';
    } else if (action === 'generate_tailwind_layout') {
      actionInstruction = 'Break down this UI design. Write the exact HTML structure and Tailwind CSS classes required to replicate this layout. Focus on grids, flexbox alignments, responsive spacing, and colors.';
    } else if (action === 'improve_architecture') {
      actionInstruction = 'Evaluate this architecture diagram. Propose improvements to make it more scalable, fault-tolerant, secure, and cost-effective. Focus on microservices, database replicas, caching, and load balancing.';
    } else if (action === 'find_bottlenecks') {
      actionInstruction = 'Scan this system design diagram. Identify potential bottlenecks, single points of failure, database lock risks, network latency factors, or high load vulnerabilities.';
    } else {
      // Custom follow-up question from the conversational chat bar!
      actionInstruction = `The developer is asking this custom follow-up question regarding the screenshot: "${action}". Explain or write the code requested clearly. Use proper markdown and formatting for your response.`;
    }

    const prompt = `You are an expert developer and technical reviewer.
Analyze the uploaded image and fulfill this request: ${actionInstruction}

Return your response in JSON format matching this schema exactly:
{
  "title": "A short descriptive title for this action result (e.g., 'Proposed Hotfix' or 'Optimal React Component' or 'Follow-up Response')",
  "content": "The actual detailed developer response. Use rich Markdown for formatting. Include code blocks with syntax highlighting if relevant."
}

Rules:
- Be detailed and professional.
- Do NOT output HTML, wrap inside markdown blocks, or write conversational preambles. Output JSON only.`;

    const rawResponse = await this.queryOllama(prompt, base64Image, true);

    try {
      const parsed = JSON.parse(rawResponse.trim());
      return {
        title: parsed.title || 'Conversational Response',
        content: parsed.content || 'No details generated by the model.'
      };
    } catch (e) {
      throw new Error(`Failed to parse action AI response as JSON. Raw response: ${rawResponse.substring(0, 100)}...`);
    }
  }
}
