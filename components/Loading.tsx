"use client";

import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-900 dark:text-gray-100">
      {/* Loading Spinner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-16 h-16"
      >
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-indigo-500 animate-spin"></div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-5 text-sm sm:text-lg font-medium"
      >
        Loading, please wait...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
