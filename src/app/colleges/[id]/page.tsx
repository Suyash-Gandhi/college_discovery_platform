import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import CourseList from "@/components/detail/CourseList";
import PlacementStats from "@/components/detail/PlacementStats";
import ReviewSection from "@/components/detail/ReviewSection";
import DetailTabs from "@/components/detail/DetailTabs";
import SaveButton from "@/components/detail/SaveButton";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";
import type { CollegeType } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await prisma.college.findUnique({ where: { id }, select: { name: true, location: true } });
  if (!college) return { title: "College Not Found" };
  return {
    title: `${college.name} — CollegeDiscover`,
    description: `Explore courses, placement stats, and reviews for ${college.name} in ${college.location}.`,
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [college, session] = await Promise.all([
    prisma.college.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { name: "asc" } },
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { savedBy: true, reviews: true } },
      },
    }),
    auth(),
  ]);

  if (!college) notFound();

  // Check if current user has saved this college
  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId: id } },
      select: { id: true },
    });
    isSaved = !!saved;
  }

  const avgRating =
    college.reviews.length > 0
      ? college.reviews.reduce((s: any, r: { rating: any; }) => s + r.rating, 0) / college.reviews.length
      : college.rating;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-8">
        <div className="relative h-56 sm:h-72 bg-gray-100">
          {college.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={college.imageUrl}
              alt={college.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-6xl">🎓</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="mb-2">
                <Badge label={college.type} variant={college.type as CollegeType} />
              </div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight drop-shadow">
                {college.name}
              </h1>
              <p className="text-white/80 text-sm mt-1">📍 {college.location}</p>
            </div>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="bg-white px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Rating</p>
            <p className="font-bold text-gray-800">
              <span className="text-yellow-400">★</span> {avgRating.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Annual Fee</p>
            <p className="font-bold text-blue-600">₹{(college.totalFee / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Established</p>
            <p className="font-bold text-gray-800">{college.establishedYear}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Affiliated To</p>
            <p className="font-bold text-gray-800 text-sm truncate">{college.affiliatedTo ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <SaveButton collegeId={college.id} initialSaved={isSaved} />
        <a
          href={`/compare?ids=${college.id}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          📊 Compare
        </a>
      </div>

      {/* Tabbed content */}
      <DetailTabs
        overview={
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">{college.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {[
                { label: "Type", value: college.type },
                { label: "City", value: college.city },
                { label: "State", value: college.state },
                { label: "Established", value: college.establishedYear },
                { label: "Total Reviews", value: college._count.reviews },
                { label: "Students Saved", value: college._count.savedBy },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        }
        courses={<CourseList courses={college.courses} />}
        placements={
          <PlacementStats
            placementPercent={college.placementPercent}
            avgPackage={college.avgPackage}
            highestPackage={college.highestPackage}
          />
        }
        reviews={
          <ReviewSection
            collegeId={college.id}
            initialReviews={college.reviews}
          />
        }
      />
    </div>
  );
}
