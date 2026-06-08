"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { useCompare } from "@/hooks/useCompare";
import type { CollegeSummary, CollegeType } from "@/types";

interface CollegeCardProps {
  college: CollegeSummary;
}

function formatFee(fee: number) {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(1)}L/yr`;
  return `₹${(fee / 1000).toFixed(0)}K/yr`;
}

function formatPackage(pkg: number) {
  return `₹${(pkg / 100000).toFixed(1)}L`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm">★</span>
      <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { toggle, isSelected, isFull } = useCompare();
  const selected = isSelected(college.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <Link href={`/colleges/${college.id}`} className="block group">
        {/* Image */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {college.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={college.imageUrl}
              alt={college.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-4xl">🎓</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge label={college.type} variant={college.type as CollegeType} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {college.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <span>📍</span> {college.location}
          </p>

          <div className="flex items-center justify-between mb-3">
            <StarRating rating={college.rating} />
            <span className="text-sm font-semibold text-blue-600">{formatFee(college.totalFee)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400">Placement</p>
              <p className="text-sm font-semibold text-gray-800">{college.placementPercent}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Avg Package</p>
              <p className="text-sm font-semibold text-gray-800">{formatPackage(college.avgPackage)}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Compare button — outside Link to avoid nested interaction */}
      <div className="px-4 pb-4">
        <button
          onClick={() => toggle(college.id)}
          disabled={!selected && isFull}
          className={`w-full text-xs font-medium py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            selected
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {selected ? "✓ Added to Compare" : isFull ? "Compare Full (max 3)" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}
