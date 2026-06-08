import type { College, Course, Review, User, CollegeType } from "@prisma/client";

// Re-export Prisma enum
export type { CollegeType };

// College with nested relations for detail page
export type CollegeWithDetails = College & {
  courses: Course[];
  reviews: (Review & { user: Pick<User, "id" | "name" | "image"> })[];
  _count: { savedBy: number; reviews: number };
};

// Lightweight college for listing and compare
export type CollegeSummary = Pick<
  College,
  | "id"
  | "name"
  | "slug"
  | "location"
  | "city"
  | "state"
  | "imageUrl"
  | "totalFee"
  | "rating"
  | "type"
  | "placementPercent"
  | "avgPackage"
  | "highestPackage"
  | "establishedYear"
>;

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CollegeListResponse = {
  colleges: CollegeSummary[];
  pagination: PaginationMeta;
};

export type ApiError = {
  error: string;
  details?: unknown;
};
