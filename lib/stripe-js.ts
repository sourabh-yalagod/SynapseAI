import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
let stripePromise: Promise<Stripe | null>;
if (!stripeKey) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY required.....!");
}

export async function getStripePromise() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey!);
  }
  return stripePromise;
}
