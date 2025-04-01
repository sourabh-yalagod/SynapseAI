import { deleteCloudinaryAsset, getPublicIdFromUrl } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Chat, Document } from "@/models/model";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const docId = (await params).id;

  try {
    await connectDB();
    const doc = await Document.findById(docId);
    return NextResponse.json({
      message: `Document Fetched successfully`,
      success: true,
      data: doc,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error while fetching Document with ID : ${docId}`,
      success: false,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Document ID not Found....!" },
      { status: 401 }
    );
  }

  const document = await Document.findByIdAndDelete(id);
  if (!document) {
    return NextResponse.json(
      { error: "Document Deletion Failed....!" },
      { status: 401 }
    );
  }
  await Chat.deleteOne({ documentId: id });
  const DocumentPublicId = getPublicIdFromUrl(document.url);
  console.log(DocumentPublicId);

  const deleteCloudinaryAssetResponse = await deleteCloudinaryAsset(
    DocumentPublicId
  );
  console.log(
    "deleteCloudinaryAssetResponse : ",
    deleteCloudinaryAssetResponse
  );

  return NextResponse.json({
    data: document,
    message: "Document deleted successfully.",
  });
}
