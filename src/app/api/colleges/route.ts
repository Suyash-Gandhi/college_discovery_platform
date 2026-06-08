import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeQuerySchema } from "@/lib/validations";
import type { CollegeListResponse } from "@/types";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = collegeQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { search, state, minFee, maxFee, minRating, page, limit, sortBy, order } =
    parsed.data;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { city: { contains: search, mode: "insensitive" as const } },
        { state: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(state && { state: { equals: state, mode: "insensitive" as const } }),
    ...(minFee !== undefined || maxFee !== undefined
      ? { totalFee: { ...(minFee !== undefined && { gte: minFee }), ...(maxFee !== undefined && { lte: maxFee }) } }
      : {}),
    ...(minRating !== undefined && { rating: { gte: minRating } }),
  };

  const [total, colleges] = await Promise.all([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        city: true,
        state: true,
        imageUrl: true,
        totalFee: true,
        rating: true,
        type: true,
        placementPercent: true,
        avgPackage: true,
        highestPackage: true,
        establishedYear: true,
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const response: CollegeListResponse = {
    colleges,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };

  return NextResponse.json(response);
}
