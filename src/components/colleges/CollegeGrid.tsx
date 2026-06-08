import CollegeCard from "@/components/colleges/CollegeCard";
import type { CollegeSummary } from "@/types";

interface CollegeGridProps {
  colleges: CollegeSummary[];
  total: number;
}

export default function CollegeGrid({ colleges, total }: CollegeGridProps) {
  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No colleges found</h3>
        <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-medium text-gray-700">{colleges.length}</span> of{" "}
        <span className="font-medium text-gray-700">{total}</span> colleges
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
      </div>
    </div>
  );
}
