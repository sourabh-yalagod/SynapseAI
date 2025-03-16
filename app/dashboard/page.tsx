"use client";

import DocumentCard from "@/components/DocumentCard";
import LoadingPage from "@/components/Loading";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("/api/document");
        console.log("🚀 ~ fetchDocuments ~ response:", response);
        setDocuments(response?.data?.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);
  if (loading) return <LoadingPage />;
  return (
    <div className="mx-auto mt-10 px-3 sm:px-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Documents</h1>
      <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-3 justify-around w-full">
        {documents.map((doc) => (
          <DocumentCard key={Math.random()} document={doc} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
