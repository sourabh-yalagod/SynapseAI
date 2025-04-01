"use client";

import { useGetDocumentsQuery, useGetSubscriptionQuery } from "@/app/state/api";
import { axiosInstance } from "@/lib/axiosInstance";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { skip } from "node:test";
import { useEffect, useState } from "react";

const PRO = 10;
const TRIAL = 2;

const useSubscription = () => {
  const [documentCount, setDocumentCount] = useState(0);
  const { user } = useUser();
  const [hasActiveMembership, setHasActiveMembership] = useState<
    boolean | null
  >(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState<boolean>(false);

  const { data: documents } = useGetDocumentsQuery(user?.id, {
    skip: !user || !user.id,
  });

  const {
    data: subscription,
    error,
    isLoading,
  } = useGetSubscriptionQuery(user?.id, {
    skip: !user || !user.id,
  });

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ data?.subscription?.isValid:",
      subscription?.subscription?.isValid
    );
    setHasActiveMembership(subscription?.subscription?.isValid);
  }, [user?.id, subscription]);

  useEffect(() => {
    if (hasActiveMembership === null && !documents?.data) return;

    setDocumentCount(documents?.data?.length);
    setIsOverFileLimit(
      hasActiveMembership
        ? documents?.data.length >= PRO
        : documents?.data.length >= TRIAL
    );
  }, [hasActiveMembership, user?.id, documents]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    documentCount,
    isSubscriptionLoading: isLoading,
  };
};

export default useSubscription;
