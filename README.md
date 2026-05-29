# CodeLens AI 🔎 — Developer Intelligence Platform

CodeLens AI is a production-quality, local developer assistant and diagnostic engine powered by the **Gemma 4 Vision** model running locally via **Ollama**. It classifies, diagnoses, and optimizes developer-related screenshots—ranging from compiler stack traces and terminal crash dumps to algorithmic problem descriptions, UI/UX designs, and microservice system design blueprints.

Designed with a flat, dark, high-density engineering layout (reminiscent of modern tools like Sentry, Datadog, GitHub, and Vercel), CodeLens AI operates 100% locally with zero internet data telemetry, zero API usage costs, and complete privacy for proprietary codebases.

---

## 🚀 Rebuilt 2-Page Workspace Architecture

We redesigned CodeLens AI into a spacious, modular **two-page architecture** to keep the interface professional, dense, and uncluttered:

### Page 1 — Workspace (Dashboard Overview)
* **Visual centerpiece drag-and-drop zone**: Easily load screenshots. When an image is selected, details appear alongside a prominent **Run Diagnostic Engine** button.
* **Left Navigation Sidebar**: Acts as a command control bar. Pinned navigation links (`Workspace`, `Recent Analyses`, `Sample Analyses`) scroll the page smoothly to their respective grids. Pinned footer triggers open the system configuration and documentation portals.
* **Ollama Gateway Status Panel**: Displays active model connectivity (`gemma4:e4b`), status indicators (`● Connected`), and token context limits.
* **Recent Analyses & Sample Lists**: Clean grids mapping previous runs and example datasets (offline sandbox) with visual image thumbnails.

### Page 2 — Analysis View (Full-Screen Diagnostics)
* **Automated Transition**: Triggering an analysis or selecting an item transitions the interface into a full-screen split-panel details view, hiding the left sidebar to maximize visual width.
* **Top Bar Command Bar**: Provides a `← Workspace` back button, filename details, active model target, and job runtime duration in seconds.
* **Split Layout**:
  * **Left Column (40% width)**: A full-height preview of the uploaded screenshot.
  * **Right Column (60% width)**: Scrollable developer insight panels, performance analysis metrics, specific code fix recommendations (with side-by-side unified code diffs), and the **Ask AI** terminal console.
* **Inline Loading Status**: In scanning mode, the right-hand column renders an animated circular indicator, progress bar, and skeleton cards, matching the screenshot on the left.

---

## 💡 Real-world Gemma Vision Use Cases for Developers

Running **Gemma 4 Vision** locally through Ollama provides unique capabilities for developer tools and workflows:

### 1. Private Code & Stack Trace Debugging
* **Data Isolation**: Proprietary codebases and sensitive logs are never sent to external servers. Gemma parses stack trace logs locally, finding file indices, memory leaks, or dependency issues securely.
* **Context Recognition**: Recognizes visual IDE layouts and highlights source lines that triggered unhandled exceptions.

### 2. LeetCode complement mapping & Interview Prep
* **Pattern Classification**: Gemma reads problem constraints from browser screenshots and instantly maps the problem type (e.g., Single-Pass Hash Map, Sliding Window, DFS).
* **Grounding Analysis**: Avoids generic, fake metrics by directly inferring $O(N)$ Time and Space complexities and providing optimal, executable solutions.

### 3. Visual UI-to-Code generation
* **Tailwind CSS & React Components**: Translates high-fidelity UI/UX mockups, mobile sign-in flows, or dashboard frames directly into responsive React structures.
* **Design Validation**: Audit contrasts, margins, and accessibility guidelines (such as touch-target sizes) visual-first.

### 4. System Architecture Optimization
* **Vulnerability Mapping**: Scans microservice blueprints and system design charts to detect bottlenecks (e.g., Single Points of Failure, SPOF databases) and generates interactive architectural schemas (such as Mermaid diagrams) suggesting queuing or load-balancing integrations.

---

## 📂 Folder Structure

```
CodeLens-AI/
├── package.json                   # Root package.json (concurrently orchestrator)
├── tsconfig.json                  # Root tsconfig for frontend React app
├── tsconfig.node.json             # Vite config ts compiler definitions
├── vite.config.ts                 # Vite bundler configurations
├── tailwind.config.js             # Tailwind CSS custom themes & layout setup
├── postcss.config.js              # PostCSS configuration
├── index.html                     # HTML root page
├── .gitignore                     # Git filter patterns
├── src/                           # Frontend React Application
│   ├── main.tsx                   # Mount client script
│   ├── App.tsx                    # Main root component & tab router
│   ├── index.css                  # Global styles & layout overrides
│   ├── components/                # Modular client elements
│   │   ├── Toast.tsx              # Framer Motion animated status notifications
│   │   ├── Navbar.tsx             # Header navigation & analyzed counter stats
│   │   ├── Sidebar.tsx            # Local storage history list & metadata
│   │   ├── SkeletonCards.tsx      # Pulse card loaders for scanning cycles
│   │   └── ResultsPanel.tsx       # AI Insight, Impact, Metrics, Action triggers, and Follow-up chat
│   ├── pages/                     # Application pages
│   │   ├── LandingPage.tsx        # Dynamic landing overview with grids & CTAs
│   │   └── WorkspacePage.tsx      # Application workspace & state orchestration
│   ├── hooks/                     # Custom React Hooks
│   │   └── useLocalStorage.ts     # Cache list & statistics synchronizer
│   ├── services/                  # Network operations
│   │   └── api.ts                 # Backend fetch client
│   ├── types/                     # TypeScript definitions
│   │   └── index.ts               # Shared models
│   └── utils/                     # Asset/Data Helpers
│       └── demoData.ts            # SVG images and preloaded mock reports
└── server/                        # Backend Node.js / Express Application
    ├── package.json               # Backend script runners
    ├── tsconfig.json              # Backend TypeScript config
    ├── server.ts                  # Express server entry configuration
    ├── middleware/
    │   └── upload.ts              # Multer upload restrictions (10MB, jpeg/png only)
    ├── routes/
    │   ├── analyze.ts             # POST /api/analyze router
    │   └── action.ts              # POST /api/action follow-up router
    └── services/
        └── ollama.ts              # Local Ollama fetch connection class
```

---

## ⚙️ Prerequisites

1. **Node.js** (v18.0.0 or higher is recommended).
2. **Ollama** installed locally.
   * Download Ollama from [ollama.com](https://ollama.com).
3. **Gemma 4 Vision Model** pulled locally in Ollama:
   ```bash
   ollama pull gemma4:e4b
   ```

---

## 🚀 Installation & Running

### Step 1: Install Dependencies
From the root project folder, run:
```bash
npm install
```
*Note: A postinstall script will run automatically to fetch dependencies for the backend `/server` package.*

### Step 2: Configure Environment Settings
Confirm that a `.env` file exists in the root folder with the following variables:
```env
# Server API Port
PORT=5000

# Local Ollama instance
OLLAMA_HOST=http://localhost:11434
GEMMA_MODEL=gemma4:e4b

# React client endpoint
VITE_API_URL=http://localhost:5000
```

### Step 3: Run the Application
Start the development server for both the frontend client and the backend server by running:
```bash
npm run dev
```

* **Vite Client:** Launches at [http://localhost:3000](http://localhost:3000).
* **Express Server:** Launches at [http://localhost:5000](http://localhost:5000).

---

## 🖥️ Demo Sandbox (Offline Mode)

If you are demoing without a local Ollama server running:
1. Open the homepage at [http://localhost:3000](http://localhost:3000).
2. Click **Open Workspace** or **Use Demo Examples**.
3. Under the **Sample Analyses (Offline Sandbox)** grid on Page 1, click any of the preloaded developer cards (e.g., `ERR_001_REACT_HOOK`, `ALG_001_TWO_SUM`, etc.).
4. The application will cycle through realistic rotating loading screens and progress bar shimmers on Page 2, and populate a rich database of analysis cards, including fully functional, responsive follow-up action modals and conversation chat threads.
