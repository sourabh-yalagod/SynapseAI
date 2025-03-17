import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("PINECONE API KEY is required......!");
}

const pineconeClient = new Pinecone({ apiKey });
export default pineconeClient;
