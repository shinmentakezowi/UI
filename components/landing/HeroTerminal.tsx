"use client";

import { useEffect, useState } from "react";
import {
  motion,
} from "framer-motion";
import {
  Terminal as TerminalIcon,
} from "lucide-react";

const PythonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <text x="24" y="34" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="currentColor" textAnchor="middle">PY</text>
  </svg>
);

const TypeScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <path d="M6 6h36v36H6z" fill="currentColor" fillOpacity="0.1" />
    <text x="24" y="34" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="currentColor" textAnchor="middle">TS</text>
  </svg>
);

const GitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 8V16M6 12H10L18 12" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const codeSnippets = [
  {
    id: "curl",
    name: "claude-code.sh",
    language: "bash",
    icon: TerminalIcon,
    color: "text-green-400",
    code: `export ANTHROPIC_BASE_URL=\\
  https://beta.hapuppy.com
export ANTHROPIC_AUTH_TOKEN=sk-hapuppy-...

claude

# Connected to Hapuppy Gateway
# Routing to: anthropic/claude-sonnet
# Latency: 42ms`,
  },
  {
    id: "py",
    name: "openai-client.py",
    language: "python",
    icon: PythonIcon,
    color: "text-yellow-400",
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://beta.hapuppy.com/v1",
    api_key="sk-hapuppy-..."
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hi"}]
)

print(response.choices[0].message.content)`,
  },
  {
    id: "ts",
    name: "streaming.ts",
    language: "typescript",
    icon: TypeScriptIcon,
    color: "text-blue-400",
    code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://beta.hapuppy.com/v1',
  apiKey: process.env.HAPUPPY_KEY
});

const stream = await client.chat.completions.create({
  model: 'claude-sonnet-4-20250514',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(
    chunk.choices[0]?.delta?.content || ''
  );
}`,
  },
];

export function HeroTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedCode, setDisplayedCode] = useState("");
  useEffect(() => {
    setIsTyping(true);
    setDisplayedCode("");
    let i = 0;
    const code = codeSnippets[activeTab].code;

    const interval = setInterval(() => {
      setDisplayedCode(code.substring(0, i));
      i++;
      if (i > code.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [activeTab]);

  const ActiveIcon = codeSnippets[activeTab].icon;

  return (
    <div className="relative group perspective-1000 w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto z-20">
      {/* Ambient Glow */}
      <div className="absolute -inset-10 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-pink-600/30 rounded-[40px] blur-3xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse-slow" />

      <motion.div
        initial={{ rotateY: 15, rotateX: 5 }}
        whileHover={{ rotateY: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="relative h-[420px] flex flex-col bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5 transform-style-3d group-hover:border-white/20"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
            <TerminalIcon className="w-3 h-3" />
            <span>bash — 80x24</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center px-2 bg-black/20 overflow-x-auto scrollbar-hide">
          {codeSnippets.map((snippet, index) => (
            <button
              key={snippet.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono transition-all relative ${
                activeTab === index
                  ? "text-white bg-white/5 border-t-2 border-violet-500"
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border-t-2 border-transparent"
              }`}
            >
              <snippet.icon className="w-3 h-3" />
              {snippet.name}
            </button>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden relative bg-[#050505]">
          {/* Line Numbers */}
          <div className="absolute left-0 top-6 bottom-0 w-12 flex flex-col items-end pr-4 text-white/10 select-none text-xs leading-relaxed border-r border-white/5 bg-white/[0.01]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <div className="pl-10 relative z-10">
            <pre className={`language-${codeSnippets[activeTab].language} ${codeSnippets[activeTab].color}`}>
              <code>{displayedCode}</code>
              {isTyping && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-violet-500 align-middle ml-1 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
              )}
            </pre>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-1.5 border-t border-white/5 bg-black/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <GitIcon className="w-3 h-3" />
              <span>main*</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ActiveIcon className="w-3 h-3" />
              {codeSnippets[activeTab].language}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isTyping ? "bg-yellow-500 animate-pulse" : "bg-green-500 shadow-[0_0_5px_#22c55e]"}`}
            />
            {isTyping ? "BUILDING..." : "READY"}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
