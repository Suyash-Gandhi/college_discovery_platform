"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/hooks/useCompare";
import CollegeSelector from "@/components/compare/CollegeSelector";
import CompareTable from "@/components/compare/CompareTable";
import CompareChart from "@/components/compare/CompareChart";
import Spinner from "@/components/ui/Spinner";
import type { CollegeSummary } from "@/types";

export default function CompareClient() {
  const { ids, add, remove, clear } = useCompare();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<CollegeSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // If navigated from detail page with ?ids=xxx, pre-add that college
  useEffect(() => {
    const urlId = searchParams.get("ids");
    if (urlId && !ids.includes(urlId)) {
      fetch(`/api/colleges/${urlId}`)
        .then((r) => r.json())
        .then((data: CollegeSummary) => { if (data?.id) add(data.id); })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch full college data whenever ids change
  useEffect(() => {
    if (ids.length === 0) { setColleges([]); return; }
    setLoading(true);
    Promise.all(
      ids.map((id) =>
        fetch(`/api/colleges/${id}`).then((r) => r.json()).catch(() => null)
      )
    )
      .then((results) => setColleges(results.filter(Boolean) as CollegeSummary[]))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select up to 3 colleges to compare side by side.
          </p>
        </div>
        {ids.length > 0 && (
          <button
            onClick={clear}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Add Colleges</h2>
        <CollegeSelector
          selectedIds={ids}
          onAdd={(c) => add(c.id)}
          onRemove={remove}
          selectedColleges={colleges}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {/* Empty state */}
      {!loading && ids.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <span className="text-5xl mb-4">📊</span>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No colleges selected</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Search for colleges above, or click &quot;+ Compare&quot; on any college card to add it here.
          </p>
        </div>
      )}

      {/* Need more */}
      {!loading && ids.length === 1 && (
        <div className="text-center py-10 text-sm text-gray-400">
          Add at least one more college to start comparing.
        </div>
      )}

      {/* Results */}
      {!loading && colleges.length >= 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Visual Comparison</h2>
            <CompareChart colleges={colleges} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Detailed Comparison</h2>
            <CompareTable colleges={colleges} onRemove={remove} />
          </div>
        </div>
      )}
    </div>
  );
}
