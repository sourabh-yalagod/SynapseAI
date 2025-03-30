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
  let userId = null;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecrete);
    const session = event.data.object as Stripe.Checkout.Session;
    customerId = session.customer as string;
    userId = session?.metadata?.userId as string;
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
      const subscription = await Subscription.findOne({
        customerId,
      });
      if (subscription) {
        subscription.isValid = true;
        await subscription.save();
      }
      return NextResponse.json({ message: "webhook received" });
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled":
    case "subscription_schedule.expiring": {
      const subscription = await Subscription.findOne({
        customerId,
      });

      if (subscription) {
        subscription.isValid = false;
        await subscription.save();
      }
      return NextResponse.json({ message: "webhook received" });
    }
    case "customer.subscription.updated": {
      const previousAttributes: any = event.data.previous_attributes;
      const subEvent: any = event.data.object;
      console.log("-----------------------------------------------");
      console.log("-----------------------------------------------");

      if (subEvent?.canceled_at && subEvent?.cancel_at_period_end) {
        const subscription = await Subscription.findOneAndUpdate(
          {
            $or: [{ customerId }, { userId }],
          },
          { isValid: false },
          { new: true }
        );
        console.log("subscription canceled", subscription);
        return NextResponse.json({
          message: "webhook received",
          subscription,
        });
      }

      if (
        previousAttributes?.cancel_at_period_end &&
        !subEvent.cancel_at_period_end
      ) {
        const subscription = await Subscription.findOneAndUpdate(
          {
            $or: [{ customerId }, { userId }],
          },
          { isValid: true },
          { new: true }
        );

        console.log("subscription renewd", subscription);
        return NextResponse.json({
          message: "webhook received",
          subscription,
        });
      }

      return NextResponse.json({ message: "webhook received" });
    }
    default:
      return NextResponse.json({ message: "webhook received" });
  }
}
