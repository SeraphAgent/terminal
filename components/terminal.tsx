"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ type: "input" | "output", content: string }>>([
    { type: "output", content: "Initializing Seraph Neural Interface..." },
    { type: "output", content: "Connected to Bittensor Network." },
    { type: "output", content: "Ready for queries. Type 'help' for available commands." },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user input to history
    setHistory(prev => [...prev, { type: "input", content: input }]);

    // Simulate response (replace with actual API call later)
    setTimeout(() => {
      setHistory(prev => [...prev, { 
        type: "output", 
        content: "Processing query through neural consensus network..." 
      }]);
    }, 500);

    setInput("");
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto font-mono text-sm mb-4 terminal-scroll">
        {history.map((entry, i) => (
          <div
            key={i}
            className={cn(
              "mb-2",
              entry.type === "input" ? "text-green-400" : "text-green-500"
            )}
          >
            <span className="mr-2">
              {entry.type === "input" ? ">" : "$"}
            </span>
            {entry.content}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-green-500/30 pt-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-2 text-green-500 font-mono focus:outline-none focus:border-green-500 placeholder-green-500/50"
            placeholder="Enter your query..."
          />
        </div>
        <button
          type="submit"
          className="bg-green-500/10 border border-green-500/30 rounded p-2 hover:bg-green-500/20 transition-colors"
        >
          <Send className="w-5 h-5 text-green-500" />
        </button>
      </form>
    </div>
  );
}