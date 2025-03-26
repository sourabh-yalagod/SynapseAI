"use server";
import { Message } from "@/components/ChatBox";
import { generateReply } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

export async function askQuestion(id: string, question: string) {
  auth.protect();
  const { userId } = await auth();
  console.log("🚀 ~ askQuestion ~ userId:", userId);

  // const chats=await Chats.find(id)
  // get the human or User messages / Questions
  const chats = [];

  const reply = await generateReply(id, question);
  console.log("🚀 ~ askQuestion ~ reply:", reply);
  const newQuestion: Message = {
    createdAt: new Date(),
    message: question,
    role: "human",
  };
  // await chats.add(newQuestion)
  return reply;
}
