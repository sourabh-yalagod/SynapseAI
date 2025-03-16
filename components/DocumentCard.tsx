"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface DocumentProps {
  _id: string;
  clerkId: string;
  createdAt: string;
  subscription: string;
  updatedAt: string;
  url: string;
  username: string;
  coverImage?: string; // New cover image property (optional)
}

const DocumentCard: React.FC<{ document: DocumentProps }> = ({ document }) => {
  const defaultCover =
    "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"; // Default icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Cover Image */}
      <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
        <Image
          src={document.coverImage || defaultCover}
          alt="Document Cover"
          fill
          className="object-center"
        />
      </div>

      {/* Document Details */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {document.username || "Unknown User"}
        </h2>
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
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ID: {document._id}
        </span>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
