"use client";

import { useState } from "react";

const TABS = ["Overview", "Courses", "Placements", "Reviews"] as const;
type Tab = (typeof TABS)[number];

interface DetailTabsProps {
  overview: React.ReactNode;
  courses: React.ReactNode;
  placements: React.ReactNode;
  reviews: React.ReactNode;
}

export default function DetailTabs({ overview, courses, placements, reviews }: DetailTabsProps) {
  const [active, setActive] = useState<Tab>("Overview");

  const panels: Record<Tab, React.ReactNode> = {
    Overview: overview,
    Courses: courses,
    Placements: placements,
    Reviews: reviews,
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div>{panels[active]}</div>
    </div>
  );
}
