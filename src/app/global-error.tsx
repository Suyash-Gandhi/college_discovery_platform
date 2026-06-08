"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <span className="text-5xl mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">A critical error occurred.</p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
