"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  collegeId: string;
  initialSaved: boolean;
}

export default function SaveButton({ collegeId, initialSaved }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!session) {
      router.push(`/login?callbackUrl=/colleges/${collegeId}`);
      return;
    }

    setLoading(true);
    // Optimistic update
    setSaved((prev) => !prev);

    try {
      const res = await fetch("/api/saved", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (!res.ok) setSaved((prev) => !prev); // revert on error
    } catch {
      setSaved((prev) => !prev); // revert on network error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 ${
        saved
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {saved ? "❤️ Saved" : "🤍 Save College"}
    </button>
  );
}
