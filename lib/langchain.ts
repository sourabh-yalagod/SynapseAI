import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { auth } from "@clerk/nextjs/server";
import pineconeClient from "@/lib/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@/models/model";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// initialize model
console.log(
  process.env.OPENAI_API_KEY ? "OPEN_API_KEY Loaded" : "OPEN_API_KEY Unloaded"
);

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});
// indexName from PineCone
export const indexName = "interact-with-ai-index";

// check name space status

async function checkSpaceExist(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null || namespace == "") {
    throw new Error("Name space reuqired....! [isNameSpaceExist]");
  }
  const { namespaces } = await index.describeIndexStats();
  if (namespaces === undefined) return false;
  return namespaces[namespace] !== undefined || "";
}

// fetch the doc and generate embeddings

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

  // fetch the PDF and turn to blob
  const response = await fetch(docFile.url);
  const data = await response.blob();

  // load the PDF File
  console.log(`-------- Loading the PDF DOC --------`);

  const loader = new PDFLoader(data);
  const docs = await loader.load();
  //   split the Document

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`Doc Splitted into ${splitDocs.length} parts`);

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
  console.log(`Generating Embadding from DOC : ${docId}`);

  const embeddings = new OpenAIEmbeddings();
  // connenct to pinecone with indexName
  const index = await pineconeClient.index(indexName);

  const isNameSpaceExist = await checkSpaceExist(index, docId);
  console.log(
    "🚀 ~ generateEmbeddingInPineconeVectorStore ~ isNameSpaceExist:",
    isNameSpaceExist
  );
  let pineconeVectoreStore;
  if (isNameSpaceExist) {
    pineconeVectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
      namespace: docId,
      pineconeIndex: index,
    });
  } else {
    console.log("------------ Generate DOCS ----------");

    const splitDocs = await generateDocs(docId);
    if (splitDocs?.length === 0 || splitDocs === null) {
      throw new Error("Split Docs are invalid");
    }
    pineconeVectoreStore = await PineconeStore.fromDocuments(
      splitDocs!,
      embeddings,
      {
        namespace: docId.toString(),
        pineconeIndex: index,
      }
    );
    return pineconeVectoreStore;
  }
}
