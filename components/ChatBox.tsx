import { useUser } from "@clerk/nextjs";
import React, {
  FormEvent,
  startTransition,
  useRef,
  useState,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";
import ChatMessage from "./ChatMessage";
import { askQuestion } from "@/actions/askQuestion";

export interface Message {
  id?: String;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
}

const ChatBox = ({ id }: { id: string }) => {
  const { user } = useUser();
  const [input, setInput] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement | null>(null);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const userQuestion = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: userQuestion,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);
    console.log("🚀 ~ handleSubmit ~ userQuestion:", userQuestion);
    startTransition(async () => {
      const reply = await askQuestion(id, userQuestion);
      if (reply) {
        setMessages((prev) => [
          ...prev,
          { createdAt: new Date(), role: "ai", message: reply },
        ]);
      }
      setLoading(false);
    });
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
          </div>
        ) : (
          <div className="p-5">
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "Ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}{" "}
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={bottomOfChatRef} />
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
      >
        <Input
          placeholder="Ask a Question..."
          value={input || ""}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
