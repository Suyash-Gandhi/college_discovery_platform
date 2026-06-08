import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: { orderBy: { name: "asc" } },
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { savedBy: true, reviews: true } },
    },
  });

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  return NextResponse.json(college);
}
