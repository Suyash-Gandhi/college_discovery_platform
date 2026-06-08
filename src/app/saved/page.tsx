import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CollegeGrid from "@/components/colleges/CollegeGrid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved Colleges — CollegeDiscover" };

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/saved");

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, location: true, city: true,
          state: true, imageUrl: true, totalFee: true, rating: true,
          type: true, placementPercent: true, avgPackage: true,
          highestPackage: true, establishedYear: true,
        },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  const colleges = saved.map((s) => s.college);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Colleges</h1>
          <p className="text-sm text-gray-500 mt-1">
            {colleges.length === 0
              ? "You haven't saved any colleges yet."
              : `${colleges.length} college${colleges.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        {colleges.length > 0 && (
          <Link
            href="/compare"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Compare these →
          </Link>
        )}
      </div>

      {colleges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-5xl mb-4">🔖</span>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No saved colleges</h2>
          <p className="text-sm text-gray-400 mb-6">
            Browse colleges and click &quot;Save College&quot; to bookmark them here.
          </p>
          <Link
            href="/colleges"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Colleges
          </Link>
        </div>
      ) : (
        <CollegeGrid colleges={colleges} total={colleges.length} />
      )}
    </div>
  );
}
