"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Delete, File, Loader, Trash } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDeleteDocumentMutation } from "@/app/state/api";
import { useState } from "react";

interface DocumentProps {
  _id: string;
  clerkId: string;
  createdAt: string;
  subscription: string;
  updatedAt: string;
  url: string;
  name: string;
  username: string;
  coverImage?: string;
}
const DocumentCard: React.FC<{ document: DocumentProps }> = ({ document }) => {
  const [loading, setLoading] = useState(false);
  const [deleteDocument] = useDeleteDocumentMutation();
  const handleDelete = async (documentId: string) => {
    if (!documentId) return;
    try {
      setLoading(true);
      const { data, error } = await deleteDocument(documentId);

      console.log("🚀 ~ handleDelete ~ data OR error:", { data, error });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const defaultCover =
    "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"; // Default icon
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative p-4 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Cover Image */}
      <div className="grid w-full h-48 rounded-md overflow-hidden">
        <div className="absolute z-10 top-4 right-2 justify-around flex gap-4">
          <div
            onClick={() => handleDelete(document._id)}
            className="flex gap-1 bg-red-600 py-1 px-2 hover:scale-95 transition cursor-pointer rounded-md items-center"
          >
            {loading ? (
              <div className="grid place-items-center">
                <Loader className="animate-spin size-5" />
              </div>
            ) : (
              <>
                <label>Delete File</label>
                <Trash className="size-5" />
              </>
            )}
          </div>
          <div
            className="flex gap-1 bg-green-600 py-1 px-2 hover:scale-95 transition cursor-pointer rounded-md items-center"
            onClick={() => router.push(`/dashboard/file/${document?._id}`)}
          >
            <label className="text-white italic"> Chat with </label>
            <File className="size-5" />
          </div>
        </div>
        <Image
          src={document.coverImage || defaultCover}
          alt="Document Cover"
          fill
          className="object-center scale-50 pb-10"
        />
      </div>

      {/* Document Details */}
      <div className="flex justify-between items-center mb-2">
        <div className="grid items-center space-y-2 font-semibold justify-between px-1 text-xs">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {document?.name.split(".")[0] || "Unknown File"}
          </h2>
          <h2 className="">{document?.username || "Unknown User"}</h2>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            document.subscription === "premium"
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {document.subscription.charAt(0).toUpperCase() +
            document.subscription.slice(1)}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Created: {new Date(document.createdAt).toLocaleString()}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <Link
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm font-medium"
        >
          View Document
        </Link>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
