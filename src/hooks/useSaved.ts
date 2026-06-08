"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useSaved() {
  const { data: session } = useSession();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) { setSavedIds([]); return; }
    setLoading(true);
    fetch("/api/saved")
      .then((r) => r.json())
      .then((colleges: { id: string }[]) => setSavedIds(colleges.map((c) => c.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const toggle = useCallback(async (collegeId: string) => {
    const isSaved = savedIds.includes(collegeId);
    // Optimistic
    setSavedIds((prev) =>
      isSaved ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
    );
    const res = await fetch("/api/saved", {
      method: isSaved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId }),
    });
    // Revert on error
    if (!res.ok) {
      setSavedIds((prev) =>
        isSaved ? [...prev, collegeId] : prev.filter((id) => id !== collegeId)
      );
    }
  }, [savedIds]);

  return { savedIds, toggle, loading, isSaved: (id: string) => savedIds.includes(id) };
}
