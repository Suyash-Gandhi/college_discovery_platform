"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "compare_colleges";
const MAX = 3;

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setIds(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  function persist(next: string[]) {
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const add = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX) return prev;
      const next = [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX
        ? prev
        : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), []);

  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);
  const isFull = ids.length >= MAX;

  return { ids, add, remove, toggle, clear, isSelected, isFull, count: ids.length };
}
