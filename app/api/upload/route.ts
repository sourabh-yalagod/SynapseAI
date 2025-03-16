import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Document } from "@/models/model";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please authenticate....!" },
      { status: 400 }
    );
  }
  const user = (await clerkClient()).users.getUser(userId);
  const username =
    (await user).username ||
    (await user).emailAddresses[0].emailAddress.split("@")[0] ||
    "unknown";

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", file.name, file.type, file.size);

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the buffer directly to Cloudinary
    const response: any = await uploadOnCloudinary(buffer, file.type);

    console.log("File uploaded successfully:", response);
    if (!response.secure_url) {
      return NextResponse.json(
        { message: "file uploading failed....!" },
        { status: 400 }
      );
    }
    await connectDB();
    const newDocument = await Document.create({
      clerkId: userId,
      username,
      url: response?.secure_url || response?.url,
    });
    console.log("🚀 ~ POST ~ newDocument:", newDocument);
    if (!newDocument) {
      return NextResponse.json(
        {
          error: "Document Creation failed",
          url: response?.secure_url || response?.url,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "File uploaded",
      url: response?.secure_url || response?.url,
      document: newDocument,
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
