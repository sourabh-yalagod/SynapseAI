import { generateEmbeddingInVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const generateEmbedding = async (docId: string) => {
  await auth.protect();
  const vectoreStore = await generateEmbeddingInVectorStore(docId);
  if (!vectoreStore) return false;
  revalidatePath("/dashboard");

  return true;
};
