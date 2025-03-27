import { Subscription } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = (await params).id;
  console.log(userId);
  if (!userId) {
    return NextResponse.json(
      { error: "UserId Required....!" },
      { status: 401 }
    );
  }
  const subscription = await Subscription.findOne({ userId });
  if (!subscription) {
    return NextResponse.json(
      { message: "use need to subscription" },
      { status: 201 }
    );
  }
  return NextResponse.json(
    {
      message: "User Suscription exist",
      subscription: subscription,
    },
    { status: 201 }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerId, isValid, userId } = body;
  if (!customerId || isValid === undefined || !userId) {
    return NextResponse.json(
      { error: "CustomerId Subscription IsValid and UserId is required....!" },
      { status: 401 }
    );
  }
  console.log("{ customerId, isValid, userId } : ", {
    customerId,
    isValid,
    userId,
  });

  const newSubscription = await Subscription.create({
    customerId,
    isValid,
    userId,
  });
  if (!newSubscription) {
    return NextResponse.json(
      { error: "Subscription record failed to store in DB" },
      { status: 401 }
    );
  }
  return NextResponse.json(
    { message: "Subscription record stored in DB", data: newSubscription },
    { status: 201 }
  );
}
