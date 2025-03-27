import { deleteCloudinaryAsset, getPublicIdFromUrl } from "@/lib/cloudinary";
import { Chat, Document } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = await params;
  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID not Found....!" },
      { status: 401 }
    );
  }

  const document = await Document.findByIdAndDelete(documentId);
  if (!document) {
    return NextResponse.json(
      { error: "Document Deletion Failed....!" },
      { status: 401 }
    );
  }
  await Chat.deleteOne({ documentId });
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
