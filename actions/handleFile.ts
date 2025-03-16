import { uploadOnCloudinary } from "@/lib/cloudinary";

export async function handleFile(file: File) {
  if (!file.name) return;
  const response = await uploadOnCloudinary(file.name);
  console.log(response);
  return response;
}
