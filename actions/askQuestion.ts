"use server";
import { Message } from "@/components/ChatBox";
import { connectDB } from "@/lib/db";
import { generateReply } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function askQuestion(id: string, question: string, chats: any[]) {
  console.log("Chats from Ask ", chats);
  auth.protect();
  const { userId } = await auth();
  console.log("🚀 ~ askQuestion ~ userId:", userId);

  const reply = await generateReply(id, question, chats);
  console.log("🚀 ~ askQuestion ~ reply:", reply);

  return reply;
}
