import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-lg font-bold text-blue-600">CollegeDiscover</span>
            <p className="text-sm text-gray-500 mt-1">
              Find and compare the best colleges in India.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/colleges" className="hover:text-blue-600 transition-colors">
              Colleges
            </Link>
            <Link href="/compare" className="hover:text-blue-600 transition-colors">
              Compare
            </Link>
            <Link href="/saved" className="hover:text-blue-600 transition-colors">
              Saved
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} CollegeDiscover. Built for learning.
        </p>
      </div>
    </footer>
  );
}
