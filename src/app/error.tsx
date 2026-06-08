"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-5xl mb-4">⚠️</span>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
