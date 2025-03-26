import { connectDB } from "@/lib/db";
import { Document } from "@/models/model";
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
      error: `Document Fetched successfully`,
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
