// fetch(
//   "https://res.cloudinary.com/daaqothd4/image/upload/v1742147937/ypr5amphdcmzhgwt0wvz.pdf"
// )
//   .then((res) => res.blob()) // Convert response to Blob
//   .then((blob) => {
//     console.log("Blob Object:", blob);
//     const blobUrl = URL.createObjectURL(blob);
//     console.log("Blob URL:", blobUrl);

//     // Redirect to the Blob URL
//     window.location.href = blobUrl;
//   })
//   .catch((error) => console.error("Error fetching the file:", error));
import { OpenAI } from "@langchain/openai";
import { openAIKey } from "./key.js";

const model = new OpenAI({
  openAIApiKey: openAIKey,
});
const res = await model.call("some crazy facts about Trump...!");
console.log(res);
