import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl mb-4">🎓</span>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-lg text-gray-500 mb-6">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/colleges"
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Browse Colleges
      </Link>
    </div>
  );
}
