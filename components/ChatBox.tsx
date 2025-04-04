import { useUser } from "@clerk/nextjs";
import React, {
  FormEvent,
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";
import ChatMessage from "./ChatMessage";
import { askQuestion } from "@/actions/askQuestion";
import axios from "axios";
import useSubscription from "@/hooks/useSubscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetChatsQuery, useNewChatMutation } from "@/app/state/api";
import { axiosInstance } from "@/lib/axiosInstance";

export interface Message {
  id?: String;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt?: Date;
}

const ChatBox = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: chatsPayload,
    isLoading: chatsLoading,
    error: chatsError,
  } = useGetChatsQuery(id, {
    skip: !user?.id,
  });
  console.log("useGetChatsQuery : ", {
    chatsPayload,
    chatsLoading,
    chatsError,
  });

  const [input, setInput] = useState<string | null>(null);
  const { hasActiveMembership } = useSubscription();
  const [newChat] = useNewChatMutation();
  const [chatCount, setChatCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement | null>(null);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;

    if (chatCount >= 6 && !hasActiveMembership) {
      console.log("Hey this is from here");
      const message = `You have exceeded the Free tier chat limit please upgrade to pro to chats more then 3 ...!`;
      const redirect = `/dashboard/upgrade`;
      toast.warning(message, {
        action: {
          label: "upgrade to PRO",
          onClick: () => router.push(redirect),
        },
        duration: 50000,
      });
      console.log("Hey this is from here");

      return;
    }
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
      const reply = await askQuestion(id, userQuestion, messages);
      if (reply) {
        setMessages((prev) => prev?.filter((e) => e.message !== "Thinking..."));
        setMessages((prev) => [
          ...prev,
          { createdAt: new Date(), role: "ai", message: reply },
        ]);
        const humanMessage = {
          message: userQuestion,
          role: "human",
        };
        const aiMessage = {
          message: reply,
          role: "ai",
        };
        const { data } = await newChat({
          humanMessage,
          aiMessage,
          documentId: id,
        });
        console.log("New Chat Message : ", data);
      }
      setChatCount(messages?.length || 0);
      setLoading(false);
    });
  };
  useEffect(() => {
    setMessages(chatsPayload?.data?.chats);
    setChatCount(chatsPayload?.data?.chats?.length);
  }, [chatsPayload, chatsError]);

  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="flex-1 w-full">
        {chatsLoading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
          </div>
        ) : (
          <div className="p-5">
            {messages?.length === 0 && (
              <ChatMessage
                isLoading={false}
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "Ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}{" "}
            {messages?.map((message, index) => (
              <ChatMessage
                isLoading={chatsLoading}
                key={index}
                message={message}
              />
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
