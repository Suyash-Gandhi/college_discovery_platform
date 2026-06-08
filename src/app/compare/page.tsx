import { Suspense } from "react";
import CompareClient from "@/components/compare/CompareClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compare Colleges — CollegeDiscover" };

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      }
    >
      <CompareClient />
    </Suspense>
  );
}
