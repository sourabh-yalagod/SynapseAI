"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BotIcon, Loader, Loader2Icon, Rocket } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./ChatBox";
import { useEffect, useRef } from "react";

function ChatMessage({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isHuman = message.role === "human";
  const { user } = useUser();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div>
      {message.role === "human" ? (
        <div className="flex flex-1 w-full">
          {user?.imageUrl && (
            <div className="w-full space-y-1 py-1">
              <Image
                src={user?.imageUrl}
                width={25}
                height={25}
                className="rounded-full"
                alt="UserImage"
              />
              <p className="bg-slate-800 p-1 flex-wrap bg-opacity-80 font-light text-sm rounded-md w-full">
                {message.role == "human" && message.message}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full space-y-1 py-1">
          {message.message == "Thinking..." ? (
            <Rocket className="animate-ping" />
          ) : (
            <Rocket />
          )}
          <div className="bg-slate-800 p-1 flex items-center gap-2 flex-wrap bg-opacity-80 font-light text-sm rounded-md w-full">
            {message.role == "ai" && message.message}
            {message.message == "Thinking..." && (
              <Loader className="animate-spin" color="gray" />
            )}
          </div>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}
export default ChatMessage;
