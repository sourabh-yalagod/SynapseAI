"use client";

import DocumentCard from "@/components/DocumentCard";
import LoadingPage from "@/components/Loading";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useGetDocumentsQuery } from "../state/api";
import { useUser } from "@clerk/nextjs";
import ErrorPage from "@/components/ErrorPage";
import { toast } from "sonner";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    data: response,
    error,
    isLoading,
  } = useGetDocumentsQuery(user?.id, {
    skip: !user || !user?.id,
  });
  console.log(`🚀 ~ Dashboard ~ {data,error,isLoading}:`, {
    response,
    error,
    isLoading,
  });
  if (error) return <ErrorPage />;
  useEffect(() => {
    if (response?.data) {
      toast.success(response?.message);
    }
    if (error) {
      toast.error("something went wrong....!");
    }
  }, [response, error]);
  if (isLoading) return <LoadingPage />;
  return (
    <div className="mx-auto mt-10 px-3 sm:px-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Documents</h1>
      <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-3 justify-around w-full">
        {response?.data?.map((doc: any) => (
          <DocumentCard key={Math.random()} document={doc} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
