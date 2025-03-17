import { Document } from "@/models/model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please authenticate....!" },
      { status: 400 }
    );
  }
  console.log(userId);

  try {
    const documents = await Document.find({ clerkId: userId });

    return NextResponse.json(
      { message: "Document are fetched successfully", data: documents },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "you have No documets" },
      { status: 400 }
    );
  }
}
