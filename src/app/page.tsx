import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect College
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Search and compare colleges across India. Filter by fee, rating,
            location, and placement stats to make an informed decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Colleges
            </Link>
            <Link
              href="/compare"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
            Everything you need to choose the right college
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🔍",
    title: "Smart Search",
    description: "Search by name, filter by state, fee range, and ratings.",
  },
  {
    icon: "📊",
    title: "Compare Side by Side",
    description: "Compare up to 3 colleges on fees, placements, and more.",
  },
  {
    icon: "🎓",
    title: "Detailed Profiles",
    description: "View courses, placement stats, and student reviews.",
  },
  {
    icon: "❤️",
    title: "Save Favorites",
    description: "Bookmark colleges and access them anytime after login.",
  },
];

const stats = [
  { value: "52", label: "Colleges Listed" },
  { value: "15", label: "States Covered" },
  { value: "150+", label: "Courses Available" },
  { value: "Free", label: "Always Free" },
];
