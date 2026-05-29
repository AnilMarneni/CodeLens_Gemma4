# CodeLens AI 🚀

> Transform Developer Screenshots into Actionable Intelligence

CodeLens AI is a **local-first Developer Intelligence Platform** powered by **Gemma 4 Vision** running through **Ollama**. The platform enables developers to upload technical screenshots—such as error messages, code snippets, LeetCode problems, UI mockups, architecture diagrams, and terminal outputs—and receive structured, actionable insights instantly.

Unlike traditional AI assistants that require users to manually copy and paste information, CodeLens AI directly understands visual developer content and converts it into meaningful engineering recommendations.

---

## 🎯 Problem Statement

Developers frequently encounter important information trapped inside screenshots:

- Runtime errors
- Build failures
- LeetCode problems
- UI designs and wireframes
- System architecture diagrams
- Terminal outputs
- Code screenshots

Understanding these screenshots often requires switching between multiple tools, manually copying content, searching documentation, and repeatedly querying AI systems.

CodeLens AI eliminates this friction by allowing users to upload a screenshot and instantly receive intelligent analysis.

---

## 💡 Solution

CodeLens AI acts as a visual developer assistant that:

1. Accepts technical screenshots.
2. Uses Gemma 4 Vision to understand the image content.
3. Identifies the screenshot category automatically.
4. Generates structured insights.
5. Provides actionable recommendations and follow-up assistance.

---

## ✨ Features

### 📸 Screenshot Analysis

Supports:

- Error Screenshots
- Code Screenshots
- LeetCode Problems
- UI Mockups
- System Design Diagrams
- Terminal Outputs
- Technical Documentation

---

### 🧠 AI Insight Engine

Generates:

- AI Insight
- Developer Impact
- Key Findings
- Issues Found
- Suggested Improvements
- Recommended Actions

---

### 🔍 Error Diagnosis

For error screenshots, CodeLens AI provides:

- Error Type
- Root Cause Analysis
- Suggested Fixes
- Terminal Commands
- Debugging Guidance

---

### 🏆 LeetCode Assistant

For coding problems:

- Problem Understanding
- Pattern Detection
- Difficulty Estimation
- Solution Approach
- Complexity Analysis
- Optimization Suggestions

---

### 🎨 UI Mockup Analysis

For design screenshots:

- Component Detection
- Layout Breakdown
- Technology Suggestions
- Implementation Guidance

---

### 🏗️ System Design Review

For architecture diagrams:

- Architecture Summary
- Bottleneck Identification
- Scalability Review
- Improvement Suggestions

---

### 💬 Ask AI

After analysis, users can continue the conversation using contextual prompts:

- Generate React code
- Explain simply
- Show optimal solution
- Suggest improvements

---

### 📚 Analysis History

Stores previous analyses locally for quick retrieval.

---

### 🧪 Sample Analysis Mode

Includes preloaded sample screenshots for:

- Offline demonstrations
- Quick testing
- Hackathon presentations

No Ollama connection is required when using sample analyses.

---

## 🤖 Gemma 4 Vision Integration

### Why Gemma?

The core innovation of CodeLens AI is its use of **Gemma 4 Vision** as the multimodal reasoning engine.

Traditional developer tools require users to manually provide text input. CodeLens AI instead allows developers to work directly with screenshots.

Gemma 4 Vision enables the platform to:

- Understand visual content
- Read screenshots
- Interpret code images
- Analyze UI designs
- Recognize architecture diagrams
- Extract developer intent

---

### How Gemma Is Used

Workflow:

```text
Screenshot
      ↓
CodeLens AI
      ↓
Gemma 4 Vision
      ↓
Classification
      ↓
Structured Analysis
      ↓
Actionable Insights
```

Gemma first determines the screenshot category:

- Error Screenshot
- Code Screenshot
- LeetCode Problem
- UI Mockup
- System Design Diagram
- Terminal Output

It then generates context-aware recommendations tailored to that category.

---

### Why Local AI?

CodeLens AI uses:

```text
Ollama
+
Gemma 4 Vision
```

running locally on the user's machine.

Benefits:

#### 🔒 Privacy

Screenshots never leave the device.

#### ⚡ Low Latency

No external API calls.

#### 💰 Zero Usage Cost

No paid AI API required.

#### 🌐 Offline Capability

Works without internet access.

#### 🧠 Demonstrates Local AI Engineering

Showcases practical deployment of open-source multimodal models.

---

## 🏗️ Architecture

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

Responsibilities:

- Upload screenshots
- Display analysis results
- Manage history
- Provide user interactions

---

### Backend

- Node.js
- Express
- TypeScript

Responsibilities:

- Receive uploaded images
- Process requests
- Communicate with Ollama
- Return structured responses

---

### AI Layer

- Ollama
- Gemma 4 Vision (`gemma4:e4b`)

Responsibilities:

- Visual understanding
- Classification
- Reasoning
- Recommendation generation

---

## 📂 Application Flow

```text
Upload Screenshot
        ↓
Image Processing
        ↓
Gemma 4 Vision
        ↓
Screenshot Classification
        ↓
AI Analysis
        ↓
Insights & Recommendations
        ↓
Follow-up Questions
```

---

## 🎯 Use Cases

### Students

- Understand coding problems
- Learn algorithms
- Debug assignments

### Developers

- Investigate errors
- Review code screenshots
- Analyze architecture diagrams

### Interview Candidates

- Practice LeetCode
- Learn patterns
- Understand optimizations

### Hackathon Teams

- Quickly interpret screenshots
- Generate implementation guidance

---

## 🚀 Future Scope

- React Component Generation from UI screenshots
- Automatic Code Fix Generation
- Multi-image Comparison
- GitHub Integration
- VS Code Extension
- Team Collaboration Features
- Architecture Evolution Tracking

---

## 🛠️ Installation

### Prerequisites

- Node.js
- Ollama
- Gemma 4 Vision Model

Install model:

```bash
ollama pull gemma4:e4b
```

---

### Run Locally

Install dependencies:

```bash
npm install
```

Start development environment:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏆 Hackathon Theme

CodeLens AI demonstrates how multimodal AI can improve developer productivity by transforming screenshots into structured engineering knowledge.

The project showcases:

- Local AI deployment
- Multimodal reasoning
- Practical developer tooling
- Human-AI collaboration
- Privacy-first architecture

---

## 📜 License

Built for experimentation, learning, and hackathon innovation.

---

### Built with ❤️ using Gemma 4 Vision + Ollama

**CodeLens AI — Transform Developer Screenshots into Actionable Intelligence.** 🚀
