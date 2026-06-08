"use client";

import { useState, useEffect, useRef } from "react";
import type { CollegeSummary } from "@/types";

interface CollegeSelectorProps {
  selectedIds: string[];
  onAdd: (college: CollegeSummary) => void;
  onRemove: (id: string) => void;
  selectedColleges: CollegeSummary[];
}

export default function CollegeSelector({
  selectedIds,
  onAdd,
  onRemove,
  selectedColleges,
}: CollegeSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.colleges ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isFull = selectedIds.length >= 3;

  return (
    <div className="space-y-4">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {selectedColleges.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
          >
            {c.name}
            <button
              onClick={() => onRemove(c.id)}
              className="hover:text-blue-900 transition-colors text-base leading-none"
              aria-label={`Remove ${c.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {selectedIds.length === 0 && (
          <span className="text-sm text-gray-400">No colleges selected yet</span>
        )}
      </div>

      {/* Search input */}
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          disabled={isFull}
          placeholder={isFull ? "Maximum 3 colleges selected" : "Search and add a college..."}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Dropdown results */}
        {open && results.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {results.map((college) => {
              const already = selectedIds.includes(college.id);
              return (
                <button
                  key={college.id}
                  onClick={() => {
                    if (!already) { onAdd(college); setQuery(""); setOpen(false); }
                  }}
                  disabled={already || isFull}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-50 last:border-0 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{college.name}</p>
                    <p className="text-xs text-gray-400">{college.location}</p>
                  </div>
                  {already ? (
                    <span className="text-xs text-blue-500 font-medium">Added</span>
                  ) : (
                    <span className="text-xs text-gray-400">+ Add</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400">{selectedIds.length}/3 colleges selected</p>
    </div>
  );
}
