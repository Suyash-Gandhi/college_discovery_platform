import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const reviewSchema = z.object({
  collegeId: z.string().cuid("Invalid college ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(500),
});

export const collegeQuerySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  minFee: z.coerce.number().optional(),
  maxFee: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(9),
  sortBy: z.enum(["rating", "totalFee", "name", "placementPercent"]).default("rating"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CollegeQuery = z.infer<typeof collegeQuerySchema>;
