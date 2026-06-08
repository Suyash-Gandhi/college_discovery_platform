"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            CollegeDiscover
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/colleges"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Compare
            </Link>
            {session ? (
              <>
                <Link
                  href="/saved"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Saved
                </Link>
                <span className="text-sm text-gray-500">
                  {session.user?.name ?? session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-3">
            <Link href="/colleges" className="text-sm text-gray-700 font-medium px-1" onClick={() => setMenuOpen(false)}>
              Colleges
            </Link>
            <Link href="/compare" className="text-sm text-gray-700 font-medium px-1" onClick={() => setMenuOpen(false)}>
              Compare
            </Link>
            {session ? (
              <>
                <Link href="/saved" className="text-sm text-gray-700 font-medium px-1" onClick={() => setMenuOpen(false)}>
                  Saved
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="text-sm text-red-500 font-medium text-left px-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 font-medium px-1" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="text-sm text-blue-600 font-medium px-1" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
