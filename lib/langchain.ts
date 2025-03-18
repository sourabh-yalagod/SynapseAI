import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { auth } from "@clerk/nextjs/server";
import pineconeClient from "@/lib/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@/models/model";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { config } from "dotenv";
import { openAIKey } from "@/key";
config();
// Debugging: Check if the API key is loaded
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : "Not Loaded"
);

// Initialize model

const model = new ChatOpenAI({
  apiKey: openAIKey,
  model: "gpt-4o",
});

async function validateApiKey() {
  try {
    console.log("Validating OpenAI API key...");
    const response = await model.invoke("Hello, world!"); // Simple test call
    console.log("API key is valid. Response:", response.content);
  } catch (error) {
    console.error("API key validation failed:", error);
    throw new Error(
      "Invalid OpenAI API key. Please check your environment variables."
    );
  }
}

// Call the validation function
validateApiKey();

// indexName from PineCone
export const indexName = "interact-with-ai-index";

// Check namespace status
async function checkSpaceExist(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null || namespace == "") {
    throw new Error("Name space required....! [isNameSpaceExist]");
  }
  const { namespaces } = await index.describeIndexStats();
  if (namespaces === undefined) return false;
  return namespaces[namespace] !== undefined || "";
}

// Fetch the doc and generate embeddings
async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!docId) return;
  if (!userId) {
    throw new Error("User not Authenticated [generateDocs]");
  }
  const docFile = await Document.findById(docId);
  if (!docFile.url) {
    throw new Error("Document URL not Found [generateDocs]");
  }
  console.log(`Download URL : ${docFile.url}`);

  // Fetch the PDF and turn to blob
  const response = await fetch(docFile.url);
  const data = await response.blob();

  // Load the PDF File
  console.log(`-------- Loading the PDF DOC --------`);

  const loader = new PDFLoader(data);
  const docs = await loader.load();
  // Split the Document

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`Doc Split into ${splitDocs.length} parts`);

  return splitDocs || [];
}

export async function generateEmbeddingInVectorStore(docId: string) {
  const { userId } = await auth();
  if (!docId) return;
  if (!userId) {
    throw new Error(
      "User not Authenticated [generateEmbeddingInPineconeVectorStore]"
    );
  }
  console.log(`Generating Embedding from DOC : ${docId}`);

  const embeddings = new OpenAIEmbeddings({
    apiKey: openAIKey,
  });
  // Connect to Pinecone with indexName
  const index = await pineconeClient.index(indexName);

  const isNameSpaceExist = await checkSpaceExist(index, docId);
  console.log(
    "🚀 ~ generateEmbeddingInPineconeVectorStore ~ isNameSpaceExist:",
    isNameSpaceExist
  );
  let pineconeVectorStore;
  if (isNameSpaceExist) {
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      namespace: docId,
      pineconeIndex: index,
    });
  } else {
    console.log("------------ Generate DOCS ----------");

    const splitDocs = await generateDocs(docId);
    if (splitDocs?.length === 0 || splitDocs === null) {
      throw new Error("Split Docs are invalid");
    }
    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs!,
      embeddings,
      {
        namespace: docId.toString(),
        pineconeIndex: index,
      }
    );
    return pineconeVectorStore;
  }
}
