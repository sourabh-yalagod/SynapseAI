import stripe from "@/lib/stripe";
import { Subscription } from "@/models/model";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("Hey this is From webhook");
  const header = await headers();
  const body = await req.text();

  const signature = header.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Stripe Signature not FOUND....!" },
      { status: 401 }
    );
  }
  const webhookSecrete = process.env.STRIPE_WEBHOOK_SECRETE_KEY;
  if (!webhookSecrete) {
    return NextResponse.json(
      { error: "Stripe STRIPE_WEBHOOK_SECRETE_KEY Required....!" },
      { status: 401 }
    );
  }
  let event: Stripe.Event;
  let customerId = null;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecrete);
    const session = event.data.object as Stripe.Checkout.Session;
    customerId = session.customer as string;
    console.log("customerId : ", customerId);
  } catch (error) {
    return NextResponse.json(
      { error: error || "Stripe Event Error....!" },
      { status: 501 }
    );
  }
  console.log("event.type : ", event.type);
  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      console.log("payment_intent.succeeded");
      console.log("checkout.session.completed");
      const subscription = await Subscription.findOne({
        customerId,
      });
      if (subscription) subscription.isValid = true;
      await subscription.save();
      console.log("🚀 ~ POST ~ subscription:", subscription);
      return NextResponse.json({ message: "webhook received" });
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      console.log("payment_intent.deleted");
      console.log("checkout.session.cancled");

      const subscription = await Subscription.findOne({
        customerId,
      });

      if (subscription) subscription.isValid = false;
      await subscription.save();
      console.log("🚀 ~ POST ~ subscription:", subscription);
      return NextResponse.json({ message: "webhook received" });
    }
    default:
      return NextResponse.json({ message: "webhook received" });
  }
}
