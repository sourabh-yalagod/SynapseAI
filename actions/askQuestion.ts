"use server";
import { Message } from "@/components/ChatBox";
import { connectDB } from "@/lib/db";
import { generateReply } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function askQuestion(id: string, question: string) {
  auth.protect();
  const { userId } = await auth();
  console.log("🚀 ~ askQuestion ~ userId:", userId);

  const reply = await generateReply(id, question);
  console.log("🚀 ~ askQuestion ~ reply:", reply);

  const humanMessage = {
    message: question,
    role: "human",
  };
  const aiMessage = {
    message: reply,
    role: "ai",
  };
  try {
    const { data } = await axios.post(`http:/localhost:3000/api/chats/${id}`, {
      humanMessage,
      aiMessage,
    });
    console.log("🚀 ~ askQuestion ~ data:", data);
  } catch (error) {
    console.log(error);
  } finally {
    return reply;
  }
}
