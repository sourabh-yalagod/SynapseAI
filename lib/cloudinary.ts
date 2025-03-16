import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();
console.log(
  "process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : ",
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
);

cloudinary.config({
  cloud_name: process.env.NEXT_PUBILC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBILC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBILC_CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  fileBuffer: Buffer,
  mimeType: string
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer); // Send the buffer to Cloudinary
  });
};

export { cloudinary };
