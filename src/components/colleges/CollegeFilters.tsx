"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STATES = [
  "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka",
  "Rajasthan", "West Bengal", "Uttar Pradesh",
];

const FEE_RANGES = [
  { label: "Under ₹1L", min: 0, max: 100000 },
  { label: "₹1L – ₹2L", min: 100000, max: 200000 },
  { label: "₹2L – ₹3L", min: 200000, max: 300000 },
  { label: "Above ₹3L", min: 300000, max: undefined },
];

const RATINGS = [
  { label: "4.5+", value: 4.5 },
  { label: "4.0+", value: 4.0 },
  { label: "3.5+", value: 3.5 },
];

const SORT_OPTIONS = [
  { label: "Highest Rated", value: "rating", order: "desc" },
  { label: "Lowest Fee", value: "totalFee", order: "asc" },
  { label: "Highest Fee", value: "totalFee", order: "desc" },
  { label: "Best Placement", value: "placementPercent", order: "desc" },
  { label: "Name A–Z", value: "name", order: "asc" },
];

export default function CollegeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    for (const [key, val] of Object.entries(updates)) {
      if (val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeState = searchParams.get("state") ?? "";
  const activeMinFee = searchParams.get("minFee") ?? "";
  const activeMaxFee = searchParams.get("maxFee") ?? "";
  const activeRating = searchParams.get("minRating") ?? "";
  const activeSort = searchParams.get("sortBy") ?? "rating";
  const activeOrder = searchParams.get("order") ?? "desc";

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = !!(activeState || activeMinFee || activeMaxFee || activeRating);

  return (
    <aside className="w-full space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
        <select
          value={`${activeSort}__${activeOrder}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split("__");
            updateParam({ sortBy, order });
          }}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.value}__${opt.order}`} value={`${opt.value}__${opt.order}`}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">State</h3>
        <div className="space-y-1.5">
          {STATES.map((state) => (
            <label key={state} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="state"
                checked={activeState === state}
                onChange={() =>
                  updateParam({ state: activeState === state ? undefined : state })
                }
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                {state}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fee Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Annual Fee</h3>
        <div className="space-y-1.5">
          {FEE_RANGES.map((range) => {
            const isActive =
              activeMinFee === String(range.min) &&
              activeMaxFee === String(range.max ?? "");
            return (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="feeRange"
                  checked={isActive}
                  onChange={() =>
                    updateParam(
                      isActive
                        ? { minFee: undefined, maxFee: undefined }
                        : {
                            minFee: String(range.min),
                            maxFee: range.max !== undefined ? String(range.max) : undefined,
                          }
                    )
                  }
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Minimum Rating</h3>
        <div className="space-y-1.5">
          {RATINGS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={activeRating === String(r.value)}
                onChange={() =>
                  updateParam({
                    minRating: activeRating === String(r.value) ? undefined : String(r.value),
                  })
                }
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                ★ {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg py-2 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
