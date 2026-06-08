import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { collegeQuerySchema } from "@/lib/validations";
import CollegeGrid from "@/components/colleges/CollegeGrid";
import CollegeFilters from "@/components/colleges/CollegeFilters";
import SearchBar from "@/components/colleges/SearchBar";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Colleges — CollegeDiscover",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function CollegesContent({ searchParams }: { searchParams: Record<string, string> }) {
  const parsed = collegeQuerySchema.safeParse(searchParams);
  if (!parsed.success) return <p className="text-red-500 text-sm">Invalid filters.</p>;

  const { search, state, minFee, maxFee, minRating, page, limit, sortBy, order } = parsed.data;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { city: { contains: search, mode: "insensitive" as const } },
        { state: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(state && { state: { equals: state, mode: "insensitive" as const } }),
    ...(minFee !== undefined || maxFee !== undefined
      ? { totalFee: { ...(minFee !== undefined && { gte: minFee }), ...(maxFee !== undefined && { lte: maxFee }) } }
      : {}),
    ...(minRating !== undefined && { rating: { gte: minRating } }),
  };

  const [total, colleges] = await Promise.all([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      select: {
        id: true, name: true, slug: true, location: true, city: true,
        state: true, imageUrl: true, totalFee: true, rating: true,
        type: true, placementPercent: true, avgPackage: true,
        highestPackage: true, establishedYear: true,
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return (
    <>
      <CollegeGrid colleges={colleges} total={total} />
      <Pagination totalPages={Math.ceil(total / limit)} currentPage={page} />
    </>
  );
}

function CollegesSkeleton() {
  return (
    <div>
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-44 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CollegesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Colleges</h1>
        <p className="text-sm text-gray-500">Filter, search, and discover colleges across India.</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-11 bg-gray-200 rounded-lg animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-56 shrink-0">
          <Suspense fallback={<div className="space-y-4">{Array.from({length:4}).map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"/>)}</div>}>
            <CollegeFilters />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<CollegesSkeleton />}>
            <CollegesContent searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
