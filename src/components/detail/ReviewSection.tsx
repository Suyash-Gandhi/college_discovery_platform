"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Review, User } from "@prisma/client";

type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name" | "image">;
};

interface ReviewSectionProps {
  collegeId: string;
  initialReviews: ReviewWithUser[];
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${star <= value ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewWithUser }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
            {review.user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{review.user.name ?? "Anonymous"}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex text-yellow-400 text-sm">
          {"★".repeat(review.rating)}
          <span className="text-gray-200">{"★".repeat(5 - review.rating)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}

export default function ReviewSection({ collegeId, initialReviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    if (comment.trim().length < 10) { setError("Review must be at least 10 characters."); return; }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId, rating, comment: comment.trim() }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }

      setReviews((prev) => [data, ...prev]);
      setRating(0);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{avgRating ?? "—"}</p>
          <div className="text-yellow-400 text-lg">{"★".repeat(Math.round(Number(avgRating) || 0))}</div>
          <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Submit form */}
      {session ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">Write a Review</h3>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Your Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Share your experience at this college..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">✓ Review submitted successfully!</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-600 mb-3">Sign in to write a review</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Login to Review
          </Link>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No reviews yet. Be the first to review this college!
          </p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}
