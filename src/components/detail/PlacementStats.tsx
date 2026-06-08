interface PlacementStatsProps {
  placementPercent: number;
  avgPackage: number;
  highestPackage: number;
}

function formatPackage(n: number) {
  return `₹${(n / 100000).toFixed(1)} LPA`;
}

export default function PlacementStats({
  placementPercent,
  avgPackage,
  highestPackage,
}: PlacementStatsProps) {
  const stats = [
    {
      label: "Placement Rate",
      value: `${placementPercent}%`,
      icon: "🎯",
      color: "bg-green-50 border-green-100",
      valueColor: "text-green-700",
    },
    {
      label: "Average Package",
      value: formatPackage(avgPackage),
      icon: "💼",
      color: "bg-blue-50 border-blue-100",
      valueColor: "text-blue-700",
    },
    {
      label: "Highest Package",
      value: formatPackage(highestPackage),
      icon: "🏆",
      color: "bg-purple-50 border-purple-100",
      valueColor: "text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl border p-5 ${s.color}`}>
          <div className="text-2xl mb-2">{s.icon}</div>
          <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
          <p className="text-sm text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
