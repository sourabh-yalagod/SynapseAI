"use server";
import { userDetail } from "@/app/dashboard/upgrade/page";
import { axiosInstance } from "@/lib/axiosInstance";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
let stripeCustomerId = null;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`;

export default getBaseUrl;
export const createCheckoutSession = async (
  userDetail: userDetail
): Promise<string> => {
  await auth.protect();

  const { userId } = await auth();

  const { data } = await axiosInstance.get(`/api/subscription/${userId}`);
  console.log("DATA FROM SUBSCRIPTION : ", data);

  if (!data?.subscription?.isValid) {
    const newCustomer = await stripe.customers.create({
      email: userDetail.email,
      name: userDetail.name,
      metadata: { userId },
    });
    stripeCustomerId = newCustomer.id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_KEY,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: `${getBaseUrl()}/dashboard?payment=successfull`,
      cancel_url: `${getBaseUrl()}/upgrade?payment=failed`,
    });
    if (!session || !session?.id || !stripeCustomerId) {
      console.error("Stripe session creation failed");
      return "";
    }

    const newSubscription = await axiosInstance.post(
      `/api/subscription/${userId}`,
      {
        userId,
        customerId: stripeCustomerId.toString() || "",
        isValid: false,
      }
    );
    console.log("newSubscription : ", newSubscription?.data);

    return session?.id;
  }
  return "";
};
