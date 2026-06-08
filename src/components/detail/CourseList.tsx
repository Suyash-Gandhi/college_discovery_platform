import type { Course } from "@prisma/client";

function formatFee(fee: number) {
  return `₹${(fee / 1000).toFixed(0)}K/yr`;
}

export default function CourseList({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return <p className="text-sm text-gray-400">No courses listed yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 pr-4 font-semibold text-gray-600">Course</th>
            <th className="text-left py-3 pr-4 font-semibold text-gray-600">Duration</th>
            <th className="text-left py-3 pr-4 font-semibold text-gray-600">Fee / Year</th>
            <th className="text-left py-3 font-semibold text-gray-600">Seats</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4 font-medium text-gray-800">{course.name}</td>
              <td className="py-3 pr-4 text-gray-500">{course.duration} yr</td>
              <td className="py-3 pr-4 text-blue-600 font-medium">{formatFee(course.fee)}</td>
              <td className="py-3 text-gray-500">{course.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
