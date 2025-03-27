import { connectDB } from "@/lib/db";
import { Chat } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { humanMessage, aiMessage } = body;
    const { id } = await params;

    if (!humanMessage || !aiMessage || !id) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    let chat = await Chat.findOne({ documentId: id });

    if (chat) {
      chat.chats.push(
        { message: humanMessage.message, role: humanMessage.role },
        { message: aiMessage.message, role: aiMessage.role }
      );
      await chat.save();
      return NextResponse.json(
        { message: "Chats updated", data: chat },
        { status: 201 }
      );
    } else {
      chat = await Chat.create({
        documentId: id,
        chats: [
          { message: humanMessage.message, role: humanMessage.role },
          { message: aiMessage.message, role: aiMessage.role },
        ],
      });

      return NextResponse.json(
        { message: "New chat created", data: chat },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const documentId = await params.id;
  console.log("documentId : ", documentId);

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID Required....!" },
      { status: 401 }
    );
  }
  const chats = await Chat.findOne({ documentId });
  return NextResponse.json(
    {
      data: chats,
      message: "Chats were fetched successfully.",
    },
    { status: 201 }
  );
}
