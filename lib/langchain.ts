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
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

config();
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "OpenAI API Key loaded.....!" : "Not Loaded"
);

// Initialize model

const model = new ChatOpenAI({
  apiKey: openAIKey,
  model: "gpt-4o",
});

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
  if (!userId) {
    throw new Error(
      "User not Authenticated.....! [generateEmbeddingInPineconeVectorStore]"
    );
  }
  if (!docId) {
    throw new Error(
      "DocumentID Required.....! [generateEmbeddingInPineconeVectorStore]"
    );
  }
  console.log(`Generating Embedding from DOC - ID : ${docId}`);

  const embeddings = new OpenAIEmbeddings({
    apiKey: openAIKey,
  });

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
  }
  return pineconeVectorStore;
}
export const generateReply = async (
  docId: string,
  question: string,
  chatsHistory: any[] = []
): Promise<string> => {
  const pineconeVectorStore = generateEmbeddingInVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("PINECONE is not available....!");
  }
  const retriever = (await pineconeVectorStore).asRetriever();
  const chathistory: any[] = chatsHistory?.map(({ role, message }) => [
    role,
    message,
  ]);
  console.log(chathistory);

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chathistory,
    ["human", "{input}"],
    [
      "human",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context:\n\n{context}",
    ],

    ...chathistory,

    ["human", "{input}"],
  ]);
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chathistory,
    input: question,
  });

  console.log(reply.answer);
  return reply?.answer;
};
