"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorPageProps {
  errorMessage?: string;
  onRetry?: () => void;
}

const ErrorPage = ({ errorMessage, onRetry }: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-6">
      <div className="max-w-md text-center space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-xl font-semibold">Oops! Something went wrong.</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {errorMessage ||
            "An unexpected error has occurred. Please try again later."}
        </p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <RefreshCcw size={18} />
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
