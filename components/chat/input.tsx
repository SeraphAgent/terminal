import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-green-500/30 pt-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}