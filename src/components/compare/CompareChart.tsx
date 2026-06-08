"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import type { CollegeSummary } from "@/types";

interface CompareChartProps {
  colleges: CollegeSummary[];
}

type ChartMetric = "fees" | "rating" | "placement" | "avgPackage";

const METRICS: { key: ChartMetric; label: string }[] = [
  { key: "fees",       label: "Annual Fee (₹L)" },
  { key: "rating",     label: "Rating (out of 5)" },
  { key: "placement",  label: "Placement (%)" },
  { key: "avgPackage", label: "Avg Package (₹L)" },
];

const COLORS = ["#2563eb", "#16a34a", "#d97706"];

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function CompareChart({ colleges }: CompareChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("fees");

  if (colleges.length < 2) return null;

  const activeMetric = METRICS.find((m) => m.key === metric)!;

  // Build one data point per college name, keyed by college name
  // Each college gets its own bar entry
  const data = colleges.map((c) => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
    value:
      metric === "fees"
        ? +(c.totalFee / 100000).toFixed(1)
        : metric === "rating"
        ? +c.rating.toFixed(1)
        : metric === "placement"
        ? +c.placementPercent.toFixed(1)
        : +(c.avgPackage / 100000).toFixed(1),
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Metric selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              metric === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="value"
            name={activeMetric.label}
            radius={[6, 6, 0, 0]}
            maxBarSize={80}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
