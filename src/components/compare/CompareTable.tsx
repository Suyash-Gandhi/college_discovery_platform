import Link from "next/link";
import type { CollegeSummary } from "@/types";

interface CompareTableProps {
  colleges: CollegeSummary[];
  onRemove: (id: string) => void;
}

function fmt(value: number, type: "fee" | "package" | "percent" | "rating" | "year") {
  switch (type) {
    case "fee":      return `₹${(value / 100000).toFixed(1)}L`;
    case "package":  return `₹${(value / 100000).toFixed(1)} LPA`;
    case "percent":  return `${value}%`;
    case "rating":   return value.toFixed(1);
    case "year":     return String(value);
  }
}

type MetricKey = keyof CollegeSummary;

const ROWS: { label: string; key: MetricKey; type: "fee" | "package" | "percent" | "rating" | "year" | "text"; best?: "high" | "low" }[] = [
  { label: "Location",          key: "location",         type: "text" },
  { label: "Type",              key: "type",             type: "text" },
  { label: "Established",       key: "establishedYear",  type: "year" },
  { label: "Annual Fee",        key: "totalFee",         type: "fee",     best: "low" },
  { label: "Rating",            key: "rating",           type: "rating",  best: "high" },
  { label: "Placement Rate",    key: "placementPercent", type: "percent", best: "high" },
  { label: "Avg Package",       key: "avgPackage",       type: "package", best: "high" },
  { label: "Highest Package",   key: "highestPackage",   type: "package", best: "high" },
];

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) return null;

  function getBest(key: MetricKey, direction: "high" | "low"): string | null {
    const nums = colleges.map((c) => Number(c[key])).filter((n) => !isNaN(n));
    if (nums.length < 2) return null;
    const target = direction === "high" ? Math.max(...nums) : Math.min(...nums);
    const best = colleges.find((c) => Number(c[key]) === target);
    return best?.id ?? null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-5 py-4 font-semibold text-gray-500 w-36">Metric</th>
            {colleges.map((c) => (
              <th key={c.id} className="px-5 py-4 text-center min-w-[200px]">
                <div className="flex flex-col items-center gap-1">
                  <Link
                    href={`/colleges/${c.id}`}
                    className="font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-tight text-center"
                  >
                    {c.name}
                  </Link>
                  <button
                    onClick={() => onRemove(c.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ROWS.map((row) => {
            const bestId = row.best ? getBest(row.key, row.best) : null;
            return (
              <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-500">{row.label}</td>
                {colleges.map((c) => {
                  const raw = c[row.key];
                  const isBest = bestId === c.id;
                  const display =
                    row.type === "text"
                      ? String(raw ?? "—")
                      : fmt(Number(raw), row.type as "fee" | "package" | "percent" | "rating" | "year");

                  return (
                    <td
                      key={c.id}
                      className={`px-5 py-3.5 text-center font-medium transition-colors ${
                        isBest
                          ? "text-green-700 bg-green-50"
                          : "text-gray-700"
                      }`}
                    >
                      {isBest && <span className="text-xs mr-1">✓</span>}
                      {display}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
