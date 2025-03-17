import { Document } from "@/models/model";
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

  return NextResponse.json({
    data: document,
    message: "Document deleted successfully.",
  });
}
