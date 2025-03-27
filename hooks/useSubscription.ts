"use client";

import { axiosInstance } from "@/lib/axiosInstance";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

const PRO = 10;
const TRIAL = 2;

const useSubscription = () => {
  const { user } = useUser();
  const [hasActiveMembership, setHasActiveMembership] = useState<
    boolean | null
  >(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;
    console.log("1st one ");

    const fetchSubscription = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/subscription/${user.id}`
        );
        setHasActiveMembership(data?.data ?? null);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  useEffect(() => {
    if (hasActiveMembership === null) return;

    const fetchDocuments = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/document`);
        if (data?.data) {
          console.log(data?.data.length);

          setIsOverFileLimit(
            hasActiveMembership
              ? data.data.length > PRO
              : data.data.length >= TRIAL
          );
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [hasActiveMembership, user?.id]);

  console.log({ hasActiveMembership, isOverFileLimit });

  return { hasActiveMembership, isOverFileLimit };
};

export default useSubscription;
