"use client";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { subscriptionPortal } from "@/actions/subscriptionPortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import { getStripePromise } from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState, useTransition } from "react";
export interface userDetail {
  email: string;
  name: string;
}
const PricingModel = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { hasActiveMembership, isOverFileLimit, isSubscriptionLoading } =
    useSubscription();
  const [isPending, startTransition] = useTransition();
  const handleUpgrade = () => {
    if (!user) return;

    const userDetail: userDetail = {
      email:
        user?.primaryEmailAddress?.emailAddress ||
        user?.primaryEmailAddress?.toString() ||
        "",
      name: user?.username || user?.firstName || user?.fullName || "",
    };
    startTransition(async () => {
      const stripePromise = await getStripePromise();

      if (hasActiveMembership) {
        const portalLink = await subscriptionPortal();
        router.push(portalLink);
      } else {
        const sessionId = await createCheckoutSession(userDetail);
        console.log(sessionId);
        if (sessionId) await stripePromise?.redirectToCheckout({ sessionId });
      }
    });
  };
  return (
    <div>
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            Supercharge your Document Companion
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow.
        </p>

        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
          {/* FREE */}
          <div className="ring-1 ring-gray-200 dark:ring-gray-700 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-100">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Explore Core Features at No Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Free
              </span>
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
            >
              {/* List items remain same structure with dark mode text colors */}
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" />
                2 Documents
              </li>
              {/* ... other list items */}
            </ul>
          </div>

          {/* PRO */}
          <div className="ring-2 ring-indigo-600 dark:ring-indigo-500 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600 dark:text-indigo-400">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                $5.99
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                / month
              </span>
            </p>

            <Button
              className="bg-indigo-600 dark:bg-indigo-500 w-full text-white dark:text-gray-100 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 mt-4 block rounded-md text-center text-sm font-semibold focus-visible:outline-indigo-600 transition-colors"
              disabled={loading || isPending || isSubscriptionLoading}
              onClick={handleUpgrade}
            >
              {isPending || loading || isSubscriptionLoading ? (
                <Loader className="animate-spin mx-auto" />
              ) : hasActiveMembership ? (
                "Manage Plan"
              ) : (
                "Upgrade to Pro"
              )}
            </Button>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
            >
              {/* Pro plan list items */}
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" />
                Store upto 20 Documents
              </li>
              {/* ... other list items */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModel;
