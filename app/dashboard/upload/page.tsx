"use client";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const onDrop = useCallback(async (files: any[]) => {
    if (!files[0]) return;
    setLoading(true);
    const file = files[0];
    console.log("FILE : ", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", data);
      router.push(`/dashboard/file/${data?.document?._id}`);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="w-full min-h-screen px-10">
      <motion.div
        initial={{ scale: 0, y: -500, opacity: 0 }}
        animate={{ scale: 1, y: 50, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl shadow-lg bg-white/20 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600 backdrop-blur-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:border-blue-500"
      >
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl shadow-lg bg-white/20 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600 backdrop-blur-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:border-blue-500"
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ y: -5 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <UploadCloud size={50} className="text-blue-500 mb-4" />
          </motion.div>
          {isDragActive ? (
            <motion.p className="text-lg font-medium text-blue-500">
              Drop the files here...
            </motion.p>
          ) : (
            <p className="text-lg font-medium">
              Drag & drop some files here, or{" "}
              <span className="text-blue-500 font-semibold">click</span> to
              select files.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Upload;
