import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/lib/chat/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "mb-2",
        message.type === "input" ? "text-green-400" : "text-green-500"
      )}
    >
      <span className="mr-2">
        {message.type === "input" ? ">" : "$"}
      </span>
      {message.content}
    </div>
  );
}