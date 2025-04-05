"use server";

import getBaseUrl from "@/lib/baseUrl";
import stripe from "@/lib/stripe";
import { Subscription } from "@/models/model";
import { auth } from "@clerk/nextjs/server";

export const subscriptionPortal = async () => {
  await auth.protect();
  const { userId } = await auth();

  const subscription = await Subscription.findOne({ userId });
  if (!subscription.customerId) {
    throw new Error("subscription.customerId is required . . . !");
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.customerId,
    return_url: `${getBaseUrl()}/dashboard?payment-portal=true`,
  });
  return session?.url || "/dashboard/upgrade?payment-portal=false";
};
