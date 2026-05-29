import { AnalysisResult, ActionResult } from '../types/index';

export interface DemoItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string; // Inline SVG base64 or source
  analysis: AnalysisResult;
  actions: {
    [key: string]: ActionResult;
  };
}

// Helper to convert SVG string to data URL
const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// 1. React Error Screenshot SVG
const reactErrorSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; font-family: monospace;">
  <!-- IDE Frame -->
  <rect x="0" y="0" width="600" height="30" fill="#1E293B"/>
  <circle cx="20" cy="15" r="6" fill="#EF4444"/>
  <circle cx="40" cy="15" r="6" fill="#F59E0B"/>
  <circle cx="60" cy="15" r="6" fill="#10B981"/>
  <text x="300" y="20" fill="#94A3B8" font-size="12" text-anchor="middle">DashboardComponent.tsx</text>
  
  <!-- Content Area -->
  <rect x="15" y="45" width="570" height="340" rx="6" fill="#1E1E2E" stroke="#EF4444" stroke-width="2"/>
  
  <!-- Crash Banner -->
  <rect x="30" y="60" width="540" height="50" rx="4" fill="#7F1D1D" fill-opacity="0.5"/>
  <text x="50" y="90" fill="#FCA5A5" font-size="16" font-weight="bold">TypeError: Cannot read properties of undefined (reading 'map')</text>
  
  <!-- Code Area -->
  <text x="40" y="150" fill="#64748B" font-size="12">39 |   const renderList = () => {</text>
  <text x="40" y="170" fill="#64748B" font-size="12">40 |     // Fetch active dashboard items</text>
  <text x="40" y="190" fill="#E2E8F0" font-size="12">41 |     const { items } = useDashboardData();</text>
  <text x="40" y="210" fill="#F87171" font-size="12" font-weight="bold">42 &gt;   return items.map((item) =&gt; (</text>
  <path d="M40 215 L250 215" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="40" y="230" fill="#E2E8F0" font-size="12">43 |       &lt;Card key={item.id} name={item.name} /&gt;</text>
  <text x="40" y="250" fill="#64748B" font-size="12">44 |     ));</text>
  <text x="40" y="270" fill="#64748B" font-size="12">45 |   };</text>
  
  <!-- Stack Trace -->
  <text x="40" y="310" fill="#F87171" font-size="12" font-weight="bold">Call Stack:</text>
  <text x="50" y="330" fill="#94A3B8" font-size="11">at DashboardComponent (DashboardComponent.tsx:42:18)</text>
  <text x="50" y="350" fill="#94A3B8" font-size="11">at renderWithHooks (react-dom.development.js:15486:18)</text>
  <text x="50" y="370" fill="#94A3B8" font-size="11">at mountIndeterminateComponent (react-dom.development.js:18100:16)</text>
</svg>
`;

// 2. LeetCode Problem SVG
const leetcodeSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style="background:#1A1A1A; font-family: system-ui, sans-serif;">
  <!-- Browser Bar -->
  <rect x="0" y="0" width="600" height="35" fill="#2D2D2D"/>
  <text x="15" y="22" fill="#E0E0E0" font-size="12" font-weight="bold">leetcode.com/problems/two-sum</text>
  
  <!-- Sidebar -->
  <rect x="0" y="35" width="250" height="365" fill="#202020"/>
  <text x="20" y="65" fill="#FFFFFF" font-size="18" font-weight="bold">1. Two Sum</text>
  <rect x="20" y="80" width="55" height="20" rx="10" fill="#22C55E" fill-opacity="0.2"/>
  <text x="32" y="94" fill="#22C55E" font-size="11" font-weight="bold">Easy</text>
  
  <text x="20" y="130" fill="#DDDDDD" font-size="12" font-weight="normal">
    <tspan x="20" dy="0">Given an array of integers nums</tspan>
    <tspan x="20" dy="18">and an integer target, return</tspan>
    <tspan x="20" dy="18">indices of the two numbers</tspan>
    <tspan x="20" dy="18">such that they add up to target.</tspan>
  </text>
  
  <text x="20" y="210" fill="#FFFFFF" font-size="13" font-weight="bold">Example 1:</text>
  <rect x="20" y="220" width="210" height="60" rx="4" fill="#2A2A2A"/>
  <text x="30" y="238" fill="#B0B0B0" font-size="11" font-family="monospace">Input: nums = [2,7,11,15], target = 9</text>
  <text x="30" y="254" fill="#B0B0B0" font-size="11" font-family="monospace">Output: [0,1]</text>
  <text x="30" y="270" fill="#B0B0B0" font-size="11" font-family="monospace">Explanation: nums[0] + nums[1] == 9</text>

  <!-- Editor Pane -->
  <rect x="250" y="35" width="350" height="365" fill="#1E1E1E"/>
  <rect x="250" y="35" width="350" height="25" fill="#282828"/>
  <text x="265" y="52" fill="#888888" font-size="11" font-family="monospace">TypeScript</text>
  
  <text x="270" y="90" fill="#569CD6" font-size="12" font-family="monospace">function <tspan fill="#DCDCAA">twoSum</tspan><tspan fill="#CCCCCC">(nums: </tspan><tspan fill="#4EC9B0">number[]</tspan><tspan fill="#CCCCCC">, target: </tspan><tspan fill="#4EC9B0">number</tspan><tspan fill="#CCCCCC">): </tspan><tspan fill="#4EC9B0">number[]</tspan> {</text>
  <text x="270" y="110" fill="#9CDCFE" font-size="12" font-family="monospace">  const <tspan fill="#CCCCCC">map = new </tspan><tspan fill="#4EC9B0">Map</tspan><tspan fill="#CCCCCC">&lt;</tspan><tspan fill="#4EC9B0">number, number</tspan><tspan fill="#CCCCCC">&gt;();</tspan></text>
  <text x="270" y="130" fill="#C586C0" font-size="12" font-family="monospace">  for <tspan fill="#CCCCCC">(let i = 0; i &lt; nums.length; i++) {</tspan></text>
  <text x="270" y="150" fill="#CCCCCC" font-size="12" font-family="monospace">    // Todo: Solve optimally</text>
  <text x="270" y="170" fill="#CCCCCC" font-size="12" font-family="monospace">  }</text>
  <text x="270" y="190" fill="#C586C0" font-size="12" font-family="monospace">  return <tspan fill="#CCCCCC">[];</tspan></text>
  <text x="270" y="210" fill="#CCCCCC" font-size="12" font-family="monospace">}</text>
</svg>
`;

// 3. UI Mockup SVG
const uiMockupSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style="background:#0F1026;">
  <!-- Abstract colorful backing gradients -->
  <circle cx="150" cy="150" r="100" fill="#6366F1" opacity="0.15" filter="blur(40px)"/>
  <circle cx="450" cy="250" r="120" fill="#8B5CF6" opacity="0.15" filter="blur(40px)"/>

  <!-- Device Frame -->
  <rect x="180" y="20" width="240" height="360" rx="24" fill="#111827" stroke="#374151" stroke-width="3"/>
  <rect x="280" y="30" width="40" height="12" rx="6" fill="#1F2937"/>
  
  <!-- Interface App Cover -->
  <!-- Header -->
  <text x="300" y="80" fill="#F9FAFB" font-size="20" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">Synthetix AI</text>
  <text x="300" y="98" fill="#9CA3AF" font-size="11" text-anchor="middle" font-family="system-ui, sans-serif">Premium developer environments</text>
  
  <!-- Forms Glassmorphic -->
  <rect x="200" y="130" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05" stroke="#FFFFFF" stroke-opacity="0.1"/>
  <text x="212" y="146" fill="#6B7280" font-size="9" font-family="system-ui, sans-serif">EMAIL ADDRESS</text>
  <text x="212" y="162" fill="#F9FAFB" font-size="12" font-family="system-ui, sans-serif">admin@codelens.ai</text>
  
  <rect x="200" y="185" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05" stroke="#FFFFFF" stroke-opacity="0.1"/>
  <text x="212" y="201" fill="#6B7280" font-size="9" font-family="system-ui, sans-serif">PASSWORD</text>
  <text x="212" y="217" fill="#F9FAFB" font-size="12" font-family="system-ui, sans-serif">••••••••••••</text>
  
  <!-- Button Gradient -->
  <defs>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect x="200" y="250" width="200" height="38" rx="8" fill="url(#btnGrad)"/>
  <text x="300" y="274" fill="#FFFFFF" font-size="13" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">Launch Terminal</text>
  
  <!-- Divider -->
  <line x1="200" y1="310" x2="399" y2="310" stroke="#374151" stroke-width="1"/>
  <text x="300" y="313" fill="#4B5563" font-size="10" text-anchor="middle" fill-opacity="1" font-family="system-ui, sans-serif" bg="#111827">OR SIGN IN WITH</text>
  
  <!-- Social Icons placeholders -->
  <rect x="230" y="330" width="30" height="30" rx="15" fill="#1F2937" stroke="#374151"/>
  <text x="245" y="348" fill="#FFFFFF" font-size="12" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">G</text>
  
  <rect x="285" y="330" width="30" height="30" rx="15" fill="#1F2937" stroke="#374151"/>
  <text x="300" y="348" fill="#FFFFFF" font-size="12" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">GH</text>
  
  <rect x="340" y="330" width="30" height="30" rx="15" fill="#1F2937" stroke="#374151"/>
  <text x="355" y="348" fill="#FFFFFF" font-size="12" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">in</text>
</svg>
`;

// 4. System Design Diagram SVG
const systemDesignSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style="background:#0B0F19; font-family: system-ui, sans-serif;">
  <text x="300" y="30" fill="#F9FAFB" font-size="18" font-weight="bold" text-anchor="middle">Scalable Notification Architecture</text>
  
  <!-- User Client -->
  <rect x="30" y="160" width="80" height="50" rx="6" fill="#1F2937" stroke="#4B5563" stroke-width="1.5"/>
  <text x="70" y="190" fill="#FFFFFF" font-size="12" text-anchor="middle">Web Client</text>
  
  <!-- NGINX Load Balancer -->
  <rect x="160" y="150" width="80" height="70" rx="6" fill="#111827" stroke="#6366F1" stroke-width="2"/>
  <text x="200" y="180" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle">LB</text>
  <text x="200" y="200" fill="#8B5CF6" font-size="9" text-anchor="middle">Reverse Proxy</text>

  <!-- Service A (Notification API) -->
  <rect x="290" y="80" width="100" height="60" rx="6" fill="#1F2937" stroke="#3B82F6" stroke-width="1.5"/>
  <text x="340" y="110" fill="#FFFFFF" font-size="11" text-anchor="middle">Notify-Service A</text>
  <text x="340" y="125" fill="#3B82F6" font-size="9" text-anchor="middle">Instances [x3]</text>

  <!-- Service B (User Settings API) -->
  <rect x="290" y="240" width="100" height="60" rx="6" fill="#1F2937" stroke="#3B82F6" stroke-width="1.5"/>
  <text x="340" y="270" fill="#FFFFFF" font-size="11" text-anchor="middle">Users-Service B</text>
  <text x="340" y="285" fill="#3B82F6" font-size="9" text-anchor="middle">Instances [x2]</text>

  <!-- DB Store -->
  <path d="M480 180 C480 160, 550 160, 550 180 L550 230 C550 250, 480 250, 480 230 Z" fill="#111827" stroke="#EF4444" stroke-width="2"/>
  <ellipse cx="515" cy="180" rx="35" ry="10" fill="#1F2937" stroke="#EF4444" stroke-width="1.5"/>
  <text x="515" y="215" fill="#FFFFFF" font-size="12" text-anchor="middle">PostgreSQL</text>
  <text x="515" y="230" fill="#EF4444" font-size="9" text-anchor="middle">SPOF DB</text>

  <!-- Connectors -->
  <!-- Client to LB -->
  <path d="M 110 185 L 160 185" stroke="#9CA3AF" stroke-width="1.5" marker-end="url(#arrow)"/>
  
  <!-- LB to Service A -->
  <path d="M 240 170 L 290 120" stroke="#9CA3AF" stroke-width="1.5"/>
  
  <!-- LB to Service B -->
  <path d="M 240 200 L 290 260" stroke="#9CA3AF" stroke-width="1.5"/>

  <!-- Service A to DB -->
  <path d="M 390 120 L 480 190" stroke="#9CA3AF" stroke-width="1.5"/>

  <!-- Service B to DB -->
  <path d="M 390 270 L 480 220" stroke="#9CA3AF" stroke-width="1.5"/>

  <!-- Definitions for Arrows -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF"/>
    </marker>
  </defs>
</svg>
`;

export const demoItems: DemoItem[] = [
  {
    id: 'ERR_001_REACT_HOOK',
    name: 'React Map Error',
    category: 'Error Screenshot',
    description: 'A screenshot showing an unhandled runtime error inside a React render lifecycle, detailing an undefined map function lookup.',
    imageUrl: svgToDataUrl(reactErrorSvg),
    analysis: {
      type: 'Error Screenshot',
      confidence: 95,
      aiInsight: 'This screenshot appears to show a React routing or data mapping configuration issue caused by an undefined component reference, preventing successful application rendering.',
      developerImpact: 'Application halts immediately. The user dashboard view will crash for all active visitors until optional chaining or fallback default states are deployed.',
      summary: 'React runtime crash in DashboardComponent.tsx, caused by calling the .map() array method on an undefined "items" state array during render initialization.',
      keyFindings: [
        'Runtime null-pointer reference exception crashed the DOM tree.',
        'Component assumes API response is synchronous and always contains the items key.',
        'No local error boundary exists to isolate dashboard view crash.'
      ],
      issues: [
        'The destructured variable "items" from useDashboardData() evaluates to undefined before request completion.',
        'Missing standard fallback declarations inside the state hooks.',
        'Calling array methods directly on potentially missing keys without optional chaining.'
      ],
      suggestions: [
        'Initialize dashboard state hook with an empty array: const [items, setItems] = useState([])',
        'Add optional chaining (items?.map(...)) with an inline loading spinner or fallback element.',
        'Expose a clean isPending boolean indicator from useDashboardData() to pause rendering until resolving.'
      ],
      nextSteps: [
        'Inspect DashboardComponent.tsx around line 42.',
        'Change items.map(...) to items?.map(...) or check items && items.map(...)',
        'Provide a fallback UI state displaying a loading skeletal bar or "no data found" message.'
      ],
      processingTime: 2.3,
      modelUsed: 'gemma4:e4b'
    },
    actions: {
      generate_fix: {
        title: 'Proposed Code Hotfix for DashboardComponent.tsx',
        content: `### Proposed Code Hotfix for DashboardComponent.tsx

To fix the crash, apply optional chaining or verify items exists before calling \`.map()\`.

\`\`\`tsx
// Before (Crashes when items is undefined)
return (
  <div className="dashboard-grid">
    {items.map((item) => (
      <Card key={item.id} name={item.name} />
    ))}
  </div>
);

// After Fix Option A: Safe optional chaining and fallback
return (
  <div className="dashboard-grid">
    {items?.map((item) => (
      <Card key={item.id} name={item.name} />
    )) ?? (
      <div className="text-gray-400 p-4">No active dashboard items found.</div>
    )}
  </div>
);

// After Fix Option B: Include loading indicator check
const { items, isLoading } = useDashboardData();

if (isLoading) {
  return <DashboardSkeleton />;
}

return (
  <div className="dashboard-grid">
    {items && items.map((item) => (
      <Card key={item.id} name={item.name} />
    ))}
  </div>
);
\`\`\`
`
      },
      explain_error: {
        title: 'TypeError: Cannot read properties of undefined Explanation',
        content: `### Detailed Exception Explanation

This exception occurs because the Javascript runtime attempts to execute the \`Array.prototype.map()\` function on a variable holding a value of \`undefined\`.

#### Why it happens in React:
1. **Asynchronous Lifecycle:** Component initializes and mounts immediately. The network query inside \`useDashboardData()\` launches concurrently.
2. **First Render:** During the initial render, the query has not returned yet. Thus, \`items\` has no value set and resolves to \`undefined\`.
3. **Execution Crash:** React tries to execute the JSX render function. It encounters \`items.map(...)\`, cannot resolve \`map\` of \`undefined\`, and throws a fatal error that crashes the entire React fiber render tree.
`
      }
    }
  },
  {
    id: 'ALG_001_TWO_SUM',
    name: 'LeetCode Two Sum',
    category: 'LeetCode Problem',
    description: 'A screenshot showing LeetCode #1 Two Sum question description and a partially complete code editor.',
    imageUrl: svgToDataUrl(leetcodeSvg),
    analysis: {
      type: 'LeetCode Problem',
      confidence: 98,
      aiInsight: 'This screenshot details the classic LeetCode #1 array complement mapping question "Two Sum" with a partial, unoptimized editor space.',
      developerImpact: 'Understanding the Hash Map Complement pattern is crucial for O(N) lookup complexity and solves a broad class of matrix/array interview problems.',
      summary: 'Standard array traversal problem "Two Sum" requesting an index pair mapping. Requires matching numbers that sum to a target value.',
      keyFindings: [
        'Array problem requiring search optimization.',
        'Brute-force checking all pairs yields O(N^2) time complexity, which is suboptimal.',
        'Hash map lookup provides O(1) searches, reducing time to O(N).'
      ],
      issues: [
        'The active editor has an empty loop returning an empty array.',
        'Brute-force loop will exceed time limits on large inputs.',
        'Need to handle cases where no complement is found (though LeetCode guarantees exactly one solution).'
      ],
      suggestions: [
        'Use a Single-Pass Hash Map strategy to store elements and their indices on the fly.',
        'Avoid nested loops to optimize execution time.',
        'Track complements (target - current_number) in a Map for constant-time index queries.'
      ],
      nextSteps: [
        'Declare a hash table tracking Map<number, number> representing values and indices.',
        'Initiate a for-loop through the array.',
        'Compute target - nums[i] and check map presence. If found, return indices; otherwise, add value to map.'
      ],
      processingTime: 1.8,
      modelUsed: 'gemma4:e4b'
    },
    actions: {
      generate_solution: {
        title: 'Optimal Two Sum Code (TypeScript)',
        content: `### TypeScript Optimal Solution (Single-Pass Hash Map)

Here is the most efficient approach to solve Two Sum. It achieves **$O(N)$ time complexity** by storing indices in a hash map as we iterate.

\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  // Create a hash map to store: Key = Number, Value = Index
  const numToIndexMap = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i];
    const complement = target - currentNum;

    // Check if the complement already exists in the map
    if (numToIndexMap.has(complement)) {
      // Complement found! Return index of complement and current index
      return [numToIndexMap.get(complement)!, i];
    }

    // Otherwise, store the current number and its index in the map
    numToIndexMap.set(currentNum, i);
  }

  // Fallback case (though LeetCode guarantees a solution)
  return [];
}
\`\`\`

#### Complexities:
- **Time Complexity:** $O(N)$ because we iterate through the list of length $N$ exactly once. Each lookup in the Map is $O(1)$ on average.
- **Space Complexity:** $O(N)$ to store up to $N$ elements in the hash map.
`
      },
      show_optimal_pattern: {
        title: 'The Hash Map Complement Search Pattern',
        content: `### The Complement Search Pattern

This pattern resolves search problems where you need to find a pair of items satisfying a relationship (e.g., $x + y = target$).

Instead of searching for $y$ by scanning the rest of the array (brute force $O(N^2)$), you rewrite the equation to $y = target - x$. 

As you traverse each element $x$ in the array, you check if its "complement" $y$ is already saved in a fast lookup store (Hash Map). If it isn't, you record $x$ and continue. This yields an $O(N)$ time, $O(N)$ space tradeoff, which is the gold standard for lookup operations.
`
      }
    }
  },
  {
    id: 'UI_001_LOGIN_FLOW',
    name: 'SaaS Mobile Login',
    category: 'UI Mockup',
    description: 'A screenshot showing a premium high-fidelity mobile app login screen featuring glassmorphic overlay widgets.',
    imageUrl: svgToDataUrl(uiMockupSvg),
    analysis: {
      type: 'UI Mockup',
      confidence: 92,
      aiInsight: 'A mobile application login screen mockup utilizing modern dark-mode styles, neon backing radial glows, glassmorphism cards, and social OAuth widgets.',
      developerImpact: 'The layout implementation is low complexity. Standard Flexbox/Grid structures with back-drop filter blurs are sufficient to replicate the UI, suitable for rapid prototype iterations.',
      summary: 'High-fidelity mobile login UI design mock featuring glassmorphism form containers, background glow blur, and social OAuth login links.',
      keyFindings: [
        'Aesthetics are highly polished, dark mode fits SaaS themes.',
        'Form inputs use uniform rounded borders (8px).',
        'Text contrast on the secondary divider is low, violating WCAG compliance.'
      ],
      issues: [
        'Active and focus border states for fields are undefined.',
        'Social buttons overlap text if viewport size reduces on smaller screen heights.',
        'Color contrast on legal agreements and divider text does not meet WCAG AA (4.5:1) standards.'
      ],
      suggestions: [
        'Add a glow accent border (#6366F1) on input focus state changes.',
        'Increase text contrast for the "OR SIGN IN WITH" divider to #9CA3AF.',
        'Ensure touch targets for social buttons are at least 44x44px for accessibility compliance.'
      ],
      nextSteps: [
        'Integrate focus rings with shadow glows in CSS.',
        'Adjust margins and padding to accommodate responsive height scaling on mobile nodes.',
        'Adjust gray typography colors to dark slate gray tones with higher brightness.'
      ],
      processingTime: 2.7,
      modelUsed: 'gemma4:e4b'
    },
    actions: {
      generate_components: {
        title: 'React login component implementation',
        content: `### React Login Component with Glassmorphism (Tailwind)

Here is a responsive React component matching the design elements in the mockup, complete with state management and focus effects.

\`\`\`tsx
import React, { useState } from 'react';

export const LoginForm = () => {
  const [email, setEmail] = useState('admin@codelens.ai');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-sm overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
      {/* Background radial glows */}
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl"></div>
      <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-50 tracking-tight">Synthetix AI</h2>
        <p className="text-xs text-gray-400 mt-1 mb-8">Premium developer environments</p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-white/5 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 backdrop-blur-md outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-white/5 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 backdrop-blur-md outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>

          <button 
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Launch Terminal
          </button>
        </form>

        <div className="my-6 flex w-full items-center justify-between">
          <span className="h-[1px] w-1/4 bg-gray-800"></span>
          <span className="text-[10px] font-medium tracking-wider text-gray-500 uppercase">OR SIGN IN WITH</span>
          <span className="h-[1px] w-1/4 bg-gray-800"></span>
        </div>

        <div className="flex gap-4">
          {['G', 'GH', 'in'].map((social) => (
            <button key={social} className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              {social}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
\`\`\`
`
      },
      generate_tailwind_layout: {
        title: 'Tailwind CSS Layout Grid',
        content: `### Responsive Glassmorphism Grid Layout

Here are utility layouts and glassmorphic card classes used to frame the screen using Tailwind.

\`\`\`html
<!-- Outer container holding grid with gradient backdrops -->
<div class="relative min-h-screen bg-[#0B1020] flex items-center justify-center p-6">
  
  <!-- Backdrop Blur Circle Left -->
  <div class="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-600/10 blur-[80px]"></div>
  <!-- Backdrop Blur Circle Right -->
  <div class="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px]"></div>

  <!-- Central Card with Glassmorphic Border -->
  <div class="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-xl p-8 shadow-glass">
    <!-- Component headers and forms go inside here -->
  </div>
  
</div>
\`\`\`
`
      }
    }
  },
  {
    id: 'SYS_001_NOTIFICATION_ARCH',
    name: 'Notification Architecture',
    category: 'System Design Diagram',
    description: 'A screenshot showing a system design architectural blueprint detailing client flow down to databases and load balancers.',
    imageUrl: svgToDataUrl(systemDesignSvg),
    analysis: {
      type: 'System Design Diagram',
      confidence: 94,
      aiInsight: 'A notification system layout demonstrating horizontally scaled nodes, load balancers, and a single Postgres write node.',
      developerImpact: 'High operational risk. A single database node represents a Single Point of Failure (SPOF) that will cause total downtime in crashes. Missing queuing layers will drop notifications under surge loads.',
      summary: 'Basic microservices system architecture chart representing a notification pipeline routing via a single load balancer and writing to a single postgres database.',
      keyFindings: [
        'Web clients are distributed via load balancer routing.',
        'Notification API service is scaled horizontally across 3 nodes.',
        'Primary database is a single Postgres DB, presenting a critical single point of failure (SPOF).'
      ],
      issues: [
        'No replica nodes shown for Postgres DB, creating high data loss risks in crashes.',
        'No message broker is handling spikes or retries for failed mail notifications.',
        'Missing API gateway rate-limiters, exposing the system to denial of service attacks.'
      ],
      suggestions: [
        'Establish a Postgres Primary-Replica scheme, routing writes to primary and reads to secondary replicas.',
        'Insert a Message Queue (e.g. RabbitMQ, Redis PubSub) to buffer email dispatches.',
        'Add a Rate Limiting layer (e.g. Kong, NGINX Limit module) in front of the application nodes.'
      ],
      nextSteps: [
        'Configure Postgres hot standby replica databases.',
        'Install Celery/RabbitMQ or BullMQ/Redis worker process structures for async actions.',
        'Configure IP-based request threshold limits on the Load Balancer configurations.'
      ],
      processingTime: 2.0,
      modelUsed: 'gemma4:e4b'
    },
    actions: {
      improve_architecture: {
        title: 'Architectural Improvement Proposal',
        content: `### Upgraded Notification Architecture

To resolve the Single Point of Failure (SPOF) and buffering issues, we propose adding a Message Queue and Database Replicas.

#### Proposed Architecture Flow:
1. **API Gateway / Rate Limiting:**
   - Integrate an API Gateway (e.g., Kong, Envoy) to rate-limit requests to 100 reqs/min per IP.
2. **Message Broker (Queue):**
   - Service A (Notification API) pushes notification payloads to **RabbitMQ** instead of invoking mail APIs directly.
   - Separate **Worker Processes** consume tasks from the queue at a controlled pace, handling failures and retries.
3. **Database Replication:**
   - Deploy one Primary Postgres node (writes) and two Read Replicas (reads). Set up automated failover (e.g., using pg_auto_failover).

\`\`\`mermaid
graph TD
  Client[Web Client] --> Gateway[API Gateway & Rate Limiter]
  Gateway --> LB[Load Balancer]
  LB --> ServiceA[Notification Service A]
  LB --> ServiceB[User Service B]
  
  ServiceA --> Queue[(RabbitMQ Message Queue)]
  Queue --> Workers[Background Mail Workers]
  Workers --> EmailAPI[Third-party Email API]
  
  ServiceB --> DB_Primary[(Postgres Primary Write)]
  DB_Primary -. Replication .-> DB_Replica[(Postgres Read Replica)]
  Workers --> DB_Replica
\`\`\`
`
      },
      find_bottlenecks: {
        title: 'Bottleneck & Vulnerability Mapping',
        content: `### High-Priority Architectural Vulnerabilities

1. **Database Lock contention:**
   - Since both services perform direct synchronous CRUD operations on the same Postgres instance, a sudden spike in notification logs will exhaust the DB connection pool, locking reads for User settings.
   
2. **Synchronous SMTP blocks:**
   - In the current design, if the third-party email provider is slow or drops connection, the HTTP request thread in Service A waits, blocking memory, and eventually crashing the service.
   
3. **Load Balancer capacity limits:**
   - Without an API Gateway caching headers, every static configuration query travels directly to the backend servers, increasing overall network latency.
`
      }
    }
  }
];
