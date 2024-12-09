"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { VirtualsAPI } from "@/lib/chat/api";
import { ChatMessage } from "@/lib/chat/types";
import { useWalletConnection } from "@/lib/web3/hooks/use-wallet-connection";

export function Terminal() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    { 
      type: "output", 
      content: "Initializing Seraph Neural Interface...",
      timestamp: Date.now()
    },
    { 
      type: "output", 
      content: "Connecting to Virtuals Protocol...",
      timestamp: Date.now() + 1
    },
    { 
      type: "output", 
      content: 'Ready for interaction. Type a message to begin.',
      timestamp: Date.now() + 2
    },
  ]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const { address } = useWalletConnection();

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !address) return;

    const userInput = input.trim();
    setInput("");

    // Add user input to history
    setHistory(prev => [...prev, { 
      type: "input", 
      content: userInput,
      timestamp: Date.now()
    }]);

    setIsLoading(true);

    try {
      const response = await VirtualsAPI.sendMessage(address, userInput);
      
      // Add response to history
      setHistory(prev => [...prev, { 
        type: "output", 
        content: response,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setHistory(prev => [...prev, { 
        type: "output", 
        content: "Error: Unable to process message. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto font-mono text-sm mb-4 terminal-scroll">
        {history.map((entry, i) => (
          <div
            key={`${entry.timestamp}-${i}`}
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
            disabled={isLoading}
            className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-2 text-green-500 font-mono focus:outline-none focus:border-green-500 placeholder-green-500/50 disabled:opacity-50"
            placeholder={isLoading ? "Processing..." : "Enter your message..."}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500/10 border border-green-500/30 rounded p-2 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-green-500" />
        </button>
      </form>
    </div>
  );
}